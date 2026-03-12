// -------------------------------------------------------
// Example: Run code after the page has fully loaded
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
        // Admin panel logic
        const showAcceptedJobsBtn = document.getElementById('show-accepted-jobs');
        const acceptedJobsList = document.getElementById('accepted-jobs-list');
        let acceptedJobs = [];

        if (showAcceptedJobsBtn) {
          showAcceptedJobsBtn.addEventListener('click', async () => {
            // For demo, show accepted jobs from local array
            acceptedJobsList.innerHTML = acceptedJobs.length > 0
              ? acceptedJobs.map(job => `<div class="job-card taken" style="animation: fadeIn 0.5s;"><h3>${job.title}</h3><p><strong>Company:</strong> ${job.company_name}</p><p><strong>Location:</strong> ${job.location}</p><span class="taken-label">Taken</span></div>`).join('')
              : '<p>No jobs accepted yet.</p>';
          });
        }
    // Login screen logic
    const loginScreen = document.getElementById('login-screen');
    const loginForm = document.getElementById('login-form');
    const signupBtn = document.getElementById('signup-btn');
    let currentUser = null;

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();
        if (!username) {
          alert('Please enter a username to log in.');
          return;
        }
        try {
          const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
          });
          const data = await res.json();
          if (res.status === 403) {
            window.location.href = 'banned.html';
            return;
          }
          if (res.ok && data.success) {
            currentUser = username;
            loginScreen.style.display = 'none';
            document.body.classList.add('logged-in');
            window.location.href = 'profile.html';
          } else {
            alert(data.error || 'Login failed.');
          }
        } catch (err) {
          alert('Login failed.');
        }
      });
      if (signupBtn) {
        signupBtn.addEventListener('click', async () => {
          const usernameInput = document.getElementById('username');
          const username = usernameInput.value.trim();
          if (!username) {
            alert('Please enter a username to sign up.');
            return;
          }
          try {
            const res = await fetch('/api/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username })
            });
            const data = await res.json();
            if (res.ok && data.success) {
              currentUser = username;
              loginScreen.style.display = 'none';
              document.body.classList.add('logged-in');
              alert('Signed up as: ' + username);
            } else {
              alert(data.error || 'Sign up failed.');
            }
          } catch (err) {
            alert('Sign up failed.');
          }
        });
      }
    }
    
  console.log('Page loaded.');

  // -------------------------------------------------------
  // Example: Select an element and update it
  // -------------------------------------------------------
  // const heading = document.querySelector('h1');
  // heading.textContent = 'Hello, world!';

  // -------------------------------------------------------
  // Example: Fetch data from a public API
  // -------------------------------------------------------
  // async function fetchData() {
  //   try {
  //     const response = await fetch('https://api.example.com/data');
  //     if (!response.ok) throw new Error('Network response was not ok');
  //     const data = await response.json();
  //     console.log(data);
  //     // Display the data in the DOM here
  //   } catch (error) {
  //     console.error('Fetch failed:', error);
  //   }
  // }
  //
  // fetchData();

    // Unemployed Final Boss job search
    const findJobBtn = document.getElementById('find-job-btn');
    const jobResults = document.getElementById('job-results');

    function showLoading() {
      jobResults.innerHTML = '<p class="loading">Loading jobs...</p>';
    }

    function showError(message) {
      jobResults.innerHTML = `<p class="error">${message}</p>`;
    }

    function displayJobs(jobs) {
      if (!jobs || jobs.length === 0) {
        jobResults.innerHTML = '<p>No jobs found.</p>';
        return;
      }
      jobResults.innerHTML = jobs.slice(0, 5).map((job, idx) => {
        // Encode job data for safe HTML attribute
        const encodedJob = encodeURIComponent(JSON.stringify(job));
        return `
          <div class="job-card">
            <h3>${job.title}</h3>
            <p><strong>Company:</strong> ${job.company_name}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <a href="${job.url}" target="_blank">View Job</a>
            <button class="accept-job-btn" data-job="${encodedJob}" data-idx="${idx}">Accept Job</button>
          </div>
        `;
      }).join('');
      // Add event listeners for accept job buttons
      document.querySelectorAll('.accept-job-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const job = JSON.parse(decodeURIComponent(btn.getAttribute('data-job')));
          acceptJob(job);
        });
      });
      // Add event listeners for accept job buttons
      document.querySelectorAll('.accept-job-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const job = JSON.parse(btn.getAttribute('data-job'));
          acceptJob(job);
        });
      });
    }

    // Confetti effect
    function showConfetti() {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.innerHTML = '<img src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/confetti.min.js" />'; // Placeholder, replace with real confetti
      document.body.appendChild(confetti);
      setTimeout(() => {
        confetti.remove();
      }, 1500);
    }

    // Accept job handler
    function acceptJob(job) {
      // TODO: Send job to server for saving
      showConfetti();
      // Animation for job card
      const jobCards = document.querySelectorAll('.job-card');
      jobCards.forEach(card => {
        if (card.querySelector('h3').textContent === job.title) {
          card.classList.add('taken');
          card.style.animation = 'fadeIn 0.5s';
          const btn = card.querySelector('.accept-job-btn');
          if (btn) btn.remove();
          // Add 'Taken' label
          const takenLabel = document.createElement('div');
          takenLabel.textContent = 'Taken';
          takenLabel.className = 'taken-label';
          card.appendChild(takenLabel);
        }
      });
      acceptedJobs.push(job);
      alert(`Job accepted: ${job.title}`);
    }

    async function fetchJobs() {
      showLoading();
      findJobBtn.disabled = true;
      findJobBtn.textContent = 'Finding jobs...';
      try {
        const response = await fetch('/api/jobs');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log('Fetched job data:', data);
        // Try to find jobs array in response
        let jobs = data.jobs || data.data || data.results || [];
        if (!Array.isArray(jobs) || jobs.length === 0) {
          // Try to use the whole data if jobs property not found
          jobs = Array.isArray(data) ? data : [];
        }
        displayJobs(jobs);
      } catch (error) {
        showError('Failed to fetch jobs. Please try again.');
      }
      findJobBtn.disabled = false;
      findJobBtn.textContent = 'Find a Job';
    }

    if (findJobBtn) {
      findJobBtn.addEventListener('click', fetchJobs);
    }
});
