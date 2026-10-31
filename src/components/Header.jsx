import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, Moon, Sun, Bell, User, LogOut, Settings, Check, Trash2, Plus, X,
} from 'lucide-react';
import { LogoMark } from './Logo';
import { TYPE_STYLE } from './Toaster';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useUI } from '../context/UIContext';
import { initialsOf, timeAgo } from '../lib/format';

/** Closes a popover on outside click and Escape. */
function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return { open, setOpen, ref };
}

const Header = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead, clearAll, deleteNotification } = useNotification();
  const { openTransactionModal } = useUI();
  const navigate = useNavigate();
  const menu = usePopover();
  const bell = usePopover();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const onTransactions = location.pathname === '/transactions';
  // On the Transactions page the URL is the single source of truth, so the header box and the page box always match.
  const query = onTransactions ? params.get('q') || '' : '';

  const setQuery = (value) => {
    if (onTransactions) setParams(value ? { q: value } : {}, { replace: true });
    else if (value) navigate(`/transactions?q=${encodeURIComponent(value)}`);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const submitSearch = (e) => { e.preventDefault(); };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-8">
        <div className="lg:hidden"><LogoMark size={32} /></div>

        <form onSubmit={submitSearch} className="relative hidden max-w-sm flex-1 md:block" role="search">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" size={17} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions"
            aria-label="Search transactions"
            className="input bg-surface-2 py-2 pl-9"
          />
        </form>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => navigate('/transactions', { state: { focusSearch: Date.now() } })}
            className="icon-btn md:hidden"
            aria-label="Search transactions"
          >
            <Search size={19} />
          </button>

          <button type="button" onClick={() => openTransactionModal()} className="btn-primary hidden md:inline-flex">
            <Plus size={18} strokeWidth={2.5} /> Add transaction
          </button>

          <button type="button" onClick={toggleDarkMode} className="icon-btn" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={bell.ref}>
            <button
              type="button"
              onClick={() => bell.setOpen(!bell.open)}
              className="icon-btn relative"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
              aria-expanded={bell.open}
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-loss px-1 text-[10px] font-bold text-white dark:text-bg">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {bell.open && (
              <div className="fixed inset-x-3 top-[68px] z-50 animate-fade-in overflow-hidden rounded-2xl border border-line bg-surface shadow-pop sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <h2 className="font-sans text-sm font-bold">
                    Notifications{unreadCount > 0 && <span className="ml-1.5 font-medium text-muted">{unreadCount} new</span>}
                  </h2>
                  {notifications.length > 0 && (
                    <div className="flex">
                      <button type="button" onClick={markAllRead} className="icon-btn h-8 w-8" aria-label="Mark all as read"><Check size={16} /></button>
                      <button type="button" onClick={clearAll} className="icon-btn h-8 w-8" aria-label="Clear all"><Trash2 size={16} /></button>
                    </div>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-10 text-center text-sm text-muted">Nothing yet. Budget alerts and reminders show up here.</p>
                  ) : notifications.map((n) => {
                    const { icon: Icon, cls } = TYPE_STYLE[n.type] || TYPE_STYLE.info;
                    return (
                      <div
                        key={n.id}
                        className={`group flex items-start gap-3 border-b border-line/60 px-4 py-3 last:border-0 ${n.read ? '' : 'bg-accent/5'}`}
                      >
                        <Icon size={17} className={`mt-0.5 flex-shrink-0 ${cls}`} aria-hidden="true" />
                        <button type="button" onClick={() => markAsRead(n.id)} className="min-w-0 flex-1 text-left">
                          <span className={`block text-sm ${n.read ? 'font-medium text-muted' : 'font-semibold'}`}>{n.title}</span>
                          {n.message && <span className="mt-0.5 block break-words text-xs text-muted">{n.message}</span>}
                          <span className="mt-1 block text-[11px] text-faint">{timeAgo(n.time)}</span>
                        </button>
                        <button type="button" onClick={() => deleteNotification(n.id)} className="icon-btn h-7 w-7 opacity-60 hover:opacity-100" aria-label="Delete notification">
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Account */}
          <div className="relative" ref={menu.ref}>
            <button
              type="button"
              onClick={() => menu.setOpen(!menu.open)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-side text-sm font-bold text-brand dark:bg-brand dark:text-on-brand"
              aria-label="Account menu"
              aria-expanded={menu.open}
            >
              {initialsOf(user?.name)}
            </button>
            {menu.open && (
              <div className="absolute right-0 top-full mt-2 w-64 animate-fade-in overflow-hidden rounded-2xl border border-line bg-surface shadow-pop">
                <div className="border-b border-line px-4 py-3">
                  <p className="truncate text-sm font-semibold">{user?.name}</p>
                  <p className="truncate text-xs text-muted">{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <button type="button" onClick={() => { navigate('/profile'); menu.setOpen(false); }} className="btn-ghost w-full justify-start font-medium text-fg">
                    <User size={17} /> My profile
                  </button>
                  <button type="button" onClick={() => { navigate('/settings'); menu.setOpen(false); }} className="btn-ghost w-full justify-start font-medium text-fg">
                    <Settings size={17} /> Settings
                  </button>
                  <button type="button" onClick={handleLogout} className="btn-ghost w-full justify-start font-medium text-loss hover:bg-loss/10 hover:text-loss">
                    <LogOut size={17} /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
