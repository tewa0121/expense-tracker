import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { addNotification } = useNotification();
  const { user } = useAuth();

  // የተጠቃሚው ኢሜይል እንደ ቁልፍ እንጠቀማለን
  const userKey = user?.email || 'guest';

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({
    Food: 0, Bills: 0, Shopping: 0, Transport: 0, Others: 0
  });
  const [loans, setLoans] = useState([]);
  const [goals, setGoals] = useState([]);

  // ተጠቃሚ ሲቀየር የራሱን መረጃ እንጭናለን
  useEffect(() => {
    const tKey = `expense_${userKey}_transactions`;
    const bKey = `expense_${userKey}_budgets`;
    const lKey = `expense_${userKey}_loans`;
    const gKey = `expense_${userKey}_goals`;

    const storedT = localStorage.getItem(tKey);
    const storedB = localStorage.getItem(bKey);
    const storedL = localStorage.getItem(lKey);
    const storedG = localStorage.getItem(gKey);

    setTransactions(storedT ? JSON.parse(storedT) : []);
    setBudgets(storedB ? JSON.parse(storedB) : { Food: 0, Bills: 0, Shopping: 0, Transport: 0, Others: 0 });
    setLoans(storedL ? JSON.parse(storedL) : []);
    setGoals(storedG ? JSON.parse(storedG) : []);
  }, [userKey]);

  // መረጃ ሲቀየር እናስቀምጣለን
  useEffect(() => {
    localStorage.setItem(`expense_${userKey}_transactions`, JSON.stringify(transactions));
  }, [transactions, userKey]);

  useEffect(() => {
    localStorage.setItem(`expense_${userKey}_budgets`, JSON.stringify(budgets));
  }, [budgets, userKey]);

  useEffect(() => {
    localStorage.setItem(`expense_${userKey}_loans`, JSON.stringify(loans));
  }, [loans, userKey]);

  useEffect(() => {
    localStorage.setItem(`expense_${userKey}_goals`, JSON.stringify(goals));
  }, [goals, userKey]);

  const addTransaction = (transaction) => {
    setTransactions([{ ...transaction, id: Date.now() }, ...transactions]);
    addNotification({
      title: transaction.type === 'income' ? 'ገቢ ተጨምሯል' : 'ወጪ ተመዝግቧል',
      message: `${transaction.title} · ₹${transaction.amount.toLocaleString()}`,
      type: transaction.type === 'income' ? 'success' : 'info'
    });
  };

  const deleteTransaction = (id) => {
    const t = transactions.find(x => x.id === id);
    setTransactions(transactions.filter(t => t.id !== id));
    if (t) addNotification({ title: 'ግብይት ተሰርዟል', message: `${t.title} ተወግዷል`, type: 'warning' });
  };

  const updateBudget = (category, amount) => {
    setBudgets({ ...budgets, [category]: Number(amount) || 0 });
    addNotification({ title: 'በጀት ተቀይሯል', message: `${category} → ₹${(Number(amount) || 0).toLocaleString()}`, type: 'info' });
  };

  const addLoan = (loan) => {
    setLoans([...loans, { ...loan, id: Date.now() }]);
    addNotification({ title: 'ብድር ተጨምሯል', message: `${loan.name} · ₹${loan.total.toLocaleString()}`, type: 'info' });
  };

  const deleteLoan = (id) => {
    const l = loans.find(x => x.id === id);
    setLoans(loans.filter(l => l.id !== id));
    if (l) addNotification({ title: 'ብድር ተሰርዟል', message: `${l.name} ተወግዷል`, type: 'warning' });
  };

  const updateLoan = (id, updates) => {
    const loan = loans.find(l => l.id === id);
    setLoans(loans.map(l => l.id === id ? { ...l, ...updates } : l));
    if (loan && updates.paid !== undefined && updates.paid >= loan.total) {
      addNotification({ title: '🎉 ብድር ተከፍሏል!', message: `እንኳን ደስ አለህ! ${loan.name} ሙሉ በሙሉ ተከፍሏል`, type: 'success' });
    }
  };

  const addGoal = (goal) => {
    setGoals([...goals, { ...goal, id: Date.now() }]);
    addNotification({ title: 'ግብ ተፈጥሯል', message: `${goal.name} · ₹${goal.target.toLocaleString()}`, type: 'success' });
  };

  const deleteGoal = (id) => {
    const g = goals.find(x => x.id === id);
    setGoals(goals.filter(g => g.id !== id));
    if (g) addNotification({ title: 'ግብ ተሰርዟል', message: `${g.name} ተወግዷል`, type: 'warning' });
  };

  const stats = useMemo(() => {
    let income = 0, expenses = 0;
    const categories = { Food: 0, Bills: 0, Shopping: 0, Transport: 0, Others: 0 };
    const monthly = {};

    transactions.forEach(t => {
      if (t.type === 'income') income += Number(t.amount);
      else {
        expenses += Number(t.amount);
        categories[t.category] !== undefined
          ? categories[t.category] += Number(t.amount)
          : categories['Others'] += Number(t.amount);
      }
      if (t.date) {
        const d = new Date(t.date);
        const key = d.toLocaleString('en-US', { month: 'short' }) + ' ' + d.getFullYear();
        if (!monthly[key]) monthly[key] = { income: 0, expense: 0, sortDate: d };
        if (t.type === 'income') monthly[key].income += Number(t.amount);
        else monthly[key].expense += Number(t.amount);
      }
    });

    const balance = income - expenses;

    const categoryData = Object.keys(categories).map(key => ({
      name: key, value: categories[key],
      color: key === 'Food' ? '#4f46e5' :
             key === 'Bills' ? '#8b5cf6' :
             key === 'Shopping' ? '#f59e0b' :
             key === 'Transport' ? '#22c55e' : '#ef4444'
    })).filter(c => c.value > 0);

    const chartData = Object.keys(monthly)
      .sort((a, b) => monthly[a].sortDate - monthly[b].sortDate)
      .map(key => ({ name: key.split(' ')[0], income: monthly[key].income, expense: monthly[key].expense }));

    return { income, expenses, balance, categoryData, chartData, categories };
  }, [transactions]);

  return (
    <ExpenseContext.Provider value={{
      transactions, addTransaction, deleteTransaction,
      budgets, updateBudget,
      loans, addLoan, deleteLoan, updateLoan,
      goals, addGoal, deleteGoal,
      stats
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => useContext(ExpenseContext);