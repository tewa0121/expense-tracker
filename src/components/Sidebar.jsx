import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, Target, Trophy, CreditCard, BarChart3, Settings, LogOut,
  Send, Linkedin, Mail, X,
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { initialsOf } from '../lib/format';

const ICONS = {
  '/': LayoutDashboard,
  '/transactions': Receipt,
  '/budgets': Target,
  '/goals': Trophy,
  '/loans': CreditCard,
  '/reports': BarChart3,
  '/settings': Settings,
};

const LINKS = [
  { href: 'https://t.me/tewa0121', label: 'Telegram', icon: Send },
  { href: 'https://www.linkedin.com/in/tewachew-melaku-6b5094408', label: 'LinkedIn', icon: Linkedin },
  { href: 'mailto:tewachewmelaku6@gmail.com', label: 'Email', icon: Mail },
];

const MENU = [
  { path: '/', label: 'Dashboard', end: true },
  { path: '/transactions', label: 'Transactions' },
  { path: '/budgets', label: 'Budgets' },
  { path: '/goals', label: 'Goals' },
  { path: '/loans', label: 'Loans' },
  { path: '/reports', label: 'Reports' },
  { path: '/settings', label: 'Settings' },
];

const Sidebar = ({ onClose, isMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose?.();
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-full flex-col bg-side text-white">
      <div className="flex items-center justify-between px-5 pb-4 pt-6">
        <Logo light />
        {isMobile && (
          <button type="button" onClick={onClose} className="icon-btn text-white/70 hover:bg-white/10 hover:text-white" aria-label="Close menu">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2" aria-label="Main">
        {MENU.map((item) => {
          const Icon = ICONS[item.path];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={isMobile ? onClose : undefined}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute -left-3 top-2 h-[calc(100%-1rem)] w-1 rounded-r-full bg-brand" />}
                  <Icon size={19} className={isActive ? 'text-brand' : ''} aria-hidden="true" />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5">
          <NavLink to="/profile" onClick={isMobile ? onClose : undefined} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg" aria-label="Open profile">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-on-brand">
              {initialsOf(user?.name)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{user?.name}</span>
              <span className="block truncate text-xs text-white/55">{user?.email}</span>
            </span>
          </NavLink>
          <button type="button" onClick={handleLogout} className="icon-btn text-white/60 hover:bg-white/10 hover:text-white" aria-label="Sign out" title="Sign out">
            <LogOut size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] leading-tight text-white/45">
            © {new Date().getFullYear()} Expense Tracker<br />
            <span className="font-semibold text-white/75">Built by Tewachew Melaku</span>
          </p>
          <div className="flex gap-0.5">
            {LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
