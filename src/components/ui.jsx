import { Link } from 'react-router-dom';

/** Page title block. Pages render this at the top of their content. */
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
    <div className="min-w-0">
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-muted md:text-base">{subtitle}</p>}
    </div>
    {action && <div className="flex flex-shrink-0 flex-wrap gap-2">{action}</div>}
  </div>
);

export const Page = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10 ${className}`}>{children}</div>
);

/** Empty states always say what to do next. */
export const EmptyState = ({ icon: Icon, title, text, action, to, actionLabel }) => (
  <div className="card flex flex-col items-center px-6 py-12 text-center">
    <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/20 text-fg">
      <Icon size={26} aria-hidden="true" />
    </span>
    <h2 className="text-lg font-bold">{title}</h2>
    <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>
    {action && <button type="button" onClick={action} className="btn-primary mt-5">{actionLabel}</button>}
    {to && <Link to={to} className="btn-primary mt-5">{actionLabel}</Link>}
  </div>
);

/** status: 'ok' | 'warn' | 'over' picks the fill colour; or pass `color` directly. */
export const ProgressBar = ({ percent, color, status = 'ok', label, height = 'h-2.5' }) => {
  const fill = color
    ? undefined
    : status === 'over' ? 'bg-loss' : status === 'warn' ? 'bg-brand' : 'bg-accent';
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-surface-2 ${height}`}
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${fill || ''}`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%`, backgroundColor: color }}
      />
    </div>
  );
};

/** Small ▲/▼ chip comparing with the previous period. `goodWhenUp=false` for expenses. */
export const DeltaChip = ({ value, goodWhenUp = true, suffix = 'vs last month' }) => {
  if (value === null || value === undefined) {
    return <span className="text-xs text-faint">No data for last month</span>;
  }
  if (value === 0) return <span className="text-xs text-muted">Same as last month</span>;
  const up = value > 0;
  const good = up === goodWhenUp;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className={`chip ${good ? 'bg-gain/12 text-gain' : 'bg-loss/12 text-loss'}`}>
        {up ? '▲' : '▼'} {Math.abs(value)}%
      </span>
      {suffix}
    </span>
  );
};

export const Skeleton = ({ className = '' }) => <div className={`skeleton ${className}`} />;
