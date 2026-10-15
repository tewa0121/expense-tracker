import React, { useState } from 'react';
import Header from '../components/Header';
import { useExpense } from '../context/ExpenseContext';
import { Target, Edit2, Check, X } from 'lucide-react';

const categoryColors = {
  Food: '#4f46e5',
  Bills: '#8b5cf6',
  Shopping: '#f59e0b',
  Transport: '#22c55e',
  Others: '#ef4444'
};

const Budgets = ({ onMenuClick }) => {
  const { budgets, updateBudget, stats } = useExpense();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState('');

  const startEdit = (cat) => {
    setEditing(cat);
    setDraft(budgets[cat]);
  };

  const saveEdit = () => {
    if (draft && !isNaN(draft)) updateBudget(editing, draft);
    setEditing(null);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
      <Header onMenuClick={onMenuClick} />
      <main className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Budgets</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Set monthly limits per category and track usage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {Object.keys(budgets).map(cat => {
            const spent = stats.categories[cat] || 0;
            const limit = budgets[cat];
            const percent = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
            const over = spent > limit && limit > 0;

            return (
              <div key={cat} className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${categoryColors[cat]}20`, color: categoryColors[cat] }}>
                      <Target size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{cat}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Monthly budget</p>
                    </div>
                  </div>

                  {editing === cat ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button onClick={saveEdit} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setEditing(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">₹{spent.toLocaleString()} spent</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{limit.toLocaleString()}</span>
                </div>

                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : 'bg-indigo-600'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs">
                  <span className={over ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}>
                    {limit === 0 ? 'No limit set' : `${percent}% used`} {over && '· Over budget!'}
                  </span>
                  {limit > 0 && (
                    <span className="text-gray-400 dark:text-gray-500">
                      {over ? `₹${(spent - limit).toLocaleString()} over` : `₹${(limit - spent).toLocaleString()} left`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
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

export default Budgets;