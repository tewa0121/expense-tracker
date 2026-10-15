import React from 'react';

const StatCard = ({ title, amount, percentage, icon: Icon, isPositive, iconBg }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</span>
        <div className={`p-2 rounded-lg ${iconBg || 'bg-indigo-50'} text-indigo-600 dark:text-indigo-400`}>
          <Icon size={20} />
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{amount}</h3>
        <p className={`text-sm mt-2 font-medium flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {percentage}
        </p>
      </div>
    </div>
  );
};

export default StatCard;