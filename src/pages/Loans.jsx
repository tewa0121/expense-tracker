import { useState } from 'react';
import { CalendarClock, CheckCircle2, CreditCard, Plus, Trash2, Wallet } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { EmptyState, Page, PageHeader, ProgressBar } from '../components/ui';
import { addMonthsToDate, daysUntil, shortDate, todayStr } from '../lib/format';

const blank = { name: '', total: '', paid: '', emi: '', dueDate: todayStr() };

const LoanForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = (e) => {
    e.preventDefault();
    const total = Number(form.total);
    const paid = Number(form.paid) || 0;
    const emi = Number(form.emi) || 0;
    if (!form.name.trim()) return setError('Give the loan a name, for example “Car loan”.');
    if (!(total > 0)) return setError('Enter the total loan amount.');
    if (paid < 0 || paid > total) return setError('Amount already paid must be between zero and the total.');
    if (emi < 0) return setError('Monthly payment can’t be negative.');
    onSubmit({ name: form.name.trim(), total, paid, emi, dueDate: form.dueDate || todayStr() });
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="l-name" className="label">Loan name</label>
        <input id="l-name" data-autofocus className="input" value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Car loan" maxLength={50} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="l-total" className="label">Total amount</label>
          <input id="l-total" type="number" inputMode="decimal" min="0" className="input num" value={form.total} onChange={(e) => set({ total: e.target.value })} />
        </div>
        <div>
          <label htmlFor="l-paid" className="label">Already paid</label>
          <input id="l-paid" type="number" inputMode="decimal" min="0" className="input num" value={form.paid} onChange={(e) => set({ paid: e.target.value })} placeholder="0" />
        </div>
        <div>
          <label htmlFor="l-emi" className="label">Monthly payment</label>
          <input id="l-emi" type="number" inputMode="decimal" min="0" className="input num" value={form.emi} onChange={(e) => set({ emi: e.target.value })} />
        </div>
        <div>
          <label htmlFor="l-due" className="label">Next due date</label>
          <input id="l-due" type="date" className="input" value={form.dueDate} onChange={(e) => set({ dueDate: e.target.value })} />
        </div>
      </div>
      {error && <p role="alert" className="rounded-xl bg-loss/10 px-3 py-2 text-sm font-medium text-loss">{error}</p>}
      <div className="flex gap-3 pt-1">
        <button type="button" className="btn-secondary flex-1" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary flex-1">Add loan</button>
      </div>
    </form>
  );
};

const dueInfo = (dueDate) => {
  const d = daysUntil(dueDate);
  if (d < 0) return { text: `Overdue by ${-d} ${-d === 1 ? 'day' : 'days'}`, cls: 'bg-loss/12 text-loss' };
  if (d === 0) return { text: 'Due today', cls: 'bg-brand/25 text-fg' };
  if (d <= 7) return { text: `Due in ${d} ${d === 1 ? 'day' : 'days'}`, cls: 'bg-brand/25 text-fg' };
  return { text: `Due ${shortDate(dueDate)}`, cls: 'bg-surface-2 text-muted' };
};

const Loans = () => {
  const { loans, addLoan, deleteLoan, payLoanEmi, money } = useExpense();
  const [showForm, setShowForm] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const totalDebt = loans.reduce((s, l) => s + l.total, 0);
  const totalPaid = loans.reduce((s, l) => s + l.paid, 0);
  const monthly = loans.filter((l) => l.paid < l.total).reduce((s, l) => s + l.emi, 0);

  const summary = [
    ['Total borrowed', money(totalDebt), ''],
    ['Paid so far', money(totalPaid), 'text-gain'],
    ['Still owed', money(totalDebt - totalPaid), 'text-loss'],
    ['Due each month', money(monthly), ''],
  ];

  return (
    <Page>
      <PageHeader
        title="Loans"
        subtitle="Track what you owe and log each monthly payment."
        action={<button type="button" className="btn-primary" onClick={() => setShowForm(true)}><Plus size={18} strokeWidth={2.5} /> Add loan</button>}
      />

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add loan">
        <LoanForm onCancel={() => setShowForm(false)} onSubmit={(l) => { addLoan(l); setShowForm(false); }} />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this loan?"
        message={toDelete ? `“${toDelete.name}” will be removed. Expenses already recorded for it stay in your transactions.` : ''}
        onCancel={() => setToDelete(null)}
        onConfirm={() => { deleteLoan(toDelete.id); setToDelete(null); }}
      />

      {loans.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No loans tracked"
          text="Add a loan to see what’s left and record each payment. Paying an EMI also logs a Bills expense."
          action={() => setShowForm(true)}
          actionLabel="Add a loan"
        />
      ) : (
        <>
          <div className="card mb-6 grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x">
            {summary.map(([label, value, cls], i) => (
              <div key={label} className={`p-4 md:p-5 ${i % 2 === 1 ? 'border-l border-line md:border-l-0' : ''} ${i > 1 ? 'border-t border-line md:border-t-0' : ''}`}>
                <p className="text-xs text-muted md:text-sm">{label}</p>
                <p className={`num mt-1 font-display text-xl font-bold md:text-2xl ${cls}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:gap-6 xl:grid-cols-2">
            {loans.map((loan) => {
              const pct = loan.total > 0 ? (loan.paid / loan.total) * 100 : 0;
              const paidOff = loan.paid >= loan.total;
              const left = loan.total - loan.paid;
              const emisLeft = loan.emi > 0 ? Math.ceil(left / loan.emi) : 0;
              const due = !paidOff ? dueInfo(loan.dueDate) : null;

              return (
                <article key={loan.id} className="card p-5 md:p-6">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${paidOff ? 'bg-gain/15 text-gain' : 'bg-brand/20 text-fg'}`}>
                        {paidOff ? <CheckCircle2 size={21} aria-hidden="true" /> : <CreditCard size={21} aria-hidden="true" />}
                      </span>
                      <div className="min-w-0">
                        <h2 className="truncate font-sans text-base font-bold">{loan.name}</h2>
                        {paidOff ? (
                          <span className="chip bg-gain/12 text-gain">Paid off</span>
                        ) : (
                          <span className={`chip ${due.cls}`}><CalendarClock size={12} /> {due.text}</span>
                        )}
                      </div>
                    </div>
                    <button type="button" onClick={() => setToDelete(loan)} className="icon-btn -mr-1.5 -mt-1 hover:bg-loss/10 hover:text-loss" aria-label={`Delete ${loan.name}`}>
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="mb-2 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted">Remaining</p>
                      <p className="num font-display text-2xl font-bold">{money(left)}</p>
                    </div>
                    <p className="num text-sm text-muted">{money(loan.paid)} of {money(loan.total)}</p>
                  </div>
                  <ProgressBar percent={pct} status={paidOff ? 'ok' : 'warn'} label={`${loan.name} repaid`} />

                  <div className="mt-3.5 flex items-center justify-between gap-3">
                    <p className="text-xs text-muted">
                      {Math.round(pct)}% repaid{emisLeft > 0 && !paidOff && ` · ${emisLeft} ${emisLeft === 1 ? 'payment' : 'payments'} left`}
                    </p>
                    {!paidOff && loan.emi > 0 && (
                      <button type="button" onClick={() => payLoanEmi(loan.id, addMonthsToDate)} className="btn-primary min-h-9 px-3 py-1.5">
                        <Wallet size={15} /> Pay {money(Math.min(loan.emi, left))}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </Page>
  );
};

export default Loans;
