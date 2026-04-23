document.addEventListener('DOMContentLoaded', () => {
  // USER MANAGEMENT
  const refreshBtn = document.getElementById('refresh-users');
  const usersList = document.getElementById('users-list');

  async function fetchUsers() {
    const res = await fetch('/api/users');
    const users = await res.json();
    if (usersList) {
      usersList.innerHTML = users.map(user => 
        '<div class="user-row" style="margin-bottom: 8px;">' +
          '<strong>' + user.username + '</strong> ' +
          '<button onclick="banUser(\'' + user.username + '\')">Ban</button> ' +
          '<button onclick="unbanUser(\'' + user.username + '\')">Unban</button> ' +
          '<span class="ban-status" style="color: ' + (user.banned ? 'red' : 'green') + ';">' + (user.banned ? 'Banned' : 'Active') + '</span>' +
        '</div>'
      ).join('');
    }
  }

  if (refreshBtn) refreshBtn.addEventListener('click', fetchUsers);
  fetchUsers();

  // ACCEPTED JOBS
  const showAcceptedJobsBtn = document.getElementById('show-accepted-jobs');
  const acceptedJobsList = document.getElementById('accepted-jobs-list');

  async function fetchAcceptedJobs() {
    if (acceptedJobsList) acceptedJobsList.innerHTML = '<p>Loading jobs...</p>';
    try {
      const res = await fetch('/api/accepted-jobs');
      const jobs = await res.json();
      if (acceptedJobsList) {
        if (!jobs || jobs.length === 0) {
          acceptedJobsList.innerHTML = '<p>No accepted jobs found.</p>';
          return;
        }
        acceptedJobsList.innerHTML = jobs.map(job => 
          '<div class="job-row" style="border: 1px solid #ccc; padding: 10px; margin-top: 10px;">' +
            '<strong>Job Title:</strong> ' + job.title + ' <br/>' +
            '<strong>Accepted By:</strong> ' + (job.username || 'System') + ' <br/>' +
            '<strong>Company:</strong> ' + (job.company_name || 'N/A') + ' <br/>' +
          '</div>'
        ).join('');
      }
    } catch (err) {
      if (acceptedJobsList) acceptedJobsList.innerHTML = '<p>Error fetching jobs.</p>';
    }
  }

  if (showAcceptedJobsBtn) {
    showAcceptedJobsBtn.addEventListener('click', fetchAcceptedJobs);
  }

  // ACTIVITY LOG
  const refreshActivityBtn = document.getElementById('refresh-activity');
  const activityList = document.getElementById('activity-list');

  async function fetchActivity() {
    if (activityList) activityList.innerHTML = '<p>Loading activity...</p>';
    try {
      const res = await fetch('/api/activity');
      const activities = await res.json();
      if (activityList) {
        if (!activities || activities.length === 0) {
          activityList.innerHTML = '<p>No recent activity found.</p>';
          return;
        }
        activityList.innerHTML = activities.map(act => 
          '<div class="activity-row" style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 5px;">' +
            '<small>' + new Date(act.created_at).toLocaleString() + '</small> - ' +
            '<strong>[' + act.type.toUpperCase() + ']</strong> ' +
            '<em>' + (act.username || 'System') + '</em>: ' +
            '<span style="font-size: 0.9em; color: #555;">' + (act.details || '') + '</span>' +
          '</div>'
        ).join('');
      }
    } catch (err) {
      if (activityList) activityList.innerHTML = '<p>Error fetching activity.</p>';
    }
  }

  if (refreshActivityBtn) {
    refreshActivityBtn.addEventListener('click', fetchActivity);
    fetchActivity();
  }
});

window.banUser = async function(username) {
  await fetch('/api/ban', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  document.getElementById('refresh-users').click();
};

window.unbanUser = async function(username) {
  await fetch('/api/unban', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  document.getElementById('refresh-users').click();
};