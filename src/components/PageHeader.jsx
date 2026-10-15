import React from 'react';

/**
 * Sticky page header.
 * Usage:
 *   <PageHeader title="Dashboard" subtitle="..." action={<button>...</button>} />
 */
const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-100 dark:border-gray-800 -mx-4 px-4 md:-mx-8 md:px-8 py-4 md:py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1 text-xs md:text-sm truncate">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;