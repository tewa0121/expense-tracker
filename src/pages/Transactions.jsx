import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Plus, Receipt, Search, SearchX, X } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { useUI } from '../context/UIContext';
import TransactionRow from '../components/TransactionRow';
import { EmptyState, Page, PageHeader } from '../components/ui';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../lib/constants';
import { groupByDate, summarize } from '../lib/finance';
import { dayLabel, monthKeyOf, monthLabel } from '../lib/format';
import { exportTransactionsCsv } from '../utils/exportCsv';

const PAGE_SIZE = 40;
const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

const Transactions = () => {
  const { transactions, deleteTransaction, money } = useExpense();
  const { openTransactionModal } = useUI();
  const [params, setParams] = useSearchParams();
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('all');
  const [month, setMonth] = useState('all');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const q = params.get('q') || '';
  const setQ = (value) => {
    setVisible(PAGE_SIZE);
    setParams(value ? { q: value } : {}, { replace: true });
  };

  const months = useMemo(
    () => [...new Set(transactions.map((t) => monthKeyOf(t.date)))].sort().reverse(),
    [transactions]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return transactions.filter((t) =>
      (type === 'all' || t.type === type) &&
      (category === 'all' || t.category === category) &&
      (month === 'all' || monthKeyOf(t.date) === month) &&
      (!needle || t.title.toLowerCase().includes(needle) || t.category.toLowerCase().includes(needle))
    );
  }, [transactions, q, type, category, month]);

  const totals = useMemo(() => summarize(filtered), [filtered]);
  const groups = useMemo(() => groupByDate(filtered.slice(0, visible)), [filtered, visible]);
  const filtersActive = q || type !== 'all' || category !== 'all' || month !== 'all';

  const resetFilters = () => { setType('all'); setCategory('all'); setMonth('all'); setQ(''); };

  return (
    <Page>
      <PageHeader
        title="Transactions"
        subtitle="Every entry, newest first."
        action={
          <>
            <button type="button" className="btn-secondary" disabled={!filtered.length} onClick={() => exportTransactionsCsv(filtered)}>
              <Download size={17} /> Export CSV
            </button>
            <button type="button" className="btn-primary" onClick={() => openTransactionModal()}>
              <Plus size={18} strokeWidth={2.5} /> Add transaction
            </button>
          </>
        }
      />

      {transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          text="Record what you earn and spend. Entries are grouped by day here."
          action={() => openTransactionModal()}
          actionLabel="Add a transaction"
        />
      ) : (
        <>
          <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative sm:col-span-2 xl:col-span-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" size={17} aria-hidden="true" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title or category"
                aria-label="Search transactions"
                className="input pl-10"
              />
            </div>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1 sm:col-span-2 xl:col-span-1" role="group" aria-label="Type">
              {[['all', 'All'], ['expense', 'Spent'], ['income', 'Income']].map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={type === v}
                  onClick={() => { setType(v); setVisible(PAGE_SIZE); }}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${type === v ? 'bg-surface text-fg shadow-lift' : 'text-muted hover:text-fg'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <select aria-label="Category" className="input" value={category} onChange={(e) => { setCategory(e.target.value); setVisible(PAGE_SIZE); }}>
              <option value="all">All categories</option>
              {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select aria-label="Month" className="input" value={month} onChange={(e) => { setMonth(e.target.value); setVisible(PAGE_SIZE); }}>
              <option value="all">All time</option>
              {months.map((m) => <option key={m} value={m}>{monthLabel(m, 'long')}</option>)}
            </select>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted">
            <span>{filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}</span>
            <span>In <span className="num font-semibold text-gain">{money(totals.income)}</span></span>
            <span>Out <span className="num font-semibold text-fg">{money(totals.expenses)}</span></span>
            {filtersActive && (
              <button type="button" onClick={resetFilters} className="ml-auto inline-flex items-center gap-1 font-semibold text-accent hover:underline">
                <X size={14} /> Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Nothing matches"
              text="Try a different search or clear the filters."
              action={resetFilters}
              actionLabel="Clear filters"
            />
          ) : (
            <div className="space-y-5">
              {groups.map((g) => (
                <section key={g.date} aria-label={dayLabel(g.date)}>
                  <div className="mb-1.5 flex items-baseline justify-between px-1">
                    <h2 className="font-sans text-sm font-bold">{dayLabel(g.date)}</h2>
                    <span className={`num text-xs font-semibold ${g.net >= 0 ? 'text-gain' : 'text-muted'}`}>
                      {g.net >= 0 ? '+' : '−'}{money(Math.abs(g.net))}
                    </span>
                  </div>
                  <ul className="card divide-y divide-line/70 overflow-hidden">
                    {g.items.map((t) => (
                      <TransactionRow key={t.id} t={t} onEdit={openTransactionModal} onDelete={deleteTransaction} />
                    ))}
                  </ul>
                </section>
              ))}
              {filtered.length > visible && (
                <button type="button" className="btn-secondary mx-auto flex" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Show {Math.min(PAGE_SIZE, filtered.length - visible)} more
                </button>
              )}
            </div>
          )}
        </>
      )}
    </Page>
  );
};

export default Transactions;
