import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { UIProvider } from './context/UIContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toaster from './components/Toaster';
import { Skeleton } from './components/ui';

// Pages are code-split so the charts and PDF libraries aren't downloaded up front.
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Budgets = lazy(() => import('./pages/Budgets'));
const Goals = lazy(() => import('./pages/Goals'));
const Loans = lazy(() => import('./pages/Loans'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));

const PageFallback = () => (
  <div className="mx-auto max-w-6xl space-y-4 px-4 py-8 md:px-8" aria-busy="true">
    <Skeleton className="h-10 w-56" />
    <Skeleton className="h-40" />
    <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ExpenseProvider>
          <UIProvider>
            <BrowserRouter>
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/login" element={<LoginRoute />} />
                  <Route path="/*" element={<ProtectedRoute><AppShell /></ProtectedRoute>} />
                </Routes>
              </Suspense>
              <Toaster />
            </BrowserRouter>
          </UIProvider>
        </ExpenseProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

/** Signed-in visitors skip the login screen. */
function LoginRoute() {
  const { user } = useAuth();
  const { state } = useLocation();
  if (user) return <Navigate to={state?.from || '/'} replace />;
  return <Login />;
}

function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  // New page → start at the top.
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  return (
    <div className="min-h-dvh lg:flex">
      <aside className="sticky top-0 hidden h-dvh w-64 flex-shrink-0 lg:block">
        <Sidebar />
      </aside>

      <div className="min-w-0 flex-1">
        <Header onMenu={() => setDrawerOpen(true)} />
        <main id="main">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      {drawerOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 animate-fade-in bg-side/60" onClick={() => setDrawerOpen(false)} />
          <div className="fixed left-0 top-0 z-50 h-dvh w-72 animate-slide-in shadow-pop" role="dialog" aria-modal="true" aria-label="Menu">
            <Sidebar isMobile onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
