import { todayStr } from '../lib/format';

const escapeCell = (v) => {
  let s = String(v ?? '');
  // Neutralise spreadsheet formula injection (=, +, -, @ at the start of a text cell).
  if (/^[=+\-@]/.test(s) && Number.isNaN(Number(s))) s = `'${s}`;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportTransactionsCsv(transactions) {
  const rows = [
    ['Date', 'Title', 'Category', 'Type', 'Amount'],
    ...transactions.map((t) => [t.date, t.title, t.category, t.type, t.amount]),
  ];
  const csv = rows.map((r) => r.map(escapeCell).join(',')).join('\r\n');
  // BOM so Excel opens UTF-8 correctly.
  downloadFile(`transactions-${todayStr()}.csv`, `﻿${csv}`, 'text/csv;charset=utf-8');
}
