import { useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { Page, PageHeader, ProgressBar } from '../components/ui';
import { EXPENSE_CATEGORIES, categoryMeta } from '../lib/constants';
import { daysLeftInMonth, monthLabel } from '../lib/format';

const Budgets = () => {
  const { budgets, updateBudget, stats, money } = useExpense();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState('');

  const { thisMonth, totalBudget, month } = stats;
  const daysLeft = daysLeftInMonth();
  const totalSpentBudgeted = EXPENSE_CATEGORIES.reduce(
    (s, c) => s + (budgets[c] > 0 ? thisMonth.byCategory[c] || 0 : 0), 0);
  const totalPct = totalBudget > 0 ? (totalSpentBudgeted / totalBudget) * 100 : 0;
  const remaining = totalBudget - totalSpentBudgeted;

  const startEdit = (cat) => { setEditing(cat); setDraft(budgets[cat] ? String(budgets[cat]) : ''); };
  const save = (e) => {
    e.preventDefault();
    const value = draft === '' ? 0 : Number(draft);
    if (Number.isNaN(value) || value < 0) return;
    updateBudget(editing, value);
    setEditing(null);
  };

  return (
    <Page>
      <PageHeader title="Budgets" subtitle={`Monthly limits for ${monthLabel(month, 'long')}. Spending resets each month.`} />

      <section className="card mb-6 p-5 md:p-6" aria-label="Budget summary">
        {totalBudget === 0 ? (
          <div>
            <h2 className="text-lg font-bold">No limits set yet</h2>
            <p className="mt-1 text-sm text-muted">Choose “Set limit” on any category below. You’ll get a heads-up at 80% and again when you go over.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div>
                <p className="text-sm text-muted">{remaining >= 0 ? 'Left to spend' : 'Over budget by'}</p>
                <p className={`num font-display text-4xl font-bold ${remaining < 0 ? 'text-loss' : ''}`}>{money(Math.abs(remaining))}</p>
              </div>
              <div className="text-sm text-muted">
                <p><span className="num font-semibold text-fg">{money(totalSpentBudgeted)}</span> of {money(totalBudget)}</p>
                {remaining > 0 && <p><span className="num font-semibold text-fg">{money(remaining / daysLeft)}</span> a day for {daysLeft} more {daysLeft === 1 ? 'day' : 'days'}</p>}
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar percent={totalPct} status={totalPct >= 100 ? 'over' : totalPct >= 80 ? 'warn' : 'ok'} height="h-3" label="Total budget used" />
            </div>
          </>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {EXPENSE_CATEGORIES.map((cat) => {
          const { icon: Icon, color } = categoryMeta(cat);
          const spent = thisMonth.byCategory[cat] || 0;
          const limit = budgets[cat] || 0;
          const pct = limit > 0 ? (spent / limit) * 100 : 0;
          const status = pct >= 100 ? 'over' : pct >= 80 ? 'warn' : 'ok';

          return (
            <article key={cat} className="card p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}22`, color }}>
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <h2 className="truncate font-sans text-base font-bold">{cat}</h2>
                </div>

                {editing === cat ? (
                  <form onSubmit={save} className="flex items-center gap-1">
                    <input
                      autoFocus
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="1"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Escape') setEditing(null); }}
                      className="input num w-28 py-1.5"
                      placeholder="0"
                      aria-label={`Monthly limit for ${cat}`}
                    />
                    <button type="submit" className="icon-btn text-gain" aria-label="Save limit"><Check size={18} /></button>
                    <button type="button" onClick={() => setEditing(null)} className="icon-btn" aria-label="Cancel"><X size={18} /></button>
                  </form>
                ) : (
                  <button type="button" onClick={() => startEdit(cat)} className="btn-ghost -mr-2 min-h-9 px-3 py-1.5">
                    <Pencil size={14} /> {limit > 0 ? 'Edit' : 'Set limit'}
                  </button>
                )}
              </div>

              <div className="mb-2 flex items-baseline justify-between text-sm">
                <span><span className="num font-semibold">{money(spent)}</span> <span className="text-muted">spent</span></span>
                <span className="num text-muted">{limit > 0 ? `of ${money(limit)}` : 'No limit'}</span>
              </div>

              <ProgressBar
                percent={limit > 0 ? pct : spent > 0 ? 100 : 0}
                color={limit > 0 ? undefined : `${color}55`}
                status={status}
                label={`${cat} budget used`}
              />

              {limit > 0 && (
                <p className={`mt-2.5 text-xs ${status === 'over' ? 'font-semibold text-loss' : status === 'warn' ? 'font-semibold text-amber-700 dark:text-brand' : 'text-muted'}`}>
                  {status === 'over'
                    ? `Over by ${money(spent - limit)}`
                    : status === 'warn'
                      ? `Close to the limit · ${money(limit - spent)} left`
                      : `${Math.round(pct)}% used · ${money(limit - spent)} left`}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </Page>
  );
};

export default Budgets;
