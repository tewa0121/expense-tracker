import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SpendingPieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-96 flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Spending by Category</h3>
      <div className="flex-1 w-full relative">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <p className="text-sm">No expenses yet</p>
            <p className="text-xs mt-1">Add an expense to see the breakdown</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={0} outerRadius={100} fill="#8884d8" paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Legend 
                layout="vertical" verticalAlign="middle" align="right" iconType="circle"
                formatter={(value, entry) => {
                  const percentage = Math.round((entry.payload.value / total) * 100);
                  return (
                    <span className="text-gray-600 dark:text-gray-300 text-sm ml-1">
                      {value} <span className="font-bold text-gray-900 dark:text-white">{percentage}%</span>
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SpendingPieChart;