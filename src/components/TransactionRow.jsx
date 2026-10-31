import { Pencil, Trash2 } from 'lucide-react';
import { categoryMeta } from '../lib/constants';
import { useExpense } from '../context/ExpenseContext';

/** One ledger line: category tile, title, amount. Pass onEdit/onDelete to show actions. */
const TransactionRow = ({ t, onEdit, onDelete, showDate = false }) => {
  const { money } = useExpense();
  const { icon: Icon, color } = categoryMeta(t.category);
  const income = t.type === 'income';

  return (
    <li className="group flex items-center gap-3 px-4 py-3 transition hover:bg-surface-2/60 md:px-5">
      <span
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}22`, color }}
        aria-hidden="true"
      >
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{t.title}</p>
        <p className="truncate text-xs text-muted">
          {t.category}
          {showDate && ` · ${new Date(`${t.date}T00:00:00`).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`}
        </p>
      </div>
      <span className={`num flex-shrink-0 text-sm font-bold md:text-base ${income ? 'text-gain' : 'text-fg'}`}>
        {income ? '+' : '−'}{money(t.amount)}
      </span>
      {(onEdit || onDelete) && (
        <div className="flex flex-shrink-0 md:opacity-0 md:transition md:focus-within:opacity-100 md:group-hover:opacity-100">
          {onEdit && (
            <button type="button" onClick={() => onEdit(t)} className="icon-btn h-8 w-8" aria-label={`Edit ${t.title}`}>
              <Pencil size={15} />
            </button>
          )}
          {onDelete && (
            <button type="button" onClick={() => onDelete(t.id)} className="icon-btn h-8 w-8 hover:bg-loss/10 hover:text-loss" aria-label={`Delete ${t.title}`}>
              <Trash2 size={15} />
            </button>
          )}
        </div>
      )}
    </li>
  );
};

export default TransactionRow;
