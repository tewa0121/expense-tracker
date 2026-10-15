import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Moon, Sun, Bell, User, LogOut, Settings, ChevronDown, Check, Trash2,
  Info, AlertTriangle, CheckCircle, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead, clearAll, deleteNotification } = useNotification();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const iconFor = (type) => {
    if (type === 'success') return <CheckCircle size={16} className="text-green-500" />;
    if (type === 'warning') return <AlertTriangle size={16} className="text-yellow-500" />;
    if (type === 'error') return <AlertTriangle size={16} className="text-red-500" />;
    return <Info size={16} className="text-indigo-500" />;
  };

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <header className="h-16 md:h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-2 md:px-8 sticky top-0 z-20 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-300 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all mr-2 flex-shrink-0"
        aria-label="Open menu"
      >
        <Menu size={24} strokeWidth={2.5} />
      </button>

      <div className="flex-1 max-w-xl mr-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 md:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-3">
        <button
          onClick={toggleDarkMode}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? (
            <>
              <Sun size={18} className="md:hidden" />
              <Sun size={20} className="hidden md:block" />
            </>
          ) : (
            <>
              <Moon size={18} className="md:hidden" />
              <Moon size={20} className="hidden md:block" />
            </>
          )}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors"
          >
            <Bell size={18} className="md:hidden" />
            <Bell size={20} className="hidden md:block" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-[16px] md:min-w-[18px] md:h-[18px] px-1 bg-red-500 text-white text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Notifications {unreadCount > 0 && <span className="text-xs text-indigo-600">({unreadCount} new)</span>}
                </h3>
                {notifications.length > 0 && (
                  <div className="flex gap-2">
                    <button onClick={markAllRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                      <Check size={16} />
                    </button>
                    <button onClick={clearAll} className="text-xs text-red-500 hover:underline">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-4 border-b border-gray-50 dark:border-gray-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        !n.read ? 'bg-indigo-50/40 dark:bg-indigo-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{iconFor(n.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.time)}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                          className="text-gray-300 hover:text-red-500 p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-1 md:px-2 transition-colors"
          >
            <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight capitalize truncate max-w-[120px]">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight truncate max-w-[120px]">
                {user?.email || ''}
              </p>
            </div>
            <ChevronDown size={16} className="text-gray-400 hidden lg:block" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-white capitalize truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || ''}
                </p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => { navigate('/profile'); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <User size={18} /> My Profile
                </button>
                <button
                  onClick={() => { navigate('/settings'); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Settings size={18} /> Settings
                </button>
                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;