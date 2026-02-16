# 📚 StudyFlow — AI-Powered Productivity & Study Management

**Made by Prashant Kaushik**

> **🌐 Live Demo: [prashantkaushik957.github.io/studyflow](https://prashantkaushik957.github.io/studyflow/)**

A premium, feature-rich productivity application built with Next.js, featuring dual portals for users and administrators, beautiful dark-mode UI with glassmorphism effects, and smart study management tools.

---

## ✨ Features

### 🎯 User Portal (`/user`)
| Feature | Description |
|---------|-------------|
| **Dashboard** | Productivity score, activity charts, today's tasks, AI insights |
| **Task Manager** | Kanban-style board with drag-and-drop, priorities, and deadlines |
| **Study Planner** | Subject-wise study planning with progress tracking |
| **Pomodoro Timer** | Focus timer with session history and streak tracking |
| **Habit Tracker** | Daily habit tracking with streaks and visual progress |
| **Analytics** | Detailed productivity analytics with charts and trends |
| **Settings** | Theme, notifications, and account preferences |

### 🛡️ Admin Portal (`/admin`)
| Feature | Description |
|---------|-------------|
| **Dashboard** | User stats, growth charts, device distribution, revenue metrics |
| **User Management** | Searchable/filterable table of all registered users |
| **Platform Analytics** | Feature usage, retention curves, engagement, geo distribution |
| **Settings** | Platform configuration, maintenance mode, data management |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + Custom CSS (glassmorphism, gradients)
- **State:** Zustand (with persistence)
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Deployment:** GitHub Pages via GitHub Actions
- **Mobile:** Capacitor (iOS)

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Prashantkaushik957/studyflow.git
cd studyflow

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📦 Build & Deploy

```bash
# Production build (static export)
npx next build

# Output is in the /out directory
```

Deployment to GitHub Pages happens automatically on push to `main` via GitHub Actions.

---

## 📸 Screenshots

### Role Selection
Choose between Admin and User portals from the landing page.

### Admin Dashboard
View user metrics, growth trends, device analytics, and recent signups.

### User Dashboard
Track productivity score, manage tasks, view AI-powered insights.

---

## 📄 License

MIT

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Prashantkaushik957">Prashant Kaushik</a>
</p>
