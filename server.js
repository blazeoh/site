const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('site.db');

// Initialize tables
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, banned INTEGER DEFAULT 0)');
  db.run('CREATE TABLE IF NOT EXISTS activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    username TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )');
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


app.use(express.json());
// Serve static files from the 'site' folder
app.use(express.static(path.join(__dirname, 'site')));

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

// Sign up endpoint
app.post('/api/signup', (req, res) => {
  const { username } = req.body;
  if (!username || typeof username !== 'string' || !username.trim()) {
    return res.status(400).json({ error: 'Username required' });
  }
  db.run('INSERT OR IGNORE INTO users (username) VALUES (?)', [username], function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    db.get('SELECT username, banned FROM users WHERE username = ?', [username], (err, row) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (!row) return res.status(409).json({ error: 'Username already exists' });
      // Log activity
      db.run('INSERT INTO activity (type, username, details) VALUES (?, ?, ?)', [
        'signup', username, JSON.stringify({})
      ]);
      res.json({ success: true, user: { username: row.username, banned: !!row.banned } });
    });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  if (!username || typeof username !== 'string' || !username.trim()) {
    return res.status(400).json({ error: 'Username required' });
  }
  db.get('SELECT username, banned FROM users WHERE username = ?', [username], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(404).json({ error: 'User not found' });
    if (row.banned) return res.status(403).json({ error: 'User is banned' });
    res.json({ success: true, user: { username: row.username, banned: !!row.banned } });
  });
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
