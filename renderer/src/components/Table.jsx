import React from 'react';
export const Table = ({ columns, data, onRowClick, onRowDoubleClick, loading, emptyMessage = 'No data available' }) => {
  if (loading) return <div className="flex justify-center items-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (!data || data.length === 0) return <div className="text-center p-8 text-gray-500 dark:text-gray-400">{emptyMessage}</div>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} onClick={() => onRowClick && onRowClick(row)} onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row)} className={`${(onRowClick || onRowDoubleClick) ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors' : ''}`}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{column.render ? column.render(row) : row[column.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
