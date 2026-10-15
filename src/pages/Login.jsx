import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ---- READ VALUES DIRECTLY FROM THE DOM (bypasses React state issues) ----
    const form = formRef.current;
    if (!form) return;

    const name = (form.querySelector('input[name="name"]')?.value || '').trim();
    const email = (form.querySelector('input[name="email"]')?.value || '').trim();
    const password = form.querySelector('input[name="password"]')?.value || '';
    const confirm = form.querySelector('input[name="confirm"]')?.value || '';

    // ---- DEBUG: log what we actually got ----
    console.log('Form values read from DOM:', { name, email, password: '***', confirm: '***' });

    if (isSignup) {
      // Front-end quick checks (backend also validates)
      if (!name || !email || !password || !confirm) {
        return setError('All fields are required');
      }

      const res = signup({
        name,
        email,
        password,
        confirmPassword: confirm
      });

      if (!res.success) return setError(res.error);
      setSuccess('Account created successfully! Redirecting...');
    } else {
      if (!email || !password) {
        return setError('Email and password are required');
      }

      const res = login({ email, password });
      if (!res.success) return setError(res.error);
      setSuccess('Signed in successfully! Redirecting...');
    }

    setTimeout(() => navigate('/'), 500);
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-indigo-600 p-3 rounded-xl text-white">
            <Wallet size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Tracker</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your finances smartly</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            {isSignup ? 'Sign up to start tracking expenses' : 'Sign in to continue to your dashboard'}
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl mb-4 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm p-3 rounded-xl mb-4 flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/*
            KEY FIX: Using `key` forces React to remount the form
            when switching between login/signup, so no stale state.
            autoComplete="off" prevents browser from silently autofilling.
          */}
          <form
            key={isSignup ? 'signup' : 'login'}
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-4"
            autoComplete="off"
            noValidate
          >
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Tewachew Melaku"
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@gmail.com"
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Must be a @gmail.com address</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              {isSignup && (
                <p className="text-xs text-gray-400 mt-1">
                  At least 8 characters with letters and numbers
                </p>
              )}
            </div>

            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    name="confirm"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={switchMode}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
          © 2025 Expense Tracker ·{' '}
          <span className="font-bold text-gray-600 dark:text-gray-300">Built by Tewachew Melaku</span>
        </p>
      </div>
    </div>
  );
};

export default Login;