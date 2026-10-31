import { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistentState } from '../lib/storage';
import { newId } from '../lib/password';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { EXPENSE_CATEGORIES, emptyBudgets } from '../lib/constants';
import { formatMoney, round2, currentMonthKey, monthKeyOf, todayStr } from '../lib/format';
import { inMonth, sortTransactions, summarize } from '../lib/finance';

const ExpenseContext = createContext(null);

// New categories were added, so merge saved budgets over the full default set.
const normalizeBudgets = (b) => ({ ...emptyBudgets(), ...(b && typeof b === 'object' ? b : {}) });
const asArray = (v) => (Array.isArray(v) ? v : []);

export const ExpenseProvider = ({ children }) => {
  const { user, settings } = useAuth();
  const { addNotification } = useNotification();
  const uid = user?.id ?? 'guest';
  const money = useCallback((n) => formatMoney(n, settings.currency), [settings.currency]);

  const [transactions, setTransactions] = usePersistentState(`expense_${uid}_transactions`, [], asArray);
  const [budgets, setBudgets] = usePersistentState(`expense_${uid}_budgets`, emptyBudgets(), normalizeBudgets);
  const [loans, setLoans] = usePersistentState(`expense_${uid}_loans`, [], asArray);
  const [goals, setGoals] = usePersistentState(`expense_${uid}_goals`, [], asArray);

  // ---------- Transactions ----------
  const checkBudgetAlert = useCallback((txn, before, after) => {
    if (!settings.budgetAlerts || txn.type !== 'expense') return;
    if (monthKeyOf(txn.date) !== currentMonthKey()) return;
    const limit = budgets[txn.category] || 0;
    if (limit <= 0) return;
    const was = before / limit;
    const now = after / limit;
    if (was < 1 && now >= 1) {
      addNotification({
        title: `${txn.category} budget exceeded`,
        message: `${money(after)} spent against a ${money(limit)} limit this month.`,
        type: 'error',
      });
    } else if (was < 0.8 && now >= 0.8) {
      addNotification({
        title: `${txn.category} budget at ${Math.round(now * 100)}%`,
        message: `${money(limit - after)} left this month.`,
        type: 'warning',
      });
    }
  }, [settings.budgetAlerts, budgets, addNotification, money]);

  const addTransaction = useCallback((input) => {
    const txn = { ...input, amount: round2(input.amount), id: Date.now() + Math.floor(Math.random() * 1000) };
    const spentBefore = inMonth(transactions, monthKeyOf(txn.date))
      .filter((t) => t.type === 'expense' && t.category === txn.category)
      .reduce((s, t) => s + t.amount, 0);
    setTransactions((prev) => [txn, ...prev]);
    addNotification({
      title: txn.type === 'income' ? 'Income added' : 'Expense added',
      message: `${txn.title} · ${money(txn.amount)}`,
      type: txn.type === 'income' ? 'success' : 'info',
    });
    checkBudgetAlert(txn, spentBefore, spentBefore + txn.amount);
    return txn;
  }, [transactions, setTransactions, addNotification, money, checkBudgetAlert]);

  const updateTransaction = useCallback((id, patch) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch, amount: round2(patch.amount ?? t.amount) } : t)));
    addNotification({ title: 'Transaction updated', message: patch.title || '', type: 'success', persist: false });
  }, [setTransactions, addNotification]);

  const deleteTransaction = useCallback((id) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    addNotification({
      title: 'Transaction deleted',
      message: target.title,
      type: 'warning',
      persist: false,
      action: {
        label: 'Undo',
        onClick: () => setTransactions((prev) => (prev.some((t) => t.id === id) ? prev : [target, ...prev])),
      },
    });
  }, [transactions, setTransactions, addNotification]);

  // ---------- Budgets ----------
  const updateBudget = useCallback((category, amount) => {
    const value = Math.max(0, round2(amount) || 0);
    setBudgets((prev) => ({ ...prev, [category]: value }));
    addNotification({
      title: 'Budget updated',
      message: value ? `${category} · ${money(value)} a month` : `${category} limit removed`,
      type: 'info',
      persist: false,
    });
  }, [setBudgets, addNotification, money]);

  // ---------- Loans ----------
  const addLoan = useCallback((loan) => {
    setLoans((prev) => [...prev, { ...loan, id: newId() }]);
    addNotification({ title: 'Loan added', message: `${loan.name} · ${money(loan.total)}`, type: 'info' });
  }, [setLoans, addNotification, money]);

  const deleteLoan = useCallback((id) => {
    const l = loans.find((x) => x.id === id);
    setLoans((prev) => prev.filter((x) => x.id !== id));
    if (l) addNotification({ title: 'Loan deleted', message: l.name, type: 'warning', persist: false });
  }, [loans, setLoans, addNotification]);

  /** Pay one EMI: advances the loan, moves the next due date a month on, and logs the expense. */
  const payLoanEmi = useCallback((id, addMonthsToDate) => {
    const loan = loans.find((l) => l.id === id);
    if (!loan || loan.paid >= loan.total) return;
    const amount = round2(Math.min(loan.emi, loan.total - loan.paid));
    const paid = round2(loan.paid + amount);
    const done = paid >= loan.total;
    setLoans((prev) => prev.map((l) => (
      l.id === id ? { ...l, paid, dueDate: done ? l.dueDate : addMonthsToDate(l.dueDate, 1) } : l
    )));
    setTransactions((prev) => [{
      id: Date.now(), type: 'expense', category: 'Bills', amount,
      title: `${loan.name} EMI`, date: todayStr(),
    }, ...prev]);
    addNotification(done
      ? { title: 'Loan paid off', message: `${loan.name} is fully paid. Well done.`, type: 'success' }
      : { title: 'EMI paid', message: `${loan.name} · ${money(amount)} recorded as a Bills expense`, type: 'success' });
  }, [loans, setLoans, setTransactions, addNotification, money]);

  // ---------- Goals ----------
  const addGoal = useCallback((goal) => {
    setGoals((prev) => [...prev, { ...goal, id: newId() }]);
    addNotification({ title: 'Goal created', message: `${goal.name} · ${money(goal.target)}`, type: 'success' });
  }, [setGoals, addNotification, money]);

  const addGoalFunds = useCallback((id, amount) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal || !(amount > 0)) return;
    const current = round2(goal.current + amount);
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, current } : g)));
    addNotification(goal.current < goal.target && current >= goal.target
      ? { title: 'Goal reached', message: `${goal.name} is fully funded.`, type: 'success' }
      : { title: 'Funds added', message: `${goal.name} · +${money(amount)}`, type: 'success', persist: false });
  }, [goals, setGoals, addNotification, money]);

  const deleteGoal = useCallback((id) => {
    const g = goals.find((x) => x.id === id);
    setGoals((prev) => prev.filter((x) => x.id !== id));
    if (g) addNotification({ title: 'Goal deleted', message: g.name, type: 'warning', persist: false });
  }, [goals, setGoals, addNotification]);

  // ---------- Backup / restore ----------
  const exportData = useCallback(() => ({
    app: 'expense-tracker', version: 2, exportedAt: new Date().toISOString(),
    transactions, budgets, loans, goals,
  }), [transactions, budgets, loans, goals]);

  const importData = useCallback((data) => {
    if (!data || data.app !== 'expense-tracker' || !Array.isArray(data.transactions)) {
      return { success: false, error: 'This file isn’t an Expense Tracker backup.' };
    }
    setTransactions(asArray(data.transactions));
    setBudgets(normalizeBudgets(data.budgets));
    setLoans(asArray(data.loans));
    setGoals(asArray(data.goals));
    addNotification({ title: 'Backup restored', message: `${data.transactions.length} transactions loaded`, type: 'success' });
    return { success: true };
  }, [setTransactions, setBudgets, setLoans, setGoals, addNotification]);

  const clearAllData = useCallback(() => {
    setTransactions([]); setBudgets(emptyBudgets()); setLoans([]); setGoals([]);
    addNotification({ title: 'All data deleted', type: 'warning', persist: false });
  }, [setTransactions, setBudgets, setLoans, setGoals, addNotification]);

  // ---------- Derived ----------
  const sorted = useMemo(() => sortTransactions(transactions), [transactions]);

  const stats = useMemo(() => {
    const all = summarize(transactions);
    const month = currentMonthKey();
    const [y, m] = month.split('-').map(Number);
    const prev = `${m === 1 ? y - 1 : y}-${String(m === 1 ? 12 : m - 1).padStart(2, '0')}`;
    const thisMonth = summarize(inMonth(transactions, month));
    const lastMonth = summarize(inMonth(transactions, prev));
    const totalBudget = EXPENSE_CATEGORIES.reduce((s, c) => s + (budgets[c] || 0), 0);
    // Only count spending in categories that actually have a limit, so the ratio is meaningful.
    const budgetedSpent = EXPENSE_CATEGORIES.reduce(
      (s, c) => s + ((budgets[c] || 0) > 0 ? thisMonth.byCategory[c] || 0 : 0), 0);
    return { all, thisMonth, lastMonth, totalBudget, budgetedSpent, month };
  }, [transactions, budgets]);

  const value = useMemo(() => ({
    transactions: sorted, addTransaction, updateTransaction, deleteTransaction,
    budgets, updateBudget,
    loans, addLoan, deleteLoan, payLoanEmi,
    goals, addGoal, addGoalFunds, deleteGoal,
    exportData, importData, clearAllData,
    stats, money, currency: settings.currency,
  }), [sorted, addTransaction, updateTransaction, deleteTransaction, budgets, updateBudget,
    loans, addLoan, deleteLoan, payLoanEmi, goals, addGoal, addGoalFunds, deleteGoal,
    exportData, importData, clearAllData, stats, money, settings.currency]);

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useExpense = () => useContext(ExpenseContext);
