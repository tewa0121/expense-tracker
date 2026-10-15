import React, { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Save, Calendar, TrendingUp, TrendingDown, Wallet,
  Settings as SettingsIcon, LogOut, ChevronRight
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { stats } = useExpense();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
      <Header />
      <main className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Profile</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage your account and preferences
          </p>
        </div>

        {saved && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm p-3 rounded-xl mb-6 flex items-center gap-2">
            <Save size={16} /> Profile updated successfully
          </div>
        )}

        {/* Avatar & Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white capitalize truncate">
                {user?.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{user?.email}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                <Calendar size={12} /> Joined {new Date(user?.loginTime).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div>
              <div className="flex items-center gap-1 text-green-500 mb-1">
                <TrendingUp size={14} />
                <span className="text-xs font-medium">Income</span>
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">₹{stats.income.toLocaleString()}</p>
            </div>
            <div>
              <div className="flex items-center gap-1 text-red-500 mb-1">
                <TrendingDown size={14} />
                <span className="text-xs font-medium">Expenses</span>
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">₹{stats.expenses.toLocaleString()}</p>
            </div>
            <div>
              <div className="flex items-center gap-1 text-indigo-500 mb-1">
                <Wallet size={14} />
                <span className="text-xs font-medium">Balance</span>
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">₹{stats.balance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Settings Link */}
        <button
          onClick={() => navigate('/settings')}
          className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <SettingsIcon size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Settings</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Preferences, password, dark mode</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User size={20} className="text-indigo-600" /> Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full pl-10 pr-4 p-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
          >
            <Save size={18} /> Save Changes
          </button>
        </form>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 py-3 rounded-xl font-medium flex items-center justify-center gap-2 border border-red-100 dark:border-red-800 mb-6"
        >
          <LogOut size={18} /> Logout
        </button>

        {/* Developer footer */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 pb-4">
          <p>2025 Expense Tracker - All rights reserved.</p>
          <p className="mt-2 font-extrabold text-gray-900 dark:text-white tracking-wide text-sm">
            Built by Tewachew Melaku
          </p>
        </div>
      </main>
    </div>
  );
};

export default Profile;