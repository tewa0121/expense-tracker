import { formatPlain, todayStr } from '../lib/format';
import { categoryData } from '../lib/finance';

const INK = [14, 35, 38];
const GOLD = [242, 177, 52];

/**
 * jsPDF is loaded on demand so it isn't part of the initial bundle.
 * Amounts use the ISO currency code because jsPDF's built-in font can't draw symbols like ₹ or €.
 */
export async function exportReportPdf({ transactions, summary, user, currency, periodLabel }) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const doc = new jsPDF();
  const money = (n) => `${currency} ${formatPlain(n)}`;

  doc.setFillColor(...INK);
  doc.rect(0, 0, 210, 34, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('Expense Tracker report', 14, 17);
  doc.setFontSize(10);
  doc.setTextColor(...GOLD);
  doc.text(periodLabel, 14, 25);
  doc.setTextColor(200, 210, 208);
  doc.text(`${user?.name || ''}  ${user?.email ? `<${user.email}>` : ''}`, 196, 17, { align: 'right' });
  doc.text(`Generated ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`, 196, 25, { align: 'right' });

  autoTable(doc, {
    startY: 42,
    head: [['Summary', '']],
    body: [
      ['Income', money(summary.income)],
      ['Spent', money(summary.expenses)],
      ['Net', money(summary.balance)],
      ['Savings rate', summary.savingsRate === null ? 'n/a' : `${summary.savingsRate}%`],
      ['Transactions', String(summary.count)],
    ],
    theme: 'plain',
    headStyles: { fillColor: INK, textColor: 255 },
    columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
    styles: { fontSize: 10, cellPadding: 2.5 },
  });

  const cats = categoryData(summary.byCategory);
  if (cats.length) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Spending by category', 'Share', 'Amount']],
      body: cats.map((c) => [c.name, `${Math.round((c.value / summary.expenses) * 100)}%`, money(c.value)]),
      theme: 'striped',
      headStyles: { fillColor: INK },
      columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
      styles: { fontSize: 10 },
    });
  }

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Date', 'Title', 'Category', 'Type', `Amount (${currency})`]],
    body: transactions.map((t) => [
      t.date, t.title, t.category, t.type === 'income' ? 'Income' : 'Expense',
      `${t.type === 'income' ? '+' : '-'}${formatPlain(t.amount)}`,
    ]),
    theme: 'striped',
    headStyles: { fillColor: INK },
    columnStyles: { 4: { halign: 'right' } },
    styles: { fontSize: 9 },
  });

  doc.save(`expense-report-${todayStr()}.pdf`);
}
