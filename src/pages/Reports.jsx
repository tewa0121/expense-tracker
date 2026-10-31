import { useMemo, useState } from 'react';
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { CategoryDonut, TrendChart } from '../components/Charts';
import { Page, PageHeader, ProgressBar } from '../components/ui';
import { categoryMeta } from '../lib/constants';
import { PERIOD_LABELS, categoryData, inRange, monthlySeries, periodRange, summarize } from '../lib/finance';
import { shortDate } from '../lib/format';
import { exportTransactionsCsv } from '../utils/exportCsv';

const Reports = () => {
  const { transactions, money, currency } = useExpense();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [period, setPeriod] = useState('month');
  const [exporting, setExporting] = useState(false);

  const range = useMemo(() => periodRange(period), [period]);
  const rows = useMemo(() => inRange(transactions, range), [transactions, range]);
  const summary = useMemo(() => summarize(rows), [rows]);
  const series = useMemo(
    () => monthlySeries(transactions, range.endKey, Math.max(range.months, period === '3m' ? 3 : 6)),
    [transactions, range, period]
  );
  const cats = useMemo(() => categoryData(summary.byCategory), [summary]);
  const biggest = useMemo(
    () => rows.filter((t) => t.type === 'expense').reduce((m, t) => (!m || t.amount > m.amount ? t : m), null),
    [rows]
  );

  const exportPdf = async () => {
    if (!rows.length) {
      addNotification({ title: 'Nothing to export', message: 'There are no transactions in this period.', type: 'warning', persist: false });
      return;
    }
    setExporting(true);
    try {
      const { exportReportPdf } = await import('../utils/exportPdf');
      await exportReportPdf({ transactions: rows, summary, user, currency, periodLabel: PERIOD_LABELS[period] });
      addNotification({ title: 'PDF downloaded', message: `${rows.length} transactions · ${PERIOD_LABELS[period]}`, type: 'success', persist: false });
    } catch {
      addNotification({ title: 'Couldn’t create the PDF', message: 'Check your connection and try again.', type: 'error', persist: false });
    } finally {
      setExporting(false);
    }
  };

  const stats = [
    ['Income', money(summary.income), 'text-gain'],
    ['Spent', money(summary.expenses), ''],
    ['Net', money(summary.balance), summary.balance < 0 ? 'text-loss' : ''],
    ['Savings rate', summary.savingsRate === null ? '–' : `${summary.savingsRate}%`, summary.savingsRate !== null && summary.savingsRate < 0 ? 'text-loss' : ''],
  ];

  return (
    <Page>
      <PageHeader
        title="Reports"
        subtitle="See how your money moved over a period."
        action={
          <>
            <button type="button" className="btn-secondary" disabled={!rows.length} onClick={() => exportTransactionsCsv(rows)}>
              <FileSpreadsheet size={17} /> CSV
            </button>
            <button type="button" className="btn-primary" onClick={exportPdf} disabled={!rows.length || exporting}>
              {exporting ? <Loader2 size={17} className="animate-spin" /> : <Download size={17} />} PDF report
            </button>
          </>
        }
      />

      <div className="-mx-4 mb-6 overflow-x-auto px-4 md:mx-0 md:px-0" role="group" aria-label="Period">
        <div className="inline-flex gap-1 rounded-xl bg-surface-2 p-1">
          {Object.entries(PERIOD_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={period === key}
              onClick={() => setPeriod(key)}
              className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${period === key ? 'bg-surface text-fg shadow-lift' : 'text-muted hover:text-fg'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card mb-6 grid grid-cols-2 md:grid-cols-4">
        {stats.map(([label, value, cls], i) => (
          <div key={label} className={`p-4 md:p-5 ${i % 2 === 1 ? 'border-l border-line md:border-l-0' : ''} ${i > 1 ? 'border-t border-line md:border-t-0' : ''} ${i > 0 ? 'md:border-l md:border-line' : ''}`}>
            <p className="text-xs text-muted md:text-sm">{label}</p>
            <p className={`num mt-1 font-display text-xl font-bold md:text-2xl ${cls}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-4 md:gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3"><TrendChart data={series} title="Month by month" /></div>
        <div className="lg:col-span-2"><CategoryDonut data={cats} title="By category" subtitle={PERIOD_LABELS[period]} /></div>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-5">
        <section className="card p-5 md:p-6 lg:col-span-3" aria-label="Category breakdown">
          <h2 className="mb-4 text-lg font-bold">Spending breakdown</h2>
          {cats.length === 0 ? (
            <p className="py-6 text-sm text-muted">No expenses in this period.</p>
          ) : (
            <ul className="space-y-4">
              {cats.map((c) => {
                const share = (c.value / summary.expenses) * 100;
                const { icon: Icon, color } = categoryMeta(c.name);
                return (
                  <li key={c.name}>
                    <div className="mb-1.5 flex items-center gap-2.5 text-sm">
                      <Icon size={16} style={{ color }} aria-hidden="true" />
                      <span className="flex-1 font-medium">{c.name}</span>
                      <span className="num text-muted">{Math.round(share)}%</span>
                      <span className="num w-28 text-right font-semibold">{money(c.value)}</span>
                    </div>
                    <ProgressBar percent={share} color={color} height="h-2" label={`${c.name} share of spending`} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="card p-5 md:p-6 lg:col-span-2" aria-label="Highlights">
          <h2 className="mb-4 text-lg font-bold">Highlights</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-muted">Transactions</dt>
              <dd className="num font-display text-2xl font-bold">{summary.count}</dd>
            </div>
            <div>
              <dt className="text-muted">Biggest expense</dt>
              <dd className="font-semibold">
                {biggest ? <>{biggest.title} <span className="num">· {money(biggest.amount)}</span><span className="block text-xs font-normal text-muted">{shortDate(biggest.date)}</span></> : '–'}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Top category</dt>
              <dd className="font-semibold">{cats[0] ? `${cats[0].name} · ${money(cats[0].value)}` : '–'}</dd>
            </div>
          </dl>
        </section>
      </div>
    </Page>
  );
};

export default Reports;
