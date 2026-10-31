import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { categoryMeta } from '../lib/constants';
import { formatCompact } from '../lib/format';

/** Recharts needs concrete colours (not CSS variables), so mirror the tokens per theme. */
function useChartTheme() {
  const { darkMode } = useAuth();
  return darkMode
    ? { grid: '#25393a', tick: '#8ca3a0', income: '#4fd1c5', expense: '#f2b134', cursor: 'rgba(255,255,255,0.05)', hole: '#e8efec' }
    : { grid: '#dce3df', tick: '#5e7270', income: '#0f766e', expense: '#f2b134', cursor: 'rgba(15,34,36,0.05)', hole: '#0f2224' };
}

const TooltipBox = ({ active, payload, label, money, theme }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-pop">
      {label && <p className="mb-1 font-semibold text-fg">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey || p.name} className="flex items-center gap-2 text-muted">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.payload?.fill || theme.income }} />
          {p.name}: <span className="num font-semibold text-fg">{money(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

export const Legend = ({ items }) => (
  <div className="flex items-center gap-4 text-xs text-muted">
    {items.map((i) => (
      <span key={i.label} className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: i.color }} /> {i.label}
      </span>
    ))}
  </div>
);

export const TrendChart = ({ data, title = 'Income and spending' }) => {
  const theme = useChartTheme();
  const { money } = useExpense();
  const hasData = data.some((d) => d.income > 0 || d.expense > 0);

  return (
    <section className="card flex h-full min-h-[320px] flex-col p-5 md:p-6" aria-label={title}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <Legend items={[{ label: 'Income', color: theme.income }, { label: 'Spent', color: theme.expense }]} />
      </div>
      {!hasData ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center text-sm text-muted">
          <p className="font-medium text-fg">No activity in this period</p>
          <p className="mt-1">Add a transaction to see your trend.</p>
        </div>
      ) : (
        <div className="min-h-[220px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 0, left: -12, bottom: 0 }} barGap={3}>
              <CartesianGrid vertical={false} stroke={theme.grid} strokeDasharray="3 4" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme.tick, fontSize: 12 }} dy={6} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.tick, fontSize: 12 }} tickFormatter={formatCompact} width={52} />
              <Tooltip cursor={{ fill: theme.cursor }} content={<TooltipBox money={money} theme={theme} />} />
              <Bar dataKey="income" name="Income" fill={theme.income} radius={[5, 5, 0, 0]} maxBarSize={22} />
              <Bar dataKey="expense" name="Spent" fill={theme.expense} radius={[5, 5, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export const CategoryDonut = ({ data, title = 'Where it went', subtitle }) => {
  const theme = useChartTheme();
  const { money } = useExpense();
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <section className="card flex h-full min-h-[320px] flex-col p-5 md:p-6" aria-label={title}>
      <div className="mb-3">
        <h2 className="text-lg font-bold">{title}</h2>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>
      {data.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center text-sm text-muted">
          <p className="font-medium text-fg">No spending yet</p>
          <p className="mt-1">Expenses will be split by category here.</p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4">
          <div className="relative mx-auto h-40 w-40 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={2} stroke="none">
                  {data.map((d) => <Cell key={d.name} fill={categoryMeta(d.name).color} />)}
                </Pie>
                <Tooltip content={<TooltipBox money={money} theme={theme} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[11px] text-muted">Total</span>
              <span className="num font-display text-sm font-bold">{money(total)}</span>
            </div>
          </div>
          <ul className="space-y-2">
            {data.slice(0, 6).map((d) => (
              <li key={d.name} className="flex items-center gap-2.5 text-sm">
                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: categoryMeta(d.name).color }} />
                <span className="flex-1 truncate">{d.name}</span>
                <span className="num text-muted">{Math.round((d.value / total) * 100)}%</span>
                <span className="num w-24 text-right font-semibold">{money(d.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
