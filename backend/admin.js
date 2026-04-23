document.addEventListener('DOMContentLoaded', () => {
  const refreshBtn = document.getElementById('refresh-users');
  const usersList = document.getElementById('users-list');

  async function fetchUsers() {
    const res = await fetch('/api/users');
    const users = await res.json();
    usersList.innerHTML = users.map(user => `
      <div class="user-row">
        <span>${user.username}</span>
        <button onclick="banUser('${user.username}')">Ban</button>
        <button onclick="unbanUser('${user.username}')">Unban</button>
        <span class="ban-status">${user.banned ? 'Banned' : 'Active'}</span>
      </div>
    `).join('');
  }

  refreshBtn.addEventListener('click', fetchUsers);
  fetchUsers();
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
