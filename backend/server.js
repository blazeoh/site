const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('site.db');

app.use(express.json());
app.use(cookieParser());

// Initialize tables
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT NOT NULL, banned INTEGER DEFAULT 0)');
  db.run(`CREATE TABLE IF NOT EXISTS activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    username TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Get all users
app.get('/api/users', (req, res) => {
  db.all('SELECT username, banned FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows.map(r => ({ username: r.username, banned: !!r.banned })));
  });
});

// Ban user
app.post('/api/ban', (req, res) => {
  const { username } = req.body;
  db.run('UPDATE users SET banned = 1 WHERE username = ?', [username], function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ success: true });
  });
});

// Unban user
app.post('/api/unban', (req, res) => {
  const { username } = req.body;
  db.run('UPDATE users SET banned = 0 WHERE username = ?', [username], function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ success: true });
  });
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';
const JWT_EXPIRES_IN = '7d';

// Middleware to authenticate JWT from cookie
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}
// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, '../frontend')));

const jobsFile = path.join(__dirname, 'jobs.json');
const usersFile = path.join(__dirname, 'users.json');

// Helper to read users
function readUsers() {
  if (fs.existsSync(usersFile)) {
    return JSON.parse(fs.readFileSync(usersFile));
  }
  return [];
}

// Helper to write users
function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Sign up endpoint (with password)
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || typeof username !== 'string' || !username.trim()) {
    return res.status(400).json({ error: 'Username required' });
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  // Check if user exists
  db.get('SELECT username FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (row) return res.status(409).json({ error: 'Username already exists' });
    // Hash password
    const hash = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ error: 'DB error' });
      }
      // Log activity
      db.run('INSERT INTO activity (type, username, details) VALUES (?, ?, ?)', [
        'signup', username, JSON.stringify({})
      ]);
      // Create JWT
      const token = jwt.sign({ username: username, banned: false }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      res.json({ success: true, user: { username, banned: false } });
    });
  });
});

// Login endpoint (with password, sets JWT cookie)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || typeof username !== 'string' || !username.trim()) {
    return res.status(400).json({ error: 'Username required' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password required' });
  }
  db.get('SELECT username, password, banned FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(404).json({ error: 'User not found' });
    if (row.banned) return res.status(403).json({ error: 'User is banned' });
    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });
    // Create JWT
    const token = jwt.sign({ username: row.username, banned: !!row.banned }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.json({ success: true, user: { username: row.username, banned: !!row.banned } });
  });
});

// Logout endpoint (clears cookie)
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// Get current user from JWT cookie
app.get('/api/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Save accepted job
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Proxy endpoint for Arbeitnow API
app.get('/api/jobs', async (req, res) => {
  try {
    const response = await fetch('https://www.arbeitnow.com/api/job-board-api');
    console.log('Arbeitnow API status:', response.status);
    if (!response.ok) {
      const text = await response.text();
      console.error('Arbeitnow API error:', text);
      throw new Error('Failed to fetch jobs');
    }
    const data = await response.json();
    console.log('Arbeitnow API data:', data);
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});
app.post('/api/accept-job', (req, res) => {
  const job = req.body;
  if (!job || !job.title || !job.username) {
    return res.status(400).json({ error: 'Invalid job data' });
  }
  let jobs = [];
  if (fs.existsSync(jobsFile)) {
    jobs = JSON.parse(fs.readFileSync(jobsFile));
  }
  jobs.push(job);
  fs.writeFileSync(jobsFile, JSON.stringify(jobs, null, 2));
  // Log activity
  db.run('INSERT INTO activity (type, username, details) VALUES (?, ?, ?)', [
    'accept-job', job.username, JSON.stringify(job)
  ]);
  res.json({ success: true });
});
// Admin: Get activity log
app.get('/api/activity', (req, res) => {
  db.all('SELECT * FROM activity ORDER BY created_at DESC LIMIT 100', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// Get all accepted jobs
app.get('/api/accepted-jobs', (req, res) => {
  let jobs = [];
  if (fs.existsSync(jobsFile)) {
    jobs = JSON.parse(fs.readFileSync(jobsFile));
  }
  res.json(jobs);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
