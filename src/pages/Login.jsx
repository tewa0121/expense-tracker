import { useState } from 'react';
import { AlertCircle, Check, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const Field = ({ id, label, icon: Icon, hint, children }) => (
  <div>
    <label htmlFor={id} className="label">{label}</label>
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" size={17} aria-hidden="true" />
      {children}
    </div>
    {hint && <p className="hint">{hint}</p>}
  </div>
);

const Rule = ({ ok, children }) => (
  <li className={`flex items-center gap-1.5 text-xs ${ok ? 'text-gain' : 'text-muted'}`}>
    <span className={`flex h-4 w-4 items-center justify-center rounded-full ${ok ? 'bg-gain/15' : 'bg-surface-2'}`}>
      {ok && <Check size={11} strokeWidth={3} />}
    </span>
    {children}
  </li>
);

/** Decorative preview of the product. The figures are sample data, not the user's. */
const Preview = () => {
  const bars = [38, 62, 45, 78, 56, 90];
  const rows = [
    ['Salary', '+ 28,000', 'text-brand'],
    ['Groceries', '− 1,450', 'text-white'],
    ['Transport', '− 320', 'text-white'],
  ];
  return (
    <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur" aria-hidden="true">
      <p className="text-xs text-white/55">Sample balance</p>
      <p className="font-display text-4xl font-bold text-white">Br 26,230</p>
      <div className="mt-5 flex h-16 items-end gap-2">
        {bars.map((h, i) => (
          <span key={i} className="flex-1 rounded-t-md bg-brand" style={{ height: `${h}%`, opacity: 0.35 + i * 0.13 }} />
        ))}
      </div>
      <ul className="mt-5 divide-y divide-white/10 text-sm">
        {rows.map(([name, amt, cls]) => (
          <li key={name} className="flex justify-between py-2.5 text-white/70">
            <span>{name}</span><span className={`num font-semibold ${cls}`}>{amt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Login = () => {
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const res = isSignup
      ? await signup({ name: form.name, email: form.email, password: form.password, confirmPassword: form.confirm })
      : await login({ email: form.email, password: form.password });
    setBusy(false);
    if (!res.success) setError(res.error);
    // On success AuthContext sets the user and the route redirects to the dashboard.
  };

  const switchMode = () => {
    setIsSignup((v) => !v);
    setError('');
    setForm((f) => ({ ...f, password: '', confirm: '' }));
  };

  const pw = form.password;
  const input = 'input py-3 pl-10';

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-side p-12 text-white lg:flex">
        <Logo light />
        <div className="relative z-10 space-y-10">
          <h1 className="max-w-md text-5xl font-bold leading-[1.05]">
            Know where your money goes.
          </h1>
          <Preview />
        </div>
        <p className="text-sm text-white/50">Your data stays in this browser. Nothing is sent to a server.</p>
        <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
      </aside>

      <main className="flex min-h-dvh items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo /></div>

          <h2 className="text-3xl font-bold">{isSignup ? 'Create your account' : 'Welcome back'}</h2>
          <p className="mb-7 mt-1.5 text-sm text-muted">
            {isSignup ? 'Start tracking income, spending and goals.' : 'Sign in to see your dashboard.'}
          </p>

          {error && (
            <div role="alert" className="mb-5 flex items-start gap-2 rounded-xl bg-loss/10 px-3.5 py-3 text-sm font-medium text-loss">
              <AlertCircle size={17} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form key={isSignup ? 'signup' : 'login'} onSubmit={handleSubmit} className="space-y-4" noValidate>
            {isSignup && (
              <Field id="name" label="Full name" icon={User}>
                <input id="name" className={input} value={form.name} onChange={set('name')} autoComplete="name" placeholder="Tewachew Melaku" />
              </Field>
            )}

            <Field id="email" label="Email" icon={Mail} hint={isSignup ? 'Gmail addresses only.' : undefined}>
              <input id="email" type="email" className={input} value={form.email} onChange={set('email')} autoComplete="username" placeholder="you@gmail.com" inputMode="email" />
            </Field>

            <Field id="password" label="Password" icon={Lock}>
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                className={`${input} pr-11`}
                value={form.password}
                onChange={set('password')}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="icon-btn absolute right-1.5 top-1/2 h-8 w-8 -translate-y-1/2"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </Field>

            {isSignup && (
              <>
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Password requirements">
                  <Rule ok={pw.length >= 8}>8+ characters</Rule>
                  <Rule ok={/[A-Za-z]/.test(pw)}>A letter</Rule>
                  <Rule ok={/\d/.test(pw)}>A number</Rule>
                </ul>
                <Field id="confirm" label="Confirm password" icon={Lock}>
                  <input id="confirm" type={showPw ? 'text' : 'password'} className={input} value={form.confirm} onChange={set('confirm')} autoComplete="new-password" placeholder="••••••••" />
                </Field>
              </>
            )}

            <button type="submit" disabled={busy} className="btn-primary w-full py-3 text-base">
              {busy && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
              {isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {isSignup ? 'Already have an account?' : 'New here?'}{' '}
            <button type="button" onClick={switchMode} className="font-semibold text-fg underline decoration-brand decoration-2 underline-offset-4 hover:decoration-fg">
              {isSignup ? 'Sign in' : 'Create an account'}
            </button>
          </p>

          <p className="mt-10 text-center text-xs text-faint">
            © {new Date().getFullYear()} Expense Tracker · Built by <span className="font-semibold text-muted">Tewachew Melaku</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
