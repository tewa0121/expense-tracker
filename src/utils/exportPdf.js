import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportTransactionsPdf = (transactions, stats, user) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229);
  doc.text('Expense Tracker Report', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 27);
  doc.text(`User: ${user?.name || 'N/A'} (${user?.email || 'N/A'})`, 14, 33);

  // Summary
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Summary', 14, 45);

  autoTable(doc, {
    startY: 50,
    head: [['Metric', 'Value']],
    body: [
      ['Total Income', `Rs. ${stats.income.toLocaleString()}`],
      ['Total Expenses', `Rs. ${stats.expenses.toLocaleString()}`],
      ['Balance', `Rs. ${stats.balance.toLocaleString()}`],
      ['Transactions', transactions.length]
    ],
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }
  });

  // Transactions
  const afterSummary = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text('Transactions', 14, afterSummary);

  autoTable(doc, {
    startY: afterSummary + 5,
    head: [['Date', 'Title', 'Category', 'Type', 'Amount (Rs.)']],
    body: transactions.map(t => [
      t.date,
      t.title,
      t.category,
      t.type.charAt(0).toUpperCase() + t.type.slice(1),
      `${t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}`
    ]),
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] },
    columnStyles: {
      4: { halign: 'right' }
    }
  });

  doc.save(`expense-report-${new Date().toISOString().split('T')[0]}.pdf`);
};