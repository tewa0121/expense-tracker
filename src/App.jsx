import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Loans from './pages/Loans';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ExpenseProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </ExpenseProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900 font-sans flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 h-screen">
        <Sidebar />
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col h-screen min-w-0">
        <main
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <Routes>
            <Route path="/" element={<Dashboard onMenuClick={openDrawer} />} />
            <Route path="/transactions" element={<Transactions onMenuClick={openDrawer} />} />
            <Route path="/budgets" element={<Budgets onMenuClick={openDrawer} />} />
            <Route path="/goals" element={<Goals onMenuClick={openDrawer} />} />
            <Route path="/loans" element={<Loans onMenuClick={openDrawer} />} />
            <Route path="/reports" element={<Reports onMenuClick={openDrawer} />} />
            <Route path="/settings" element={<Settings onMenuClick={openDrawer} />} />
            <Route path="/profile" element={<Profile onMenuClick={openDrawer} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
            onClick={closeDrawer}
          />
          <div className="fixed top-0 left-0 h-full w-64 z-50 md:hidden shadow-2xl animate-slide-in">
            <Sidebar onClose={closeDrawer} isMobile />
          </div>
        </>
      )}
    </div>
  );
}

export default App;