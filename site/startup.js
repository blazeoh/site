

function sanitizeInput(str) {
  return str.replace(/[<>"']/g, '');
}

document.getElementById('startup-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const userInfo = {
    realName: sanitizeInput(document.getElementById('realName').value.trim()),
    email: sanitizeInput(document.getElementById('email').value.trim()),
    phone: sanitizeInput(document.getElementById('phone').value.trim()),
    address: sanitizeInput(document.getElementById('address').value.trim()),
    hobbies: sanitizeInput(document.getElementById('hobbies').value.trim()),
    interests: sanitizeInput(document.getElementById('interests').value.trim()),
    experience: sanitizeInput(document.getElementById('experience').value.trim())
  };
  // Basic validation
  if (!userInfo.realName || !userInfo.email || !userInfo.phone || !userInfo.address || !userInfo.hobbies || !userInfo.interests || !userInfo.experience) {
    alert('Please fill in all fields.');
    return;
  }
  // Store safely in localStorage
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
  // Redirect to main page or job page
  window.location.href = 'index.html';
});
