import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Target, CreditCard, BarChart3, Info } from 'lucide-react';

const MobileNav = () => {
  const items = [
    { path: '/', icon: LayoutDashboard, label: 'Home' },
    { path: '/transactions', icon: Receipt, label: 'Transactions' },
    { path: '/budgets', icon: Target, label: 'Budgets' },
    { path: '/loans', icon: CreditCard, label: 'Loans' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
    { path: '/profile', icon: Info, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden safe-area-bottom">
      <ul className="flex items-center justify-around h-16">
        {items.map((item) => (
          <li key={item.path} className="flex-1 min-w-0">
            <NavLink
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 h-16 px-1 transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span
                    className={`text-[9px] leading-tight truncate w-full text-center ${
                      isActive ? 'font-semibold' : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNav;