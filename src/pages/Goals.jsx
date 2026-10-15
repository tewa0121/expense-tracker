import React, { useState } from 'react';
import Header from '../components/Header';
import { useExpense } from '../context/ExpenseContext';
import { Trophy, Plus, Trash2 } from 'lucide-react';

const Goals = ({ onMenuClick }) => {
  const { goals, addGoal, deleteGoal } = useExpense();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', target: '', current: '', color: '#4f46e5' });

  const colors = ['#4f46e5', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.target) return;
    addGoal({
      name: form.name,
      target: Number(form.target),
      current: Number(form.current) || 0,
      color: form.color
    });
    setForm({ name: '', target: '', current: '', color: '#4f46e5' });
    setShowForm(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
      <Header onMenuClick={onMenuClick} />
      <main className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Goals</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Track your savings goals</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 md:px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
          >
            <Plus size={18} /> Add Goal
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <input
              required
              type="text"
              placeholder="Goal name (e.g. Emergency Fund)"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="p-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              required
              type="number"
              placeholder="Target amount (₹)"
              value={form.target}
              onChange={e => setForm({ ...form, target: e.target.value })}
              className="p-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="number"
              placeholder="Current savings (₹) - optional"
              value={form.current}
              onChange={e => setForm({ ...form, current: e.target.value })}
              className="p-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <div className="flex items-center gap-3 p-2.5">
              <span className="text-sm text-gray-600 dark:text-gray-300">Color:</span>
              <div className="flex gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, color: c })}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <button type="submit" className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium">
              Save Goal
            </button>
          </form>
        )}

        {goals.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-10 md:p-12 text-center rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="inline-flex p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-4">
              <Trophy size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No goals yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tap "Add Goal" to start tracking your savings targets
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {goals.map((g) => {
              const percent = g.target > 0 ? Math.min(Math.round((g.current / g.target) * 100), 100) : 0;
              return (
                <div key={g.id} className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `${g.color}20`, color: g.color }}>
                        <Trophy size={20} />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{g.name}</h3>
                    </div>
                    <button onClick={() => deleteGoal(g.id)} className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-300">₹{g.current.toLocaleString()}</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{g.target.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: g.color }} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {percent}% achieved · ₹{(g.target - g.current).toLocaleString()} to go
                  </p>
                </div>
              );
            })}
          </div>
        )}

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

export default Goals;