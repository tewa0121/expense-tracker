import { CURRENCIES } from './constants';

const symbolFor = (code) => CURRENCIES.find((c) => c.code === code)?.symbol ?? code;

/** Round to cents so 0.1 + 0.2 style float drift never reaches the screen or storage. */
export const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

const numberFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export function formatMoney(amount, currency = 'ETB') {
  const n = round2(amount || 0);
  const sign = n < 0 ? '-' : '';
  return `${sign}${symbolFor(currency)} ${numberFmt.format(Math.abs(n))}`;
}

/** Compact version for chart axes: 12.5K, 1.2M */
export function formatCompact(n) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

/** Plain-text amount for PDF/CSV (ASCII only, jsPDF's default font can't draw ₹ or €). */
export const formatPlain = (amount) => numberFmt.format(round2(amount || 0));

// ----- Dates. Stored as 'YYYY-MM-DD' strings; never go through UTC. -----

const pad = (n) => String(n).padStart(2, '0');

export function todayStr(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const monthKeyOf = (dateStr) => (dateStr || '').slice(0, 7);
export const currentMonthKey = () => monthKeyOf(todayStr());

export function addMonths(key, n) {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

/** Add months to a YYYY-MM-DD date, clamping to the end of shorter months. */
export function addMonthsToDate(dateStr, n) {
  const [y, m, day] = dateStr.split('-').map(Number);
  const target = new Date(y, m - 1 + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(day, last));
  return todayStr(target);
}

export function parseDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function monthLabel(key, style = 'short') {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1, 1);
  return style === 'long'
    ? d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : d.toLocaleDateString('en-US', { month: 'short' });
}

export function dayLabel(dateStr) {
  const today = todayStr();
  const yesterday = todayStr(new Date(Date.now() - 86400000));
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  return parseDate(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
}

export function shortDate(dateStr) {
  return parseDate(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function daysUntil(dateStr) {
  const ms = parseDate(dateStr) - parseDate(todayStr());
  return Math.round(ms / 86400000);
}

export function daysLeftInMonth() {
  const now = new Date();
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return last - now.getDate() + 1; // includes today
}

export function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export const initialsOf = (name) =>
  (name || 'U').trim().split(/\s+/).map((p) => p[0]).join('').toUpperCase().slice(0, 2) || 'U';
