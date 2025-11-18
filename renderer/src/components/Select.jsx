import React from 'react';

const Select = ({ label, className = '', children, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        {...props}
        className={`border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
