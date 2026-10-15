import React, { useState } from 'react';
import Header from '../components/Header';
import AddTransactionModal from '../components/AddTransactionModal';
import { useExpense } from '../context/ExpenseContext';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Transactions = ({ onMenuClick }) => {
  const { transactions, deleteTransaction } = useExpense();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
      <Header onMenuClick={onMenuClick} />
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <main className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Transactions</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Manage your income and expenses
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 md:px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
          >
            <Plus size={18} /> Add New
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {transactions.length === 0 ? (
            <div className="p-10 text-center text-gray-500 dark:text-gray-400 text-sm">
              No transactions yet. Tap "Add New" to create one.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {transactions.map((t) => (
                <li key={t.id} className="p-3 md:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <div className={`p-2.5 md:p-3 rounded-xl flex-shrink-0 ${
                      t.type === 'income'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                    }`}>
                      {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate text-sm md:text-base">{t.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{t.category} · {t.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-6 flex-shrink-0">
                    <span className={`font-bold text-sm md:text-base ${t.type === 'income' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="md:hidden text-center text-xs text-gray-400 dark:text-gray-500 mt-10 pt-6 pb-4 border-t border-gray-200 dark:border-gray-700">
          <p>2025 Expense Tracker - All rights reserved.</p>
          <p className="mt-2 font-extrabold text-gray-900 dark:text-white tracking-wide text-sm">
            Built by Tewachew Melaku
          </p>
        </div>
      </main>
    </div>
  );
};

export default Transactions;