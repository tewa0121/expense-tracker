import React, { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Bell, Shield, LogOut, Save, Moon, Sun, Lock } from 'lucide-react';

const Settings = ({ onMenuClick }) => {
  const { user, logout, updateProfile, changePassword, darkMode, toggleDarkMode } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [notifications, setNotifications] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pwForm, setPwForm] = useState({ old: '', new: '', confirm: '' });
  const [pwMessage, setPwMessage] = useState({ type: '', text: '' });

  const handleSave = (e) => {
    e.preventDefault();
    const result = updateProfile(profile);
    if (result && !result.success) {
      addNotification({ title: 'Profile update failed', message: result.error, type: 'error' });
      return;
    }
    addNotification({ title: 'Settings saved', message: 'Your profile has been updated successfully', type: 'success' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwMessage({ type: '', text: '' });
    if (pwForm.new !== pwForm.confirm) return setPwMessage({ type: 'error', text: 'New passwords do not match' });

    const result = changePassword(pwForm.old, pwForm.new, pwForm.confirm);
    if (result.success) {
      setPwMessage({ type: 'success', text: 'Password changed successfully' });
      addNotification({ title: 'Password changed', message: 'Your account password was updated successfully', type: 'success' });
      setPwForm({ old: '', new: '', confirm: '' });
      setTimeout(() => { setShowPasswordForm(false); setPwMessage({ type: '', text: '' }); }, 1500);
    } else {
      setPwMessage({ type: 'error', text: result.error });
      addNotification({ title: 'Password change failed', message: result.error, type: 'error' });
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
      <Header onMenuClick={onMenuClick} />
      <main className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Manage your account preferences</p>
        </div>

        {saved && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm p-3 rounded-xl mb-6 flex items-center gap-2">
            <Save size={16} /> Settings saved successfully
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User size={20} className="text-indigo-600" /> Profile Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full p-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="w-full pl-10 pr-4 p-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Must be a @gmail.com address</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Bell size={20} className="text-indigo-600" /> Preferences
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Email Notifications</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Get updates about your budgets</p>
                </div>
                <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} className="w-5 h-5 accent-indigo-600" />
              </label>
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon size={18} className="text-indigo-600" /> : <Sun size={18} className="text-yellow-500" />}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Dark Mode</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Switch to a {darkMode ? 'light' : 'dark'} theme</p>
                  </div>
                </div>
                <button type="button" onClick={toggleDarkMode} className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield size={20} className="text-indigo-600" /> Security
            </h3>
            {!showPasswordForm ? (
              <button type="button" onClick={() => setShowPasswordForm(true)} className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-2">
                <Lock size={14} /> Change Password
              </button>
            ) : (
              <div className="space-y-3">
                {pwMessage.text && (
                  <div className={`text-sm p-3 rounded-xl ${pwMessage.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
                    {pwMessage.text}
                  </div>
                )}
                <input type="password" placeholder="Current password" value={pwForm.old} onChange={e => setPwForm({ ...pwForm, old: e.target.value })} className="w-full p-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input type="password" placeholder="New password (min 8 chars, letters + numbers)" value={pwForm.new} onChange={e => setPwForm({ ...pwForm, new: e.target.value })} className="w-full p-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input type="password" placeholder="Confirm new password" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} className="w-full p-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                <div className="flex gap-2">
                  <button type="button" onClick={handleChangePassword} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium">Update Password</button>
                  <button type="button" onClick={() => { setShowPasswordForm(false); setPwMessage({ type: '', text: '' }); setPwForm({ old: '', new: '', confirm: '' }); }} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
              <Save size={18} /> Save Changes
            </button>
            <button type="button" onClick={handleLogout} className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 border border-red-100 dark:border-red-800">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-8 pb-4">
          <p>2025 Expense Tracker - All rights reserved.</p>
          <p className="mt-2 font-extrabold text-gray-900 dark:text-white tracking-wide text-sm">Built by Tewachew Melaku</p>
        </div>
      </main>
    </div>
  );
};

export default Settings;