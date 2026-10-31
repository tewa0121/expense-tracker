import { useState } from 'react';
import Modal from './Modal';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { CURRENCIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES, categoryMeta } from '../lib/constants';
import { todayStr } from '../lib/format';


const blank = () => ({ type: 'expense', amount: '', title: '', category: 'Food', date: todayStr() });

/** Add or edit a transaction. Pass `transaction` to edit. */
const TransactionModal = ({ open, onClose, transaction }) => (
  // Remounting on open/edit target resets the form without effects.
  <Modal open={open} onClose={onClose} title={transaction ? 'Edit transaction' : 'Add transaction'}>
    <Form key={transaction?.id ?? 'new'} transaction={transaction} onClose={onClose} />
  </Modal>
);

const Form = ({ transaction, onClose }) => {
  const { addTransaction, updateTransaction } = useExpense();
  const { settings } = useAuth();
  const symbol = CURRENCIES.find((c) => c.code === settings.currency)?.symbol ?? '';
  const [form, setForm] = useState(() => (transaction ? { ...transaction, amount: String(transaction.amount) } : blank()));
  const [error, setError] = useState('');

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const setType = (type) => {
    const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    set({ type, category: list.includes(form.category) ? form.category : list[0] });
  };

  const submit = (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!(amount > 0)) return setError('Enter an amount greater than zero.');
    if (!form.title.trim()) return setError('Add a short title, for example “Groceries”.');
    if (!form.date) return setError('Pick a date.');

    const data = { type: form.type, amount, title: form.title.trim(), category: form.category, date: form.date };
    if (transaction) updateTransaction(transaction.id, data);
    else addTransaction(data);
    onClose();
  };

  const isIncome = form.type === 'income';

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1" role="group" aria-label="Transaction type">
        {['expense', 'income'].map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={form.type === t}
            onClick={() => setType(t)}
            className={`rounded-lg py-2 text-sm font-semibold capitalize transition ${
              form.type === t ? 'bg-surface text-fg shadow-lift' : 'text-muted hover:text-fg'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="tx-amount" className="label">Amount</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-display text-lg font-semibold text-muted">
            {symbol}
          </span>
          <input
            id="tx-amount"
            data-autofocus
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => set({ amount: e.target.value })}
            placeholder="0.00"
            className={`input num py-3 pl-12 font-display text-2xl font-bold ${isIncome ? 'text-gain' : ''}`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="tx-title" className="label">Title</label>
        <input
          id="tx-title"
          type="text"
          value={form.title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder={isIncome ? 'Freelance payment' : 'Groceries'}
          className="input"
          maxLength={60}
        />
      </div>

      <fieldset>
        <legend className="label">Category</legend>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((c) => {
            const { icon: Icon, color } = categoryMeta(c);
            const active = form.category === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => set({ category: c })}
                className={`flex flex-col items-center gap-1.5 rounded-xl border px-1 py-2.5 text-[11px] font-medium transition ${
                  active ? 'border-transparent text-fg' : 'border-line text-muted hover:bg-surface-2'
                }`}
                style={active ? { backgroundColor: `${color}22`, boxShadow: `inset 0 0 0 1.5px ${color}` } : undefined}
              >
                <Icon size={18} style={{ color }} aria-hidden="true" />
                <span className="w-full truncate text-center">{c}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="tx-date" className="label">Date</label>
        <input
          id="tx-date"
          type="date"
          value={form.date}
          max={todayStr()}
          onChange={(e) => set({ date: e.target.value })}
          className="input"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-loss/10 px-3 py-2 text-sm font-medium text-loss">{error}</p>
      )}

      <button type="submit" className="btn-primary w-full py-3 text-base">
        {transaction ? 'Save changes' : isIncome ? 'Add income' : 'Add expense'}
      </button>
    </form>
  );
};

export default TransactionModal;
