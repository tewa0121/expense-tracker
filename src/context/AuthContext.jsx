import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readJSON, writeJSON, removeKey } from '../lib/storage';
import { hashPassword, verifyPassword, newId } from '../lib/password';
import { DEFAULT_SETTINGS } from '../lib/constants';

const AuthContext = createContext(null);

const EMAIL_REGEX = /^[^\s@]+@gmail\.com$/i;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/; // ≥8 chars, a letter and a number

const USERS_KEY = 'expense_users_db';
const SESSION_KEY = 'expense_user';
const THEME_KEY = 'expense_dark';

const settingsKey = (id) => `expense_${id}_settings`;

const getUsers = () => readJSON(USERS_KEY, []);
const saveUsers = (users) => writeJSON(USERS_KEY, users);

/**
 * Accounts created by the earlier version have no `id` and their data is stored under
 * their email. Using the email as that account's id keeps all of it reachable, and from
 * then on the id never changes, even if the user changes their email.
 */
function withIds(users) {
  let changed = false;
  const next = users.map((u) => {
    if (u.id) return u;
    changed = true;
    return { ...u, id: u.email };
  });
  if (changed) saveUsers(next);
  return next;
}

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt });

function readSession() {
  const stored = readJSON(SESSION_KEY, null);
  if (!stored) return null;
  const users = withIds(getUsers());
  const found = users.find((u) => u.id === stored.id) || users.find((u) => u.email === stored.email);
  return found ? publicUser(found) : null;
}

function initialDark() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readSession);
  const [darkMode, setDarkMode] = useState(initialDark);
  const [settings, setSettings] = useState(() => {
    const u = readSession();
    return u ? { ...DEFAULT_SETTINGS, ...readJSON(settingsKey(u.id), {}) } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try { localStorage.setItem(THEME_KEY, String(darkMode)); } catch { /* ignore */ }
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', darkMode ? '#081112' : '#0e2326');
  }, [darkMode]);

  const validateEmail = (email) => EMAIL_REGEX.test(email);
  const validatePassword = (password) => PASSWORD_REGEX.test(password);

  const startSession = useCallback((u) => {
    const session = publicUser(u);
    writeJSON(SESSION_KEY, { id: session.id });
    setSettings({ ...DEFAULT_SETTINGS, ...readJSON(settingsKey(session.id), {}) });
    setUser(session);
  }, []);

  // ============ SIGN UP ============
  const signup = async ({ name, email, password, confirmPassword }) => {
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      return { success: false, error: 'Fill in all fields.' };
    }
    if (!validateEmail(cleanEmail)) {
      return { success: false, error: 'Use a Gmail address, for example you@gmail.com.' };
    }
    if (!validatePassword(password)) {
      return { success: false, error: 'Password needs at least 8 characters, including a letter and a number.' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords don’t match.' };
    }

    const users = withIds(getUsers());
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'This email already has an account. Sign in instead.' };
    }

    try {
      const { salt, hash } = await hashPassword(password);
      const newUser = {
        id: newId(), name: cleanName, email: cleanEmail, salt, hash,
        createdAt: new Date().toISOString(),
      };
      saveUsers([...users, newUser]);
      startSession(newUser);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // ============ LOGIN ============
  const login = async ({ email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { success: false, error: 'Enter your email and password.' };
    }
    if (!validateEmail(cleanEmail)) {
      return { success: false, error: 'Use a Gmail address, for example you@gmail.com.' };
    }

    const users = withIds(getUsers());
    const idx = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
    if (idx < 0) {
      return { success: false, error: 'No account uses this email. Create one to get started.' };
    }

    try {
      const found = users[idx];
      let ok;
      if (found.hash) {
        ok = await verifyPassword(password, found);
      } else {
        // Legacy plaintext account: verify once, then upgrade to a salted hash.
        ok = found.password === password;
        if (ok) {
          const { salt, hash } = await hashPassword(password);
          const upgraded = { ...found, salt, hash };
          delete upgraded.password;
          users[idx] = upgraded;
          saveUsers(users);
        }
      }
      if (!ok) return { success: false, error: 'Wrong password. Try again.' };
      startSession(users[idx]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const logout = () => {
    removeKey(SESSION_KEY);
    setUser(null);
    setSettings(DEFAULT_SETTINGS);
  };

  // ============ UPDATE PROFILE ============
  const updateProfile = ({ name, email }) => {
    if (!user) return { success: false, error: 'You’re signed out.' };
    const cleanName = (name ?? user.name).trim();
    const cleanEmail = (email ?? user.email).trim().toLowerCase();

    if (!cleanName) return { success: false, error: 'Name can’t be empty.' };
    if (!validateEmail(cleanEmail)) {
      return { success: false, error: 'Use a Gmail address, for example you@gmail.com.' };
    }

    const users = withIds(getUsers());
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx < 0) return { success: false, error: 'Account not found.' };
    if (users.some((u, i) => i !== idx && u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Another account already uses this email.' };
    }

    users[idx] = { ...users[idx], name: cleanName, email: cleanEmail };
    saveUsers(users);
    setUser(publicUser(users[idx]));
    return { success: true };
  };

  // ============ CHANGE PASSWORD ============
  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    if (!user) return { success: false, error: 'You’re signed out.' };
    const users = withIds(getUsers());
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx < 0) return { success: false, error: 'Account not found.' };

    try {
      const found = users[idx];
      const currentOk = found.hash ? await verifyPassword(oldPassword, found) : found.password === oldPassword;
      if (!currentOk) return { success: false, error: 'Current password is wrong.' };
      if (!validatePassword(newPassword)) {
        return { success: false, error: 'New password needs at least 8 characters, including a letter and a number.' };
      }
      if (newPassword !== confirmPassword) return { success: false, error: 'New passwords don’t match.' };

      const { salt, hash } = await hashPassword(newPassword);
      const updated = { ...found, salt, hash };
      delete updated.password;
      users[idx] = updated;
      saveUsers(users);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      if (user) writeJSON(settingsKey(user.id), next);
      return next;
    });
  }, [user]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const value = useMemo(() => ({
    user, loading: false, signup, login, logout, updateProfile, changePassword,
    settings, updateSettings, darkMode, toggleDarkMode, validateEmail, validatePassword,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [user, settings, darkMode, updateSettings]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
