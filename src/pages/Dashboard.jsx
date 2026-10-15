import React, { useState } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import SpendingPieChart from '../components/SpendingPieChart';
import AddTransactionModal from '../components/AddTransactionModal';
import { Wallet, TrendingUp, TrendingDown, Target, Plus } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';

const Dashboard = ({ onMenuClick }) => {
  const { stats } = useExpense();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
      <Header onMenuClick={onMenuClick} />
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <main className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              {user?.name ? `Welcome back, ${user.name.split(' ')[0]}! ` : ''}Here's your financial overview
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 md:px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
          >
            <Plus size={18} /> Add Transaction
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard title="Total Balance" amount={`₹${stats.balance.toLocaleString()}`} percentage="+12.5%" icon={Wallet} isPositive={true} iconBg="bg-indigo-50 dark:bg-indigo-900/30" />
          <StatCard title="Total Income" amount={`₹${stats.income.toLocaleString()}`} percentage="+8.2%" icon={TrendingUp} isPositive={true} iconBg="bg-indigo-50 dark:bg-indigo-900/30" />
          <StatCard title="Total Expenses" amount={`₹${stats.expenses.toLocaleString()}`} percentage="3.1%" icon={TrendingDown} isPositive={false} iconBg="bg-indigo-50 dark:bg-indigo-900/30" />
          <StatCard title="Budget Used" amount={`${Math.min(Math.round((stats.expenses / 10000) * 100), 100)}%`} percentage="5%" icon={Target} isPositive={false} iconBg="bg-indigo-50 dark:bg-indigo-900/30" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <IncomeExpenseChart data={stats.chartData} />
          <SpendingPieChart data={stats.categoryData} />
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

export default Dashboard;