import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { usePersistentState } from '../lib/storage';
import { newId } from '../lib/password';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

const MAX_STORED = 50;

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  // Notifications are per account (they used to be shared by everyone on the device).
  const [notifications, setNotifications] = usePersistentState(
    `expense_${user?.id ?? 'guest'}_notifications`, []
  );
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismissToast = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * @param {{title:string, message?:string, type?:'info'|'success'|'warning'|'error',
   *          toast?:boolean, persist?:boolean, action?:{label:string,onClick:()=>void}}} n
   * `toast` shows a transient message; `persist` also keeps it in the bell list.
   */
  const addNotification = useCallback(({ title, message = '', type = 'info', toast = true, persist = true, action }) => {
    const id = newId();
    if (persist) {
      setNotifications((prev) => [
        { id, title, message, type, read: false, time: new Date().toISOString() },
        ...prev,
      ].slice(0, MAX_STORED));
    }
    if (toast) {
      setToasts((prev) => [...prev.slice(-2), { id, title, message, type, action }]);
      timers.current[id] = setTimeout(() => dismissToast(id), action ? 7000 : 4000);
    }
    return id;
  }, [setNotifications, dismissToast]);

  const markAsRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);
  const deleteNotification = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const value = useMemo(() => ({
    notifications, toasts, dismissToast, addNotification, markAsRead, markAllRead, clearAll, deleteNotification,
    unreadCount: notifications.filter((n) => !n.read).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [notifications, toasts, addNotification, dismissToast]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => useContext(NotificationContext);
