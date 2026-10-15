# 💰 Expense Tracker

A modern, full-featured personal finance management web app built with **React + Vite + Tailwind CSS**. Track your income, expenses, budgets, goals, and loans — all in one clean, mobile-friendly dashboard.

**🔗 Live Demo:** [https://expense-tracker-21.vercel.app](https://expense-tracker-21.vercel.app)

---

## ✨ Features

### 📊 Dashboard
- Real-time overview of Total Balance, Income, and Expenses
- Interactive **Income vs Expenses** line chart
- **Spending by Category** pie chart with live percentages
- Budget usage indicator

### 💸 Transactions
- Add income & expense transactions with title, amount, date, and category
- Auto-categorized: Food, Bills, Shopping, Transport, Others
- Delete anytime with instant recalculation

### 🎯 Budgets
- Set monthly limits per category
- Visual progress bars with over-budget alerts
- Inline editing

### 🏆 Goals
- Create custom savings goals with target amounts
- Progress tracking with color-coded indicators
- Shows remaining amount to reach goal

### 💳 Loans
- Track multiple loans with total amount, paid amount, EMI, and due date
- One-tap **Pay EMI** button
- Auto-detects when loan is fully paid
- Monthly commitment summary

### 📈 Reports
- Summary metrics: Income, Expenses, Balance, Savings Rate
- Recent transactions list
- **Export to PDF** with full transaction history

### 🔐 Authentication
- Sign up / Sign in with email validation
- **@gmail.com** email required
- Password must be **8+ characters** with letters & numbers
- **Per-user data isolation** — each account sees only its own data
- Change password from Settings

### 🎨 UI/UX
- 🌙 **Dark mode** toggle (persisted)
- 📱 **Mobile-first** responsive design
- 🔔 **Notification system** for all actions
- ☰ **Slide-in mobile drawer** navigation
- Smooth animations & polished look

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 18 |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS 3 |
| **Routing** | React Router DOM 6 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **PDF Export** | jsPDF + jspdf-autotable |
| **State** | React Context API |
| **Storage** | localStorage (per-user) |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/@Tewa0121/expense-tracker.git
cd expense-tracker

[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel&logoColor=white)](https://expense-tracker-21.vercel.app)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

# Install dependencies
npm install

# Run dev server
npm run dev