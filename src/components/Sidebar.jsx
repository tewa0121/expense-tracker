import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, Target, Trophy, CreditCard, BarChart3,
  Settings, Wallet, Send, Linkedin, Mail, X
} from 'lucide-react';

const Sidebar = ({ onClose, isMobile }) => {
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transactions', icon: Receipt, label: 'Transactions' },
    { path: '/budgets', icon: Target, label: 'Budgets' },
    { path: '/goals', icon: Trophy, label: 'Goals' },
    { path: '/loans', icon: CreditCard, label: 'Loans' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 md:p-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Wallet size={22} />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white leading-tight text-sm md:text-base">Expense</h1>
            <h1 className="font-bold text-gray-900 dark:text-white leading-tight text-sm md:text-base">Tracker</h1>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={isMobile ? onClose : undefined}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium
              ${isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-2 px-2">
          Connect
        </p>
        <div className="space-y-1">
          <a
            href="https://t.me/tewa0121"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors"
          >
            <Send size={14} /> Telegram @tewa0121
          </a>
          <a
            href="https://www.linkedin.com/in/tewachew-melaku-6b5094408"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 transition-colors"
          >
            <Linkedin size={14} /> LinkedIn Profile
          </a>
          <a
            href="mailto:tewachewmelaku6@gmail.com"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
          >
            <Mail size={14} /> tewachewmelaku6@gmail.com
          </a>
        </div>
      </div>

      <div className="p-4 text-[11px] text-center text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
        <p>2025 Expense Tracker</p>
        <p className="mt-1.5 font-extrabold text-gray-900 dark:text-white tracking-wide">
          Built by Tewachew Melaku
        </p>
      </div>
    </div>
  );
};

export default Sidebar;