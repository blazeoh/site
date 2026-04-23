
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  /**
   * ==========================================
   * STATE MANAGEMENT 
   * ==========================================
   * These state variables control the entire flow of the application:
   * - mode, username, password: Controls the authentication form inputs and type (login vs register)
   * - loading, error: Manages asynchronous states and displays feedback to the user
   * - user, page, checkingAuth: Manages the user's session data and determines which view to render
   */
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('auth'); // 'auth' or 'dashboard'
  const [checkingAuth, setCheckingAuth] = useState(true);

  /**
   * ==========================================
   * AUTHENTICATION & INITIALIZATION
   * ==========================================
   * This effect runs exactly once when the component mounts over the DOM.
   * It sends a background request to the `/api/me` endpoint with credentials (cookies) included.
   * If a valid session exists on the server, it automatically sets the user state and redirects 
   * them directly to the 'dashboard' page, bypassing the login screen.
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setCheckingAuth(true);
        const res = await fetch('/api/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setPage('dashboard');
        }
      } catch (e) {
        // Not logged in or error
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  /**
   * ==========================================
   * EVENT HANDLERS
   * ==========================================
   * Functions that are triggered by user interaction on the UI elements such as 
   * submitting forms and clicking buttons.
   */
  
  // Handles sending user credentials to the chosen backend endpoint (login OR signup).
  // Manages the async loading state, captures JSON responses, and resets auth data if successful.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/${mode === 'login' ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setUser(data.user);
      setPage('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs out the user by explicitly asking the server to invalidate the session cookie.
   * On success, resets all sensitive State hooks to drop the frontend session immediately
   * and kicks the user back out to the Auth page.
   */
  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    setUser(null);
    setUsername('');
    setPassword('');
    setError('');
    setPage('auth');
    setLoading(false);
  };

  /**
   * ==========================================
   * RENDER (UI Views)
   * ==========================================
   * Below is the conditional rendering logic based on the user's state. 
   * It defaults to a "Loading" splash screen if authentication details are still fetching.
   * If logged in, it renders the protected "Dashboard". 
   * Otherwise, it renders the core "Authentication View".
   */

  // 1. Loading State
  // Displays immediately when the app connects to the API checking credentials. Prevents a flash-of-login.
  if (checkingAuth) {
    return (
      <div className="App soft-shadow" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)' }}>
        <div className="auth-container soft-shadow" style={{ background: '#fff', padding: 32, borderRadius: 16, minWidth: 320, boxShadow: '0 8px 32px rgba(60,60,120,0.12)' }}>
          <h2 style={{ color: '#2563eb' }}>Loading...</h2>
        </div>
      </div>
    );
  }

  // 2. Dashboard View
  // The primary authenticated application shell.
  // Requires both 'page === dashboard' and that a 'user' object has been confirmed.
  if (page === 'dashboard' && user) {
    return (
      <div className="App soft-shadow" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)' }}>
        <div className="auth-container soft-shadow" style={{ background: '#fff', padding: 32, borderRadius: 16, minWidth: 320, boxShadow: '0 8px 32px rgba(60,60,120,0.12)' }}>
          <h2 style={{ color: '#2563eb' }}>Dashboard</h2>
          <p style={{ fontSize: '1.1em', marginBottom: 24 }}>Welcome, <b>{user.username}</b>!</p>
          {user.banned && <p style={{ color: '#dc2626' }}>You are banned.</p>}
          <button className="btn" onClick={handleLogout} disabled={loading}>Logout</button>
        </div>
      </div>
    );
  }

  // 3. Authentication View (Login / Register) Make sure to not hide errors!
  // Renders the form inputs bound to State Management variables, including interactive logic.
  // Toggle UI text based on Mode hook. This is the ultimate fallback renderer if the user lacks a session.
  return (
    <div className="App soft-shadow" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)' }}>
      <div className="auth-container soft-shadow" style={{ background: '#fff', padding: 32, borderRadius: 16, minWidth: 320, boxShadow: '0 8px 32px rgba(60,60,120,0.12)' }}>
        <form onSubmit={handleSubmit}>
          <h2 style={{ color: mode === 'login' ? '#2563eb' : '#059669' }}>{mode === 'login' ? 'Login' : 'Register'}</h2>
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="input"
              required
              autoFocus
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input"
              required
              minLength={6}
              style={{ width: '100%' }}
            />
          </div>
          {error && <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div>}
          <button className="btn" type="submit" disabled={loading} style={{ width: '100%', background: mode === 'login' ? '#2563eb' : '#059669' }}>
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <span style={{ color: '#64748b' }}>
              {mode === 'login' ? 'No account?' : 'Already have an account?'}{' '}
              <button type="button" className="link-btn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
                {mode === 'login' ? 'Register' : 'Login'}
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
