import React from 'react';
import Header from '../components/Header';

const Placeholder = ({ title }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <Header />
      <main className="p-8 flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500">This page is under construction.</p>
        </div>
      </main>
    </div>
  );
};

export default Placeholder;