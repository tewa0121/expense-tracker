export const LogoMark = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="flex-shrink-0">
    <rect width="32" height="32" rx="8" fill="#F2B134" />
    <rect x="7" y="8" width="18" height="3.5" rx="1.75" fill="#0E2326" />
    <rect x="7" y="14.25" width="13" height="3.5" rx="1.75" fill="#0E2326" opacity=".75" />
    <rect x="7" y="20.5" width="8" height="3.5" rx="1.75" fill="#0E2326" opacity=".5" />
  </svg>
);

const Logo = ({ light = false }) => (
  <div className="flex items-center gap-2.5">
    <LogoMark />
    <span className={`font-display text-lg font-bold leading-none tracking-tight ${light ? 'text-white' : 'text-fg'}`}>
      Expense<br />Tracker
    </span>
  </div>
);

export default Logo;
