import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

const AddTransactionModal = ({ isOpen, onClose }) => {
  const { addTransaction } = useExpense();
  const [formData, setFormData] = useState({
    title: '', amount: '', type: 'expense', category: 'Food', date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const amount = parseFloat(formData.amount);
    if (!formData.title.trim()) return setError('Please enter a title');
    if (!amount || amount <= 0) return setError('Please enter a valid amount');

    addTransaction({
      title: formData.title.trim(),
      amount,
      type: formData.type,
      category: formData.type === 'income' ? 'Others' : formData.category,
      date: formData.date
    });

    setFormData({ 
      title: '', amount: '', type: 'expense', category: 'Food',
      date: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24} /></button>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'expense'})}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                formData.type === 'expense' 
                  ? 'bg-white dark:bg-gray-800 text-red-600 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'income'})}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                formData.type === 'income' 
                  ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input 
              required 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full p-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder={formData.type === 'income' ? 'e.g. Freelance payment' : 'e.g. Groceries'} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₹)</label>
            <input 
              required 
              type="number" 
              step="0.01"
              min="0"
              value={formData.amount} 
              onChange={e => setFormData({...formData, amount: e.target.value})} 
              className="w-full p-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="0.00" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input 
              required 
              type="date" 
              value={formData.date} 
              onChange={e => setFormData({...formData, date: e.target.value})} 
              className="w-full p-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>

          {formData.type === 'expense' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                className="w-full p-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Food">Food</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
                <option value="Transport">Transport</option>
                <option value="Others">Others</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            className={`w-full text-white py-3 rounded-xl font-medium mt-4 transition-colors ${
              formData.type === 'income' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            Save {formData.type === 'income' ? 'Income' : 'Expense'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;