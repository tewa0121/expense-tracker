<div align="center">

# 💰 Expense Tracker

**Track income, expenses, budgets, savings goals and loans in one clean, mobile-friendly app.**

[![Live demo](https://img.shields.io/badge/Live%20demo-Vercel-black?logo=vercel&logoColor=white)](https://expense-tracker-21.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Live demo](https://expense-tracker-21.vercel.app) · [Report a bug](https://github.com/tewa0121/expense-tracker/issues)

</div>

---

## ✨ Features

| Area | What you can do |
|---|---|
| **Dashboard** | See your balance, this month vs last month, a 6-month cash-flow chart, spending by category, budget usage and recent activity |
| **Transactions** | Add, edit and delete (with undo), search, filter by type, category and month, export to CSV |
| **Budgets** | Set a monthly limit per category, switch months, get alerts at 80% and when you go over |
| **Goals** | Create savings goals and add funds as you save |
| **Loans** | Track total, paid and EMI. *Pay EMI* moves the due date forward and records a Bills expense |
| **Reports** | Summaries for this month, 3 months, this year or all time, with PDF export |
| **Settings** | Edit profile, change password, choose currency, light/dark theme, backup and restore, delete all data |

### 🔐 Accounts and privacy
- Sign up and sign in with a Gmail address
- Passwords are stored as salted **PBKDF2** hashes, never in plain text
- Every account sees only its own data
- Everything is saved in your browser (`localStorage`). There is no server

### 📱 Responsive design
- **Phones:** bottom tab bar with a centre "add" button, slide-in menu, bottom-sheet dialogs
- **Tablets:** same navigation with wider cards and a search box in the header
- **Desktop (1024px+):** fixed sidebar; multi-column layouts start at 1280px
- Dark mode follows your device by default, and you can switch it any time

---

## 🛠️ Tech stack

| | |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Styling | Tailwind CSS 3 |
| Routing | React Router 6 |
| Charts | Recharts |
| Icons | Lucide React |
| PDF export | jsPDF + jsPDF-AutoTable |
| State | React Context API |
| Storage | `localStorage`, per user |
| Hosting | Vercel |

---

## 🚀 Getting started

**Requirements:** Node.js 18 or newer.

```bash
# 1. Clone the repository
git clone https://github.com/tewa0121/expense-tracker.git
cd expense-tracker

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173).

### Other scripts

| Command | What it does |
|---|---|
| `npm run build` | Creates a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Checks the code with ESLint |

---

## 📁 Project structure

```
src/
├── components/   Sidebar, header, bottom nav, charts, modal, toasts
├── context/      Auth, expenses, notifications, UI state
├── lib/          Money and date helpers, finance maths, password hashing, storage
├── pages/        Dashboard, Transactions, Budgets, Goals, Loans, Reports, Settings, Login
└── utils/        CSV and PDF export
```

---

## ☁️ Deploy to Vercel

1. Push the repo to GitHub.
2. Import it on [vercel.com](https://vercel.com/new). Vercel detects Vite automatically.
3. Deploy. `vercel.json` already sends every route to the single-page app.

---

## 💾 About your data

This is a client-only app, so accounts and data live in one browser on one device. To move to another device, use **Settings → Download backup**, then **Restore from backup** on the other device. Clearing your browser data deletes your data, so download a backup now and then.

---

## 👤 Author

**Tewachew Melaku**

- Telegram: [@tewa0121](https://t.me/tewa0121)
- LinkedIn: [Tewachew Melaku](https://www.linkedin.com/in/tewachew-melaku-6b5094408)
- Email: [tewachewmelaku6@gmail.com](mailto:tewachewmelaku6@gmail.com)

⭐ If this project helps you, give it a star on GitHub.