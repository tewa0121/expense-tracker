import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronRight, LogOut, Mail, Save, Settings as SettingsIcon, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { useNotification } from '../context/NotificationContext';
import { Page, PageHeader } from '../components/ui';
import { initialsOf, shortDate } from '../lib/format';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { stats, transactions, money } = useExpense();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    const res = updateProfile(form);
    if (!res.success) return setError(res.error);
    addNotification({ title: 'Profile saved', type: 'success', persist: false });
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const dirty = form.name.trim() !== user?.name || form.email.trim().toLowerCase() !== user?.email;

  const figures = [
    ['Income', money(stats.all.income), 'text-gain'],
    ['Spent', money(stats.all.expenses), ''],
    ['Balance', money(stats.all.balance), stats.all.balance < 0 ? 'text-loss' : ''],
  ];

  return (
    <Page className="max-w-3xl">
      <PageHeader title="My profile" subtitle="Your account details and lifetime totals." />

      <section className="card mb-6 p-5 md:p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-brand font-display text-2xl font-bold text-on-brand md:h-20 md:w-20 md:text-3xl">
            {initialsOf(user?.name)}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold">{user?.name}</h2>
            <p className="truncate text-sm text-muted">{user?.email}</p>
            {user?.createdAt && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                <CalendarDays size={13} /> Member since {shortDate(user.createdAt.slice(0, 10))} · {transactions.length} transactions
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
          {figures.map(([label, value, cls]) => (
            <div key={label} className="min-w-0">
              <p className="text-xs text-muted">{label}</p>
              <p className={`num truncate font-display text-base font-bold md:text-xl ${cls}`}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={handleSave} className="card mb-6 p-5 md:p-6" noValidate>
        <h2 className="mb-5 flex items-center gap-2 font-sans text-base font-bold"><User size={18} /> Personal information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="p-name" className="label">Full name</label>
            <input id="p-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="p-email" className="label">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" size={17} aria-hidden="true" />
              <input id="p-email" type="email" className="input pl-10" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
            </div>
            <p className="hint">Changing your email won’t affect your data.</p>
          </div>
        </div>
        {error && <p role="alert" className="mt-4 rounded-xl bg-loss/10 px-3 py-2 text-sm font-medium text-loss">{error}</p>}
        <button type="submit" disabled={!dirty} className="btn-primary mt-5"><Save size={17} /> Save changes</button>
      </form>

      <Link to="/settings" className="card mb-4 flex items-center gap-3 p-4 transition hover:bg-surface-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20"><SettingsIcon size={19} /></span>
        <span className="flex-1">
          <span className="block text-sm font-semibold">Settings</span>
          <span className="block text-xs text-muted">Currency, theme, password and data</span>
        </span>
        <ChevronRight size={19} className="text-muted" />
      </Link>

      <button type="button" onClick={handleLogout} className="btn-danger w-full py-3"><LogOut size={17} /> Sign out</button>
    </Page>
  );
};

export default Profile;
