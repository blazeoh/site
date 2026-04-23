const fs = require('fs');
const oldContent = fs.readFileSync('frontend/app.js', 'utf-8');
const startText = '    function displayJobs(jobs) {';
const endText = '    async function fetchJobs() {';
const startIndex = oldContent.indexOf(startText);
const endIndex = oldContent.indexOf(endText);
if (startIndex >= 0 && endIndex > startIndex) {
    const before = oldContent.substring(0, startIndex);
    const after = oldContent.substring(endIndex);
    const newJs = \    function displayJobs(jobs) {
      if (!jobs || jobs.length === 0) {
        jobResults.innerHTML = '<p>No jobs found.</p>';
        return;
      }
      jobResults.innerHTML = jobs.slice(0, 5).map((job, idx) => {
        const encodedJob = encodeURIComponent(JSON.stringify(job));
        return \\\
          <div class="job-card">
            <h3>\x24{job.title}</h3>
            <p><strong>Company:</strong> \x24{job.company_name}</p>
            <p><strong>Location:</strong> \x24{job.location}</p>
            <a href="\x24{job.url}" target="_blank">View Job</a>
            <button class="accept-job-btn" data-job="\x24{encodedJob}" data-idx="\x24{idx}">Accept Job</button>
          </div>
        \\\;
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
\;
    const newContent = before + newJs + after;
    fs.writeFileSync('frontend/app.js', newContent);
    console.log('App updated');
} else {
    console.log('Blocks not found');
}