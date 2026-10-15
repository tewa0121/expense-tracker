import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('expense_notifications');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('expense_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = ({ title, message, type = 'info' }) => {
    const notif = {
      id: Date.now(),
      title,
      message,
      type, // 'info' | 'success' | 'warning' | 'error'
      read: false,
      time: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => setNotifications([]);

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications, addNotification, markAsRead, markAllRead,
      clearAll, deleteNotification, unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);