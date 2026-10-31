import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Target, Menu, Plus } from 'lucide-react';
import { useUI } from '../context/UIContext';

const Tab = ({ to, icon: Icon, label, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition ${
        isActive ? 'text-fg' : 'text-muted'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span className={`flex h-7 w-12 items-center justify-center rounded-full transition ${isActive ? 'bg-brand/25' : ''}`}>
          <Icon size={20} strokeWidth={isActive ? 2.4 : 1.9} aria-hidden="true" />
        </span>
        {label}
      </>
    )}
  </NavLink>
);

/** Thumb-reach navigation on phones; the centre button adds a transaction from anywhere. */
const BottomNav = ({ onMore }) => {
  const { openTransactionModal } = useUI();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Quick navigation"
    >
      <div className="mx-auto flex max-w-xl items-end px-2">
        <Tab to="/" end icon={LayoutDashboard} label="Home" />
        <Tab to="/transactions" icon={Receipt} label="Activity" />
        <div className="flex flex-1 justify-center">
          <button
            type="button"
            onClick={() => openTransactionModal()}
            className="-mt-5 mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-on-brand shadow-pop ring-4 ring-surface transition active:scale-95"
            aria-label="Add transaction"
          >
            <Plus size={26} strokeWidth={2.6} />
          </button>
        </div>
        <Tab to="/budgets" icon={Target} label="Budgets" />
        <button type="button" onClick={onMore} className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium text-muted">
          <span className="flex h-7 w-12 items-center justify-center"><Menu size={20} aria-hidden="true" /></span>
          More
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
