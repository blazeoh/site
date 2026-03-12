// -------------------------------------------------------
// Example: Run code after the page has fully loaded
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Login screen logic
    const loginScreen = document.getElementById('login-screen');
    const loginForm = document.getElementById('login-form');
    const signupBtn = document.getElementById('signup-btn');
    let currentUser = null;

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();
        if (username) {
          currentUser = username;
          loginScreen.style.display = 'none';
          document.body.classList.add('logged-in');
        }
      });
      if (signupBtn) {
        signupBtn.addEventListener('click', () => {
          const usernameInput = document.getElementById('username');
          const username = usernameInput.value.trim();
          if (username) {
            currentUser = username;
            loginScreen.style.display = 'none';
            document.body.classList.add('logged-in');
            alert('Signed up as: ' + username);
          } else {
            alert('Please enter a username to sign up.');
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
      jobResults.innerHTML = jobs.slice(0, 5).map((job, idx) => `
        <div class="job-card">
          <h3>${job.title}</h3>
          <p><strong>Company:</strong> ${job.company_name}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <a href="${job.url}" target="_blank">View Job</a>
          <button class="accept-job-btn" data-job='${JSON.stringify(job)}' data-idx="${idx}">Accept Job</button>
        </div>
      `).join('');
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
      alert(`Job accepted: ${job.title}`);
    }

    async function fetchJobs() {
      showLoading();
      findJobBtn.disabled = true;
      findJobBtn.textContent = 'Finding jobs...';
      try {
        const response = await fetch('https://arbeitnow.com/api/job-board-api');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        displayJobs(data.jobs);
      } catch (error) {
        showError('Failed to fetch jobs. Please try again.');
      }
      findJobBtn.disabled = false;
      findJobBtn.textContent = 'Find a Job';
    }

    if (findJobBtn) {
      findJobBtn.addEventListener('click', fetchJobs);
    }

