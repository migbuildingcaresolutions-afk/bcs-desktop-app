import React from 'react';

const Textarea = ({ label, className = '', rows = 4, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        rows={rows}
        {...props}
        className={`border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
      />
    </div>
  );
};

export default Textarea;
