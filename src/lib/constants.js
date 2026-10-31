import {
  Utensils, Receipt, ShoppingBag, Bus, HeartPulse, Clapperboard, GraduationCap,
  MoreHorizontal, Banknote, Briefcase, Gift, TrendingUp,
} from 'lucide-react';

export const EXPENSE_CATEGORIES = [
  'Food', 'Bills', 'Shopping', 'Transport', 'Health', 'Entertainment', 'Education', 'Others',
];

export const INCOME_CATEGORIES = ['Salary', 'Business', 'Investment', 'Gift', 'Others'];

/** One source of truth for category colour + icon (previously duplicated in 4 files). */
export const CATEGORY_META = {
  Food: { color: '#E8833A', icon: Utensils },
  Bills: { color: '#3F7CAC', icon: Receipt },
  Shopping: { color: '#B8559B', icon: ShoppingBag },
  Transport: { color: '#2E9E8F', icon: Bus },
  Health: { color: '#D64550', icon: HeartPulse },
  Entertainment: { color: '#7B61C9', icon: Clapperboard },
  Education: { color: '#C9A227', icon: GraduationCap },
  Salary: { color: '#17805A', icon: Banknote },
  Business: { color: '#3F7CAC', icon: Briefcase },
  Investment: { color: '#2E9E8F', icon: TrendingUp },
  Gift: { color: '#B8559B', icon: Gift },
  Others: { color: '#7D8F8C', icon: MoreHorizontal },
};

export const categoryMeta = (name) => CATEGORY_META[name] || CATEGORY_META.Others;

export const CURRENCIES = [
  { code: 'ETB', symbol: 'Br', label: 'Ethiopian birr (Br)' },
  { code: 'USD', symbol: '$', label: 'US dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'British pound (£)' },
  { code: 'KES', symbol: 'KSh', label: 'Kenyan shilling (KSh)' },
  { code: 'INR', symbol: '₹', label: 'Indian rupee (₹)' },
];

export const DEFAULT_SETTINGS = { currency: 'ETB', budgetAlerts: true };

export const emptyBudgets = () =>
  Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c, 0]));

