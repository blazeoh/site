# 👨‍💼 Unemployed Final Boss

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Welcome to **Unemployed Final Boss**, the ultimate interactive job board and user management platform. This project began as a "Vibe Coding Final Project" and has been built from the ground up to feature robust user authentication, a live job fetching system using a public API, and a complete admin panel.

## ✨ Features

- **🔐 Secure Authentication:** Full Signup and Login flow with hashed passwords using \crypt\ and JWT (JSON Web Tokens) for safe, persistent sessions.
- **💼 Live Job Board:** Fetches real, up-to-date job listings by acting as a proxy to the [Arbeitnow API](https://arbeitnow.com/api/job-board-api).
- **👤 User Profiles:** Personalized dashboards tracking individual user states (e.g., ban status).
- **🛠️ Admin Panel:** An exclusive area to view all accepted jobs, track site activity, and moderate users (Ban/Unban functionality).
- **💾 Local Database:** All user accounts, hashed passwords, and activity logs are safely stored in a local SQLite database (\site.db\). Job acceptances are stored persistently via JSON files.

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository** (if you haven't already).
2. **Install dependencies:**
   \\\ash
   npm install
   \\\
3. **Start the backend server:**
   \\\ash
   node backend/server.js
   \\\
4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action!

## 📂 Project Structure

\\\	ext
vibe_code_project/
├── backend/
│   ├── server.js        # Main Express server and API routes
│   └── site.db          # Auto-generated SQLite database
├── frontend/
│   ├── index.html       # Landing page (Login/Signup & Job Board)
│   ├── app.js           # Main frontend logic and API calls
│   ├── style.css        # Global stylesheets
│   ├── admin.html       # Admin dashboard for moderation
│   └── (other static assets)
└── README.md            # This file!
\\\

## 🔌 API Integrations & Data Sources

- **Arbeitnow API:** Used for fetching actual job details to populate the front page (\https://www.arbeitnow.com/api/job-board-api\).

## 🎓 Project Challenge Level

Based on the original project brief, this submission crushes the **🟠 HOT / 🔴 SPICY** requirements by providing:
- Web app with persistent data (SQLite & JSON).
- Interactive, data-driven frontend fetching public APIs.
- Robust user auth flow and backend API endpoints.

---
*Built with ❤️ and assisted by GitHub Copilot.*
