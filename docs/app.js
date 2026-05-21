// -------------------------------------------------------
// STOP LEAVING ORPHANED CODE AT THE TOP OF THE FILE!
// YOU'RE GOING TO GET US ALL FIRED!
// Run your code AFTER the page has fully loaded!
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Login screen logic
    const loginScreen = document.getElementById('login-screen');
    const loginForm = document.getElementById('login-form');
    const signupBtn = document.getElementById('signup-btn');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('toggle-password');
    let currentUser = null;

    // KEEP THE GOOD PASSWORD ANIMATION, DELETE THE DUMB DUPLICATE ONE!
    // Show/hide password logic with actual visual feedback!
    if (togglePassword && passwordInput) {
      let passwordVisible = false;
      togglePassword.addEventListener('click', () => {
        passwordVisible = !passwordVisible;
        passwordInput.type = passwordVisible ? 'text' : 'password';
        // Animate eye icon properly!
        togglePassword.innerHTML = passwordVisible
          ? `<svg id="eye-off-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7 1.11-2.43 2.85-4.47 5-5.73m3-1.19C8.44 4.55 10.13 4 12 4c5 0 9.27 3.11 11 7-.71 1.55-1.75 2.96-3.01 4.04" /><line x1="1" y1="1" x2="23" y2="23" /></svg>`
          : `<svg id="eye-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M2.05 12C3.63 7.05 7.87 4 12 4c4.13 0 8.36 3.05 9.95 8-1.59 4.95-5.82 8-9.95 8-4.13 0-8.36-3.05-9.95-8z"/></svg>`;
        togglePassword.style.transition = 'transform 0.2s';
        togglePassword.style.transform = 'scale(1.2)';
        setTimeout(() => { togglePassword.style.transform = 'scale(1)'; }, 200);
      });
    }

    if (loginForm) {
      // Animate login card in
      const loginCard = document.querySelector('.login-card');
      if (loginCard) {
        loginCard.style.opacity = 0;
        loginCard.style.transform = 'translateY(40px)';
        setTimeout(() => {
          loginCard.style.transition = 'opacity 0.5s, transform 0.5s';
          loginCard.style.opacity = 1;
          loginCard.style.transform = 'translateY(0)';
        }, 100);
      }
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const errorMsg = document.getElementById('login-error-msg');
        
        if (errorMsg) errorMsg.style.display = 'none';

        if (!username || !password) {
          if (errorMsg) {
            errorMsg.textContent = 'Please enter a username and password.';
            errorMsg.style.display = 'block';
          }
          return;
        }
        try {
          const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await res.json();
          if (res.status === 403) {
            window.location.href = 'banned.html';
            return;
          }
          if (res.ok && data.success) {
            currentUser = username;
            localStorage.setItem('currentUser', username);
            if (loginCard) {
              loginCard.style.transition = 'opacity 0.5s, transform 0.5s';
              loginCard.style.opacity = 0;
              loginCard.style.transform = 'translateY(-40px)';
              setTimeout(() => {
                loginScreen.style.display = 'none';
                document.body.classList.add('logged-in');
              }, 500);
            } else {
              loginScreen.style.display = 'none';
              document.body.classList.add('logged-in');
            }
          } else {
            if (errorMsg) {
              errorMsg.textContent = data.error || 'Login failed.';
              errorMsg.style.display = 'block';
            }
          }
        } catch (err) {
          if (errorMsg) {
            errorMsg.textContent = 'Login failed. Please try again.';
            errorMsg.style.display = 'block';
          }
        }
      });
      if (signupBtn) {
        signupBtn.addEventListener('click', async () => {
          const usernameInput = document.getElementById('username');
          const username = usernameInput.value.trim();
          const password = passwordInput.value;
          const errorMsg = document.getElementById('login-error-msg');
          
          if (errorMsg) errorMsg.style.display = 'none';

          if (!username || !password) {
            if (errorMsg) {
              errorMsg.textContent = 'Please enter a username and password to sign up.';
              errorMsg.style.display = 'block';
            }
            return;
          }
          // Animate login card out, then redirect
          const loginCard = document.querySelector('.login-card');
          if (loginCard) {
            loginCard.style.transition = 'opacity 0.5s, transform 0.5s';
            loginCard.style.opacity = 0;
            loginCard.style.transform = 'translateY(-40px)';
          }
          setTimeout(async () => {
            try {
              const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
              });
              const data = await res.json();
              if (res.ok && data.success) {
                currentUser = username;
                localStorage.setItem('currentUser', username);
                loginScreen.style.display = 'none';
                document.body.classList.add('logged-in');
              } else {
                if (errorMsg) {
                  errorMsg.textContent = data.error || 'Sign up failed.';
                  errorMsg.style.display = 'block';
                }
                if (loginCard) {
                  loginCard.style.opacity = 1;
                  loginCard.style.transform = 'translateY(0)';
                }
              }
            } catch (err) {
              if (errorMsg) {
                errorMsg.textContent = 'Sign up failed. Please try again.';
                errorMsg.style.display = 'block';
              }
              if (loginCard) {
                loginCard.style.opacity = 1;
                loginCard.style.transform = 'translateY(0)';
              }
            }
          }, 500);
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

﻿    function displayJobs(jobs) {
      if (!jobs || jobs.length === 0) {
        jobResults.innerHTML = '<p>No jobs found.</p>';
        return;
      }
      jobResults.innerHTML = jobs.slice(0, 5).map((job, idx) => {
        const encodedJob = encodeURIComponent(JSON.stringify(job));
        return '<div class="job-card">' +
            '<h3>' + job.title + '</h3>' +
            '<p><strong>Company:</strong> ' + job.company_name + '</p>' +
            '<p><strong>Location:</strong> ' + job.location + '</p>' +
            '<a href="' + job.url + '" target="_blank">View Job</a>' +
            '<button class="accept-job-btn" data-job="' + encodedJob + '" data-idx="' + idx + '">Accept Job</button>' +
          '</div>';
      }).join('');
      
      document.querySelectorAll('.accept-job-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const job = JSON.parse(decodeURIComponent(btn.getAttribute('data-job')));
          acceptJob(job, btn);
        });
      });
    }

    function showConfetti() {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.innerHTML = '<img src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/confetti.min.js" />'; 
      document.body.appendChild(confetti);
      setTimeout(() => {
        confetti.remove();
      }, 1500);
    }

    async function acceptJob(job, btnElement) {
      if (typeof currentUser === 'undefined' || !currentUser) {
        alert("Please login first to accept jobs.");
        return;
      }
      job.username = currentUser;

      try {
        const res = await fetch('/api/accept-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(job)
        });
        
        if (res.ok) {
          showConfetti();
          const card = btnElement.closest('.job-card');
          if (card) {
            card.classList.add('taken');
            card.style.animation = 'fadeIn 0.5s';
            btnElement.remove();
            const takenLabel = document.createElement('div');
            takenLabel.textContent = 'Taken';
            takenLabel.className = 'taken-label';
            card.appendChild(takenLabel);
          }
        } else {
          alert('Failed to save job on server');
        }
      } catch (err) {
        alert('Server error saving job');
      }
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
