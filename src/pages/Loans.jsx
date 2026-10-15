import React, { useState } from 'react';
import Header from '../components/Header';
import { useExpense } from '../context/ExpenseContext';
import { CreditCard, Plus, Trash2, Calendar, CheckCircle2, Wallet } from 'lucide-react';

const Loans = ({ onMenuClick }) => {
  const { loans, addLoan, deleteLoan, updateLoan } = useExpense();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', total: '', paid: '', emi: '', dueDate: ''
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.total) return;
    addLoan({
      name: form.name.trim(),
      total: Number(form.total),
      paid: Number(form.paid) || 0,
      emi: Number(form.emi) || 0,
      dueDate: form.dueDate || new Date().toISOString().split('T')[0]
    });
    setForm({ name: '', total: '', paid: '', emi: '', dueDate: '' });
    setShowForm(false);
  };

  const handlePayEMI = (loan) => {
    const newPaid = Math.min(loan.paid + loan.emi, loan.total);
    updateLoan(loan.id, { paid: newPaid });
  };

  const totalDebt = loans.reduce((s, l) => s + l.total, 0);
  const totalPaid = loans.reduce((s, l) => s + l.paid, 0);
  const totalRemaining = totalDebt - totalPaid;
  const monthlyCommitment = loans
    .filter(l => l.paid < l.total)
    .reduce((s, l) => s + l.emi, 0);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
      <Header onMenuClick={onMenuClick} />
      <main className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Loans</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Track your loans and EMI payments
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 md:px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
          >
            <Plus size={18} /> Add Loan
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs uppercase font-medium">Total Debt</p>
            <h3 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mt-1">
              ₹{totalDebt.toLocaleString()}
            </h3>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs uppercase font-medium">Total Paid</p>
            <h3 className="text-lg md:text-2xl font-bold text-green-600 mt-1">
              ₹{totalPaid.toLocaleString()}
            </h3>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs uppercase font-medium">Remaining</p>
            <h3 className="text-lg md:text-2xl font-bold text-red-500 mt-1">
              ₹{totalRemaining.toLocaleString()}
            </h3>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs uppercase font-medium">Monthly EMI</p>
            <h3 className="text-lg md:text-2xl font-bold text-indigo-600 mt-1">
              ₹{monthlyCommitment.toLocaleString()}
            </h3>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <input
              required
              type="text"
              placeholder="Loan name (e.g. Car Loan)"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="p-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              required
              type="number"
              placeholder="Total amount (₹)"
              value={form.total}
              onChange={e => setForm({ ...form, total: e.target.value })}
              className="p-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="number"
              placeholder="Amount already paid (₹) - optional"
              value={form.paid}
              onChange={e => setForm({ ...form, paid: e.target.value })}
              className="p-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="number"
              placeholder="Monthly EMI (₹)"
              value={form.emi}
              onChange={e => setForm({ ...form, emi: e.target.value })}
              className="p-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
              className="p-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none md:col-span-2"
            />
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
              <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium">
                Save Loan
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm({ name: '', total: '', paid: '', emi: '', dueDate: '' }); }}
                className="px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loans.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-10 md:p-12 text-center rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="inline-flex p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-4">
              <CreditCard size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No loans added</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tap "Add Loan" to start tracking your loans
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => {
              const percent = loan.total > 0 ? Math.min(Math.round((loan.paid / loan.total) * 100), 100) : 0;
              const paidOff = loan.paid >= loan.total;
              const emiCount = loan.emi > 0 ? Math.ceil((loan.total - loan.paid) / loan.emi) : 0;

              return (
                <div key={loan.id} className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2.5 md:p-3 rounded-xl flex-shrink-0 ${
                        paidOff
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                          : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600'
                      }`}>
                        {paidOff ? <CheckCircle2 size={20} /> : <CreditCard size={20} />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{loan.name}</h3>
                          {paidOff && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                              Paid off
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                          <Calendar size={12} /> Next EMI: {loan.dueDate}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteLoan(loan.id)}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4 text-xs md:text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs">Total</p>
                      <p className="font-semibold text-gray-900 dark:text-white">₹{loan.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs">Paid</p>
                      <p className="font-semibold text-green-600">₹{loan.paid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs">Remaining</p>
                      <p className="font-semibold text-red-500">₹{(loan.total - loan.paid).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${paidOff ? 'bg-green-500' : 'bg-indigo-600'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs gap-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      {percent}% paid {emiCount > 0 && `- ${emiCount} EMIs left`}
                    </span>
                    {!paidOff && loan.emi > 0 && (
                      <button
                        onClick={() => handlePayEMI(loan)}
                        className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Wallet size={12} /> Pay EMI ₹{loan.emi.toLocaleString()}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile footer */}
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

export default Loans;