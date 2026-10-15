import React from 'react';

const MobileFooter = () => {
  return (
    <div className="md:hidden mt-10 pt-6 pb-4 border-t border-gray-200 dark:border-gray-700 text-center">
      <p className="text-[11px] text-gray-400 dark:text-gray-500">
        2025 Expense Tracker - All rights reserved.
      </p>
      <p className="mt-2 font-extrabold text-gray-900 dark:text-white tracking-wide text-sm">
        Built by Tewachew Melaku
      </p>
    </div>
  );
};

export default MobileFooter;