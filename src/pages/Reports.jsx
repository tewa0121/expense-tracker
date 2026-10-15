import React from 'react';
import Header from '../components/Header';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import SpendingPieChart from '../components/SpendingPieChart';
import { exportTransactionsPdf } from '../utils/exportPdf';
import { TrendingUp, TrendingDown, Wallet, Percent, Download } from 'lucide-react';

const Reports = ({ onMenuClick }) => {
  const { stats, transactions } = useExpense();
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const savingsRate = stats.income > 0
    ? Math.round(((stats.income - stats.expenses) / stats.income) * 100)
    : 0;

  const handleExport = () => {
    if (transactions.length === 0) {
      addNotification({ title: 'Export failed', message: 'No transactions to export. Add some data first.', type: 'warning' });
      return;
    }
    exportTransactionsPdf(transactions, stats, user);
    addNotification({ title: 'PDF exported', message: `Report with ${transactions.length} transactions downloaded`, type: 'success' });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
      <Header onMenuClick={onMenuClick} />
      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Reports</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Detailed breakdown of your financial activity</p>
          </div>
          <button onClick={handleExport} disabled={transactions.length === 0} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 md:px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all">
            <Download size={18} /> Download PDF
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-green-500 mb-2"><TrendingUp size={16} /><span className="text-[10px] md:text-xs font-medium uppercase">Income</span></div>
            <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">₹{stats.income.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-red-500 mb-2"><TrendingDown size={16} /><span className="text-[10px] md:text-xs font-medium uppercase">Expenses</span></div>
            <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">₹{stats.expenses.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-indigo-500 mb-2"><Wallet size={16} /><span className="text-[10px] md:text-xs font-medium uppercase">Balance</span></div>
            <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">₹{stats.balance.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-purple-500 mb-2"><Percent size={16} /><span className="text-[10px] md:text-xs font-medium uppercase">Savings</span></div>
            <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{savingsRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          <IncomeExpenseChart data={stats.chartData} />
          <SpendingPieChart data={stats.categoryData} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 md:p-5 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">Recent Transactions ({transactions.length})</h3>
          </div>
          {transactions.length === 0 ? (
            <div className="p-10 text-center text-gray-400 dark:text-gray-500 text-sm">No transactions yet. Add some to see them here.</div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {transactions.slice(0, 5).map(t => (
                <li key={t.id} className="p-3 md:p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate text-sm md:text-base">{t.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{t.category} · {t.date}</p>
                  </div>
                  <span className={`font-bold text-sm md:text-base flex-shrink-0 ml-2 ${t.type === 'income' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="md:hidden text-center text-xs text-gray-400 dark:text-gray-500 mt-10 pt-6 pb-4 border-t border-gray-200 dark:border-gray-700">
          <p>2025 Expense Tracker - All rights reserved.</p>
          <p className="mt-2 font-extrabold text-gray-900 dark:text-white tracking-wide text-sm">Built by Tewachew Melaku</p>
        </div>
      </main>
    </div>
  );
};

export default Reports;