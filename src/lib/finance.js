import { addMonths, currentMonthKey, monthKeyOf, monthLabel, round2 } from './format';
import { EXPENSE_CATEGORIES } from './constants';

/** Totals + per-category expense breakdown for any list of transactions. */
export function summarize(transactions) {
  let income = 0;
  let expenses = 0;
  const byCategory = {};
  for (const t of transactions) {
    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      income += amt;
    } else {
      expenses += amt;
      const cat = EXPENSE_CATEGORIES.includes(t.category) ? t.category : 'Others';
      byCategory[cat] = (byCategory[cat] || 0) + amt;
    }
  }
  income = round2(income);
  expenses = round2(expenses);
  return {
    income,
    expenses,
    balance: round2(income - expenses),
    byCategory,
    count: transactions.length,
    savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 100) : null,
  };
}

export const inMonth = (transactions, key) =>
  transactions.filter((t) => monthKeyOf(t.date) === key);

/** Percentage change vs previous period. null when there is nothing to compare against. */
export function pctChange(current, previous) {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

/** Zero-filled monthly income/expense series ending at `endKey`. */
export function monthlySeries(transactions, endKey, months = 6) {
  const keys = Array.from({ length: months }, (_, i) => addMonths(endKey, i - (months - 1)));
  const map = Object.fromEntries(keys.map((k) => [k, { income: 0, expense: 0 }]));
  for (const t of transactions) {
    const k = monthKeyOf(t.date);
    if (!map[k]) continue;
    if (t.type === 'income') map[k].income += Number(t.amount) || 0;
    else map[k].expense += Number(t.amount) || 0;
  }
  return keys.map((k) => ({
    key: k,
    name: monthLabel(k),
    income: round2(map[k].income),
    expense: round2(map[k].expense),
  }));
}

export function categoryData(byCategory) {
  return Object.entries(byCategory)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value: round2(value) }))
    .sort((a, b) => b.value - a.value);
}

export function groupByDate(transactions) {
  const groups = [];
  const index = {};
  for (const t of transactions) {
    if (!index[t.date]) {
      index[t.date] = { date: t.date, items: [], net: 0 };
      groups.push(index[t.date]);
    }
    index[t.date].items.push(t);
    index[t.date].net += (t.type === 'income' ? 1 : -1) * (Number(t.amount) || 0);
  }
  return groups;
}

export const sortTransactions = (list) =>
  [...list].sort((a, b) => (a.date === b.date ? b.id - a.id : a.date < b.date ? 1 : -1));

/** Report periods. `from`/`to` are inclusive YYYY-MM-DD bounds (null = open). */
export function periodRange(period) {
  const now = currentMonthKey();
  const [y] = now.split('-');
  switch (period) {
    case 'month':
      return { from: `${now}-01`, to: `${now}-31`, months: 1, endKey: now };
    case '3m':
      return { from: `${addMonths(now, -2)}-01`, to: `${now}-31`, months: 3, endKey: now };
    case 'year':
      return { from: `${y}-01-01`, to: `${y}-12-31`, months: 12, endKey: `${y}-12` };
    default:
      return { from: null, to: null, months: 12, endKey: now };
  }
}

export function inRange(transactions, { from, to }) {
  return transactions.filter((t) => (!from || t.date >= from) && (!to || t.date <= to));
}

export const PERIOD_LABELS = {
  month: 'This month',
  '3m': 'Last 3 months',
  year: 'This year',
  all: 'All time',
};
