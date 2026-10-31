import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Database, Download, Lock, LogOut, Moon, Palette, Shield, Sun, Trash2, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { useNotification } from '../context/NotificationContext';
import ConfirmDialog from '../components/ConfirmDialog';
import { Page, PageHeader } from '../components/ui';
import { CURRENCIES } from '../lib/constants';
import { todayStr } from '../lib/format';
import { downloadFile } from '../utils/exportCsv';

const Switch = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-7 w-12 flex-shrink-0 rounded-full transition ${checked ? 'bg-accent' : 'bg-line'}`}
  >
    <span className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
  </button>
);

const Section = ({ icon: Icon, title, children }) => (
  <section className="card mb-6 p-5 md:p-6">
    <h2 className="mb-4 flex items-center gap-2 font-sans text-base font-bold"><Icon size={18} /> {title}</h2>
    {children}
  </section>
);

const Row = ({ title, text, children }) => (
  <div className="flex items-center justify-between gap-4 py-2">
    <div className="min-w-0">
      <p className="text-sm font-semibold">{title}</p>
      {text && <p className="text-xs text-muted">{text}</p>}
    </div>
    {children}
  </div>
);

const Settings = () => {
  const { logout, changePassword, settings, updateSettings, darkMode, toggleDarkMode } = useAuth();
  const { exportData, importData, clearAllData } = useExpense();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState({ old: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState(null);
  const [pwBusy, setPwBusy] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [importError, setImportError] = useState('');

  const resetPw = () => { setShowPw(false); setPw({ old: '', next: '', confirm: '' }); setPwMsg(null); };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    setPwBusy(true);
    const res = await changePassword(pw.old, pw.next, pw.confirm);
    setPwBusy(false);
    if (!res.success) return setPwMsg(res.error);
    addNotification({ title: 'Password changed', type: 'success', persist: false });
    resetPw();
  };

  const handleExport = () => {
    downloadFile(`expense-tracker-backup-${todayStr()}.json`, JSON.stringify(exportData(), null, 2), 'application/json');
    addNotification({ title: 'Backup downloaded', message: 'Keep the file somewhere safe.', type: 'success', persist: false });
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImportError('');
    try {
      const res = importData(JSON.parse(await file.text()));
      if (!res.success) setImportError(res.error);
    } catch {
      setImportError('That file couldn’t be read. Choose a backup you exported from this app.');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <Page className="max-w-3xl">
      <PageHeader title="Settings" subtitle="Make the app work the way you do." />

      <Section icon={Palette} title="Appearance and currency">
        <Row title="Dark mode" text={darkMode ? 'Using the dark theme' : 'Using the light theme'}>
          <div className="flex items-center gap-2.5">
            {darkMode ? <Moon size={17} className="text-muted" /> : <Sun size={17} className="text-muted" />}
            <Switch checked={darkMode} onChange={toggleDarkMode} label="Dark mode" />
          </div>
        </Row>
        <div className="mt-2 border-t border-line pt-4">
          <label htmlFor="currency" className="label">Currency</label>
          <select id="currency" className="input" value={settings.currency} onChange={(e) => updateSettings({ currency: e.target.value })}>
            {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
          <p className="hint">Changes how amounts are displayed. Existing entries aren’t converted.</p>
        </div>
      </Section>

      <Section icon={Bell} title="Alerts">
        <Row title="Budget alerts" text="Get notified at 80% of a category budget, and when you go over.">
          <Switch checked={settings.budgetAlerts} onChange={(v) => updateSettings({ budgetAlerts: v })} label="Budget alerts" />
        </Row>
      </Section>

      <Section icon={Shield} title="Security">
        {!showPw ? (
          <button type="button" onClick={() => setShowPw(true)} className="btn-secondary"><Lock size={16} /> Change password</button>
        ) : (
          <form onSubmit={handlePassword} className="space-y-3" noValidate>
            <div>
              <label htmlFor="pw-old" className="label">Current password</label>
              <input id="pw-old" type="password" autoComplete="current-password" className="input" value={pw.old} onChange={(e) => setPw({ ...pw, old: e.target.value })} />
            </div>
            <div>
              <label htmlFor="pw-new" className="label">New password</label>
              <input id="pw-new" type="password" autoComplete="new-password" className="input" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
              <p className="hint">At least 8 characters, with a letter and a number.</p>
            </div>
            <div>
              <label htmlFor="pw-confirm" className="label">Confirm new password</label>
              <input id="pw-confirm" type="password" autoComplete="new-password" className="input" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
            </div>
            {pwMsg && <p role="alert" className="rounded-xl bg-loss/10 px-3 py-2 text-sm font-medium text-loss">{pwMsg}</p>}
            <div className="flex gap-2 pt-1">
              <button type="submit" className="btn-primary" disabled={pwBusy}>Update password</button>
              <button type="button" className="btn-secondary" onClick={resetPw}>Cancel</button>
            </div>
          </form>
        )}
      </Section>

      <Section icon={Database} title="Your data">
        <p className="mb-4 text-sm text-muted">Everything is stored in this browser only. Download a backup before clearing browser data or switching devices.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={handleExport}><Download size={16} /> Download backup</button>
          <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()}><Upload size={16} /> Restore from backup</button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} aria-label="Choose backup file" />
        </div>
        {importError && <p role="alert" className="mt-3 rounded-xl bg-loss/10 px-3 py-2 text-sm font-medium text-loss">{importError}</p>}
        <div className="mt-5 border-t border-line pt-4">
          <button type="button" className="btn-danger" onClick={() => setConfirmClear(true)}><Trash2 size={16} /> Delete all my data</button>
        </div>
      </Section>

      <button type="button" onClick={handleLogout} className="btn-secondary w-full py-3 sm:w-auto"><LogOut size={17} /> Sign out</button>

      <ConfirmDialog
        open={confirmClear}
        title="Delete all your data?"
        message="Every transaction, budget, goal and loan on this account will be erased. Download a backup first if you might want it back."
        confirmLabel="Delete everything"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => { clearAllData(); setConfirmClear(false); }}
      />
    </Page>
  );
};

export default Settings;
