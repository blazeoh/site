# 🔴 Deployed Web App with Persistent Data

**Difficulty:** Spicy

**Deployment:** GitHub Pages (see [GITHUB_PAGES.md](GITHUB_PAGES.md))

**API required:** Yes, at least one (external or your own)

---

## Overview

Build and **deploy a web application** that stores data and is accessible at a live public URL. Data should be saved between sessions.

---

## Deployment Options

Your app must be deployed and publicly accessible. Which platform you use depends on how your app saves data.

### GitHub Pages (recommended starting point)

GitHub Pages hosts your HTML, CSS, and JavaScript files. It does not run a server. This means it works fine as long as your app does not have its own backend server.

**Use GitHub Pages if your app saves data one of these ways:**
- `localStorage`: the browser saves the data directly (no server involved)
- A third-party service like Firebase or Supabase: your JavaScript calls their API and they handle the storage (no server on your end)

See [GITHUB_PAGES.md](GITHUB_PAGES.md) for setup instructions.

### Other free platforms (only needed if you built a backend server)

If you wrote a Node/Express (or similar) server that your app talks to, GitHub Pages cannot host that server. Use one of these instead:

- **Netlify** or **Vercel**: good for frontend-heavy apps with small serverless functions
- **Railway** or **Render**: good for a full backend server with a database

---

## Requirements

### Persistent Data
Choose at least one approach:

- [ ] **`localStorage`**: the browser saves the data, no server needed (deploy on GitHub Pages)
- [ ] **External database API** (e.g., Firebase Firestore, Supabase, JSONBin): your JavaScript calls their API and they handle storage (deploy on GitHub Pages or Netlify/Vercel)
- [ ] **Backend with a database** (e.g., Node/Express with SQLite or PostgreSQL): you are running your own server (deploy on Railway or Render)

Data must persist across page refreshes or between users, depending on your approach.

### Functionality
- [ ] Core feature of the app works end-to-end
- [ ] Users can **create, read, update, or delete** data (full CRUD not required; at minimum, create and read)
- [ ] At least one external API is used
- [ ] Loading and error states are handled

### HTML, CSS & JavaScript
- [ ] Semantic HTML
- [ ] Responsive CSS
- [ ] JavaScript is organized (separate files or clearly separated concerns)
- [ ] No API keys exposed in client-side code (use environment variables or a backend proxy)

### Deployment
- [ ] App is deployed and accessible at a **live public URL**
- [ ] URL is included in your project README and submission
- [ ] The link works at submission time

---

## App Ideas

- A reading / watch / to-do list that saves your entries
- A poll or vote tracker shared across users (Firebase)
- A recipe box where users can submit and browse recipes
- A weather dashboard that saves your favorite locations
- A trivia game with a leaderboard
- A habit tracker with a chart over time

---

## Stretch Goals

- Add user authentication (Firebase Auth, Auth0, etc.)
- Add data visualizations (Chart.js, D3.js, etc.)
- Implement a REST API of your own (Node/Express backend)
- Add PWA features (offline support, installable app)
- Add automated tests for your JavaScript logic

---

## Submission Checklist

- [ ] App is live at a public URL
- [ ] Data persists across page refreshes (at minimum)
- [ ] At least one external API is integrated
- [ ] Code is pushed to a public GitHub repo
- [ ] Project README includes: what the app does, the live URL, tech stack, and any APIs/services used
