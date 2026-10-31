import { useState } from 'react';
import { CalendarClock, CheckCircle2, Plus, Trash2, Trophy } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { EmptyState, Page, PageHeader, ProgressBar } from '../components/ui';
import { daysUntil, shortDate, todayStr } from '../lib/format';

const COLORS = ['#0f766e', '#E8833A', '#B8559B', '#3F7CAC', '#7B61C9', '#C9A227'];
const blank = { name: '', target: '', current: '', deadline: '', color: COLORS[0] };

const GoalForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = (e) => {
    e.preventDefault();
    const target = Number(form.target);
    const current = Number(form.current) || 0;
    if (!form.name.trim()) return setError('Give the goal a name, for example “Emergency fund”.');
    if (!(target > 0)) return setError('Enter a target amount greater than zero.');
    if (current < 0) return setError('Starting savings can’t be negative.');
    onSubmit({ name: form.name.trim(), target, current, color: form.color, deadline: form.deadline || null });
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="g-name" className="label">Goal name</label>
        <input id="g-name" data-autofocus className="input" value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Emergency fund" maxLength={50} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="g-target" className="label">Target</label>
          <input id="g-target" type="number" inputMode="decimal" min="0" className="input num" value={form.target} onChange={(e) => set({ target: e.target.value })} placeholder="50,000" />
        </div>
        <div>
          <label htmlFor="g-current" className="label">Saved so far</label>
          <input id="g-current" type="number" inputMode="decimal" min="0" className="input num" value={form.current} onChange={(e) => set({ current: e.target.value })} placeholder="0" />
        </div>
      </div>
      <div>
        <label htmlFor="g-deadline" className="label">Target date <span className="font-normal text-muted">(optional)</span></label>
        <input id="g-deadline" type="date" min={todayStr()} className="input" value={form.deadline} onChange={(e) => set({ deadline: e.target.value })} />
      </div>
      <fieldset>
        <legend className="label">Colour</legend>
        <div className="flex gap-2.5">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Colour ${c}`}
              aria-pressed={form.color === c}
              onClick={() => set({ color: c })}
              className={`h-8 w-8 rounded-full transition ${form.color === c ? 'ring-2 ring-fg ring-offset-2 ring-offset-surface' : 'hover:scale-110'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </fieldset>
      {error && <p role="alert" className="rounded-xl bg-loss/10 px-3 py-2 text-sm font-medium text-loss">{error}</p>}
      <div className="flex gap-3 pt-1">
        <button type="button" className="btn-secondary flex-1" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary flex-1">Create goal</button>
      </div>
    </form>
  );
};

const AddFunds = ({ onAdd }) => {
  const [value, setValue] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const n = Number(value);
    if (n > 0) { onAdd(n); setValue(''); }
  };
  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="number" inputMode="decimal" min="0" value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add savings" aria-label="Amount to add"
        className="input num py-2"
      />
      <button type="submit" className="btn-secondary flex-shrink-0" disabled={!(Number(value) > 0)}>Add</button>
    </form>
  );
};

const Goals = () => {
  const { goals, addGoal, addGoalFunds, deleteGoal, money } = useExpense();
  const [showForm, setShowForm] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  return (
    <Page>
      <PageHeader
        title="Goals"
        subtitle="Save towards something specific and watch it fill up."
        action={<button type="button" className="btn-primary" onClick={() => setShowForm(true)}><Plus size={18} strokeWidth={2.5} /> New goal</button>}
      />

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New goal">
        <GoalForm onCancel={() => setShowForm(false)} onSubmit={(g) => { addGoal(g); setShowForm(false); }} />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this goal?"
        message={toDelete ? `“${toDelete.name}” and its progress will be removed. This can’t be undone.` : ''}
        onCancel={() => setToDelete(null)}
        onConfirm={() => { deleteGoal(toDelete.id); setToDelete(null); }}
      />

      {goals.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No goals yet"
          text="Name something you’re saving for, set a target, and add to it whenever you can."
          action={() => setShowForm(true)}
          actionLabel="Create your first goal"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {goals.map((g) => {
            const pct = g.target > 0 ? (g.current / g.target) * 100 : 0;
            const done = g.current >= g.target;
            const left = Math.max(0, g.target - g.current);
            const days = g.deadline ? daysUntil(g.deadline) : null;
            const months = days !== null && days > 0 ? Math.max(1, Math.ceil(days / 30)) : null;

            return (
              <article key={g.id} className="card p-5 md:p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${g.color}25`, color: g.color }}>
                      {done ? <CheckCircle2 size={21} aria-hidden="true" /> : <Trophy size={21} aria-hidden="true" />}
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate font-sans text-base font-bold">{g.name}</h2>
                      {g.deadline ? (
                        <p className="flex items-center gap-1 text-xs text-muted"><CalendarClock size={12} /> {shortDate(g.deadline)}</p>
                      ) : (
                        <p className="text-xs text-muted">No target date</p>
                      )}
                    </div>
                  </div>
                  <button type="button" onClick={() => setToDelete(g)} className="icon-btn -mr-1.5 -mt-1 hover:bg-loss/10 hover:text-loss" aria-label={`Delete ${g.name}`}>
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="mb-2 flex items-end justify-between">
                  <p className="num font-display text-2xl font-bold">{money(g.current)}</p>
                  <p className="num text-sm text-muted">of {money(g.target)}</p>
                </div>
                <ProgressBar percent={pct} color={g.color} label={`${g.name} progress`} />
                <p className="mt-2.5 text-xs text-muted">
                  {done
                    ? 'Goal reached. Nice work.'
                    : `${Math.round(pct)}% saved · ${money(left)} to go${months ? ` · about ${money(left / months)} a month` : ''}`}
                  {days !== null && days <= 0 && !done && ' · Target date passed'}
                </p>

                {!done && <div className="mt-4"><AddFunds onAdd={(n) => addGoalFunds(g.id, n)} /></div>}
              </article>
            );
          })}
        </div>
      )}
    </Page>
  );
};

export default Goals;
