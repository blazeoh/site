document.addEventListener('DOMContentLoaded', () => {
  // For demo, show username from localStorage or session
  const profileInfo = document.getElementById('profile-info');
  let username = localStorage.getItem('currentUser') || 'Unknown';
  profileInfo.innerHTML = `<p>Welcome, <strong>${username}</strong>!</p>`;
});
