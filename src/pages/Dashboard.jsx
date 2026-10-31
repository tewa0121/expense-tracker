import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Receipt, Target, Trophy, CreditCard } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { CategoryDonut, TrendChart } from '../components/Charts';
import TransactionRow from '../components/TransactionRow';
import { EmptyState, Page, PageHeader, ProgressBar } from '../components/ui';
import { EXPENSE_CATEGORIES } from '../lib/constants';
import { categoryData, monthlySeries, pctChange } from '../lib/finance';
import { monthLabel } from '../lib/format';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

/** Delta chip tuned for the dark hero card. */
const HeroDelta = ({ value, goodWhenUp }) => {
  if (value === null) return <span className="text-xs text-white/40">No last month to compare</span>;
  if (value === 0) return <span className="text-xs text-white/55">Same as last month</span>;
  const up = value > 0;
  const good = up === goodWhenUp;
  return (
    <span className="text-xs text-white/55">
      <span className={`mr-1.5 font-semibold ${good ? 'text-[#6fdcaa]' : 'text-[#ff9189]'}`}>
        {up ? '▲' : '▼'} {Math.abs(value)}%
      </span>
      vs last month
    </span>
  );
};

const Dashboard = () => {
  const { transactions, stats, budgets, goals, loans, money } = useExpense();
  const { user } = useAuth();
  const { openTransactionModal } = useUI();

  const { thisMonth, lastMonth, all, totalBudget, budgetedSpent, month } = stats;
  const firstName = user?.name?.split(' ')[0] || '';

  const spentShare = thisMonth.income > 0 ? Math.min(100, (thisMonth.expenses / thisMonth.income) * 100) : 0;
  const budgetPct = totalBudget > 0 ? Math.round((budgetedSpent / totalBudget) * 100) : 0;

  const budgetRows = EXPENSE_CATEGORIES
    .filter((c) => budgets[c] > 0)
    .map((c) => ({ name: c, spent: thisMonth.byCategory[c] || 0, limit: budgets[c] }))
    .map((r) => ({ ...r, pct: (r.spent / r.limit) * 100 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);

  const activeGoals = goals.filter((g) => g.current < g.target).slice(0, 3);
  const activeLoans = loans.filter((l) => l.paid < l.total);
  const loanRemaining = activeLoans.reduce((s, l) => s + (l.total - l.paid), 0);

  if (transactions.length === 0 && goals.length === 0 && loans.length === 0) {
    return (
      <Page>
        <PageHeader title={`${greeting()}${firstName ? `, ${firstName}` : ''}`} subtitle="Let’s get your first entry in." />
        <EmptyState
          icon={Receipt}
          title="Your ledger is empty"
          text="Add your first income or expense and this page fills in with balances, trends and a category breakdown."
          action={() => openTransactionModal()}
          actionLabel="Add your first transaction"
        />
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title={`${greeting()}${firstName ? `, ${firstName}` : ''}`}
        subtitle={`Here’s how ${monthLabel(month, 'long')} is going.`}
      />

      <div className="grid gap-4 md:gap-6 xl:grid-cols-3">
        {/* Balance hero */}
        <section className="relative overflow-hidden rounded-3xl bg-side p-6 text-white shadow-lift ring-1 ring-white/5 md:p-8 xl:col-span-2" aria-label="Balance">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />
          <p className="text-sm text-white/60">Total balance</p>
          <p className={`num mt-1 font-display text-5xl font-bold tracking-tight md:text-6xl ${all.balance < 0 ? 'text-[#ff9189]' : ''}`}>
            {money(all.balance)}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
            <div>
              <p className="text-sm text-white/60">Income this month</p>
              <p className="num mt-1 font-display text-2xl font-bold">{money(thisMonth.income)}</p>
              <HeroDelta value={pctChange(thisMonth.income, lastMonth.income)} goodWhenUp />
            </div>
            <div>
              <p className="text-sm text-white/60">Spent this month</p>
              <p className="num mt-1 font-display text-2xl font-bold">{money(thisMonth.expenses)}</p>
              <HeroDelta value={pctChange(thisMonth.expenses, lastMonth.expenses)} goodWhenUp={false} />
            </div>
          </div>

          <div className="mt-7">
            <div className="h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={Math.round(spentShare)} aria-valuemin={0} aria-valuemax={100} aria-label="Share of income spent this month">
              <div className={`h-full rounded-full transition-[width] duration-500 ${thisMonth.expenses > thisMonth.income ? 'bg-[#ff9189]' : 'bg-brand'}`} style={{ width: `${spentShare}%` }} />
            </div>
            <p className="mt-2 text-xs text-white/60">
              {thisMonth.income > 0
                ? thisMonth.expenses > thisMonth.income
                  ? `Spending is ${money(thisMonth.expenses - thisMonth.income)} above this month’s income.`
                  : `You’ve spent ${Math.round(spentShare)}% of this month’s income. ${money(thisMonth.income - thisMonth.expenses)} left.`
                : 'No income recorded this month yet.'}
            </p>
          </div>
        </section>

        {/* Budgets */}
        <section className="card flex flex-col p-5 md:p-6" aria-label="Budgets">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Budgets</h2>
            <Link to="/budgets" className="text-sm font-semibold text-accent hover:underline">Manage</Link>
          </div>
          {totalBudget === 0 ? (
            <div className="flex flex-1 flex-col items-start justify-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/20"><Target size={20} /></span>
              <p className="text-sm text-muted">Set a monthly limit per category and we’ll warn you before you overspend.</p>
              <Link to="/budgets" className="btn-secondary">Set budgets</Link>
            </div>
          ) : (
            <>
              <p className="num font-display text-4xl font-bold">{budgetPct}%</p>
              <p className="mb-4 text-xs text-muted">{money(budgetedSpent)} of {money(totalBudget)} used</p>
              <ul className="space-y-3.5">
                {budgetRows.map((r) => (
                  <li key={r.name}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium">{r.name}</span>
                      <span className={`num text-xs ${r.pct >= 100 ? 'font-semibold text-loss' : 'text-muted'}`}>{Math.round(r.pct)}%</span>
                    </div>
                    <ProgressBar percent={r.pct} status={r.pct >= 100 ? 'over' : r.pct >= 80 ? 'warn' : 'ok'} height="h-2" label={`${r.name} budget used`} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <div className="xl:col-span-2"><TrendChart data={monthlySeries(transactions, month, 6)} title="Last 6 months" /></div>
        <CategoryDonut data={categoryData(thisMonth.byCategory)} title="Spending this month" subtitle={monthLabel(month, 'long')} />

        {/* Recent activity */}
        <section className="card overflow-hidden xl:col-span-2" aria-label="Recent transactions">
          <div className="flex items-center justify-between px-5 pb-2 pt-5 md:px-6">
            <h2 className="text-lg font-bold">Recent activity</h2>
            <Link to="/transactions" className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          {transactions.length === 0 ? (
            <div className="px-6 pb-8 pt-4 text-sm text-muted">
              No transactions yet.{' '}
              <button type="button" onClick={() => openTransactionModal()} className="font-semibold text-accent hover:underline">Add one</button>
            </div>
          ) : (
            <ul className="divide-y divide-line/70 pb-2">
              {transactions.slice(0, 6).map((t) => <TransactionRow key={t.id} t={t} showDate />)}
            </ul>
          )}
        </section>

        {/* Goals & loans */}
        <section className="card flex flex-col p-5 md:p-6" aria-label="Goals and loans">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Goals</h2>
            <Link to="/goals" className="text-sm font-semibold text-accent hover:underline">All goals</Link>
          </div>
          {activeGoals.length === 0 ? (
            <div className="flex flex-col items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/20"><Trophy size={20} /></span>
              <p className="text-sm text-muted">Saving for something? Create a goal and track it here.</p>
              <Link to="/goals" className="btn-secondary"><Plus size={16} /> New goal</Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {activeGoals.map((g) => {
                const pct = g.target > 0 ? (g.current / g.target) * 100 : 0;
                return (
                  <li key={g.id}>
                    <div className="mb-1.5 flex justify-between gap-2 text-sm">
                      <span className="truncate font-medium">{g.name}</span>
                      <span className="num text-xs text-muted">{Math.round(pct)}%</span>
                    </div>
                    <ProgressBar percent={pct} color={g.color} height="h-2" label={`${g.name} progress`} />
                  </li>
                );
              })}
            </ul>
          )}
          {activeLoans.length > 0 && (
            <Link to="/loans" className="mt-5 flex items-center gap-3 rounded-xl bg-surface-2 p-3 transition hover:brightness-95">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface"><CreditCard size={17} /></span>
              <span className="min-w-0 flex-1 text-sm">
                <span className="block font-semibold">{activeLoans.length} active {activeLoans.length === 1 ? 'loan' : 'loans'}</span>
                <span className="num block text-xs text-muted">{money(loanRemaining)} left to pay</span>
              </span>
              <ArrowRight size={16} className="text-muted" />
            </Link>
          )}
        </section>
      </div>
    </Page>
  );
};

export default Dashboard;
