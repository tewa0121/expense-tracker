import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const TYPE_STYLE = {
  success: { icon: CheckCircle2, cls: 'text-gain' },
  info: { icon: Info, cls: 'text-accent' },
  warning: { icon: AlertTriangle, cls: 'text-brand' },
  error: { icon: XCircle, cls: 'text-loss' },
};

const Toaster = () => {
  const { toasts, dismissToast } = useNotification();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:items-end lg:px-6"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const { icon: Icon, cls } = TYPE_STYLE[t.type] || TYPE_STYLE.info;
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-2xl bg-side p-3.5 pr-2 text-white shadow-pop"
          >
            <Icon size={18} className={`mt-0.5 flex-shrink-0 ${cls}`} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.message && <p className="mt-0.5 break-words text-xs text-white/70">{t.message}</p>}
            </div>
            {t.action && (
              <button
                type="button"
                onClick={() => { t.action.onClick(); dismissToast(t.id); }}
                className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-brand hover:bg-white/10"
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toaster;
