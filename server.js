const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
// Serve static files from the 'site' folder
app.use(express.static(path.join(__dirname, 'site')));

const jobsFile = path.join(__dirname, 'jobs.json');

// Save accepted job
app.post('/api/accept-job', (req, res) => {
  const job = req.body;
  if (!job || !job.title) {
    return res.status(400).json({ error: 'Invalid job data' });
  }
  let jobs = [];
  if (fs.existsSync(jobsFile)) {
    jobs = JSON.parse(fs.readFileSync(jobsFile));
  }
  jobs.push(job);
  fs.writeFileSync(jobsFile, JSON.stringify(jobs, null, 2));
  res.json({ success: true });
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
