import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const EMAIL_REGEX = /^[^\s@]+@gmail\.com$/i;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/; // ≥8, has letter + number

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('expense_dark') === 'true'
  );

  useEffect(() => {
    const stored = localStorage.getItem('expense_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('expense_dark', darkMode);
  }, [darkMode]);

  // Get all registered users (our "database")
  const getUsers = () => {
    const stored = localStorage.getItem('expense_users_db');
    return stored ? JSON.parse(stored) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem('expense_users_db', JSON.stringify(users));
  };

  const validateEmail = (email) => EMAIL_REGEX.test(email);
  const validatePassword = (password) => PASSWORD_REGEX.test(password);

  // ============ SIGN UP ============
  const signup = ({ name, email, password, confirmPassword }) => {
    // Trim everything first
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = password || '';
    const cleanConfirm = confirmPassword || '';

    if (!cleanName || !cleanEmail || !cleanPassword || !cleanConfirm) {
      return { success: false, error: 'All fields are required' };
    }

    if (!validateEmail(cleanEmail)) {
      return { success: false, error: 'Email must be a valid @gmail.com address' };
    }

    if (!validatePassword(cleanPassword)) {
      return {
        success: false,
        error:
          'Password must be at least 8 characters and contain both letters and numbers'
      };
    }

    if (cleanPassword !== cleanConfirm) {
      return { success: false, error: 'Passwords do not match' };
    }

    const users = getUsers();

    // Check if email already exists
    if (users.find((u) => u.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        error:
          'This email is already registered. Please sign in instead, or use a different email.'
      };
    }

    const newUser = {
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword, // demo only — never store plaintext in real apps
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    const session = {
      name: newUser.name,
      email: newUser.email,
      loginTime: new Date().toISOString()
    };
    setUser(session);
    localStorage.setItem('expense_user', JSON.stringify(session));

    return { success: true };
  };

  // ============ LOGIN ============
  const login = ({ email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = password || '';

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Email and password are required' };
    }

    if (!validateEmail(cleanEmail)) {
      return { success: false, error: 'Email must be a valid @gmail.com address' };
    }

    const users = getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!found) {
      return {
        success: false,
        error:
          'No account found with this email. Please sign up first.'
      };
    }

    if (found.password !== cleanPassword) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const session = {
      name: found.name,
      email: found.email,
      loginTime: new Date().toISOString()
    };
    setUser(session);
    localStorage.setItem('expense_user', JSON.stringify(session));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('expense_user');
  };

  // ============ UPDATE PROFILE ============
  const updateProfile = (updates) => {
    if (!user) return { success: false, error: 'Not signed in' };

    const cleanUpdates = { ...updates };

    if (cleanUpdates.name) cleanUpdates.name = cleanUpdates.name.trim();
    if (cleanUpdates.email) cleanUpdates.email = cleanUpdates.email.trim().toLowerCase();

    if (cleanUpdates.email && !validateEmail(cleanUpdates.email)) {
      return { success: false, error: 'Email must be a valid @gmail.com address' };
    }

    const users = getUsers();
    const idx = users.findIndex((u) => u.email === user.email);

    if (idx < 0) {
      return { success: false, error: 'Account not found' };
    }

    // If email is being changed, check for collision with another account
    if (
      cleanUpdates.email &&
      cleanUpdates.email !== user.email &&
      users.find((u) => u.email === cleanUpdates.email)
    ) {
      return {
        success: false,
        error: 'This email is already registered to another account.'
      };
    }

    users[idx] = { ...users[idx], ...cleanUpdates };
    saveUsers(users);

    const updated = { ...user, ...cleanUpdates };
    setUser(updated);
    localStorage.setItem('expense_user', JSON.stringify(updated));

    return { success: true };
  };

  // ============ CHANGE PASSWORD ============
  const changePassword = (oldPassword, newPassword, confirmPassword) => {
    if (!user) return { success: false, error: 'Not signed in' };

    const users = getUsers();
    const idx = users.findIndex((u) => u.email === user.email);

    if (idx < 0) return { success: false, error: 'Account not found' };

    if (users[idx].password !== oldPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }

    if (!validatePassword(newPassword)) {
      return {
        success: false,
        error:
          'Password must be at least 8 characters and contain letters and numbers'
      };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: 'New passwords do not match' };
    }

    users[idx].password = newPassword;
    saveUsers(users);

    return { success: true };
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        loading,
        updateProfile,
        changePassword,
        darkMode,
        toggleDarkMode,
        validateEmail,
        validatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);