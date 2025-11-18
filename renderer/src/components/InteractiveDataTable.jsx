import { useState, useMemo } from 'react';
import '../styles/InteractiveDataTable.css';

/**
 * Interactive Data Table Component
 * Features:
 * - Sorting (click column headers)
 * - Filtering by column
 * - Global search
 * - Pagination
 * - PDF export
 * - Print functionality
 * - CSV export
 * - Clickable rows
 */
export default function InteractiveDataTable({
  data = [],
  columns = [],
  enableSearch = false,
  enableFilter = false,
  enableExport = false,
  enablePrint = false,
  onRowClick,
  onRowDoubleClick,
  rowsPerPage = 10,
  exportFilename = 'export',
  emptyMessage = 'No data available',
  className = ''
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  // Filtering
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchTerm && enableSearch) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        columns.some(col => {
          if (col.searchable === false) return false;
          const value = row[col.key];
          return value?.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply column filters
    if (enableFilter) {
      Object.entries(filters).forEach(([key, filterValue]) => {
        if (filterValue) {
          filtered = filtered.filter(row =>
            row[key]?.toString().toLowerCase().includes(filterValue.toLowerCase())
          );
        }
      });
    }

    return filtered;
  }, [data, searchTerm, filters, columns, enableSearch, enableFilter]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Sorting handler
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter handler
  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = columns.filter(col => col.key !== 'actions').map(col => col.label);
    const csvData = sortedData.map(row =>
      columns
        .filter(col => col.key !== 'actions')
        .map(col => {
          const value = row[col.key];
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value || '';
        })
        .join(',')
    );

    const csv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportFilename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export to PDF
  const exportToPDF = () => {
    window.print();
  };

  // Print
  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    const tableHTML = generatePrintHTML();
    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const generatePrintHTML = () => {
    const headers = columns.filter(col => col.key !== 'actions').map(col => col.label);
    const rows = sortedData.map(row =>
      columns
        .filter(col => col.key !== 'actions')
        .map(col => row[col.key] || '')
    );

    return `
      <html>
        <head>
          <title>Print ${exportFilename}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4CAF50; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>${exportFilename}</h2>
          <table>
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  // Get filter options for a column
  const getFilterOptions = (columnKey) => {
    const uniqueValues = [...new Set(data.map(row => row[columnKey]))].filter(Boolean);
    return uniqueValues.sort();
  };

  if (data.length === 0) {
    return (
      <div className="interactive-table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`interactive-table-container ${className}`}>
      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          {enableSearch && (
            <input
              type="text"
              className="table-search"
              placeholder="🔍 Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          )}
          <span className="table-count">
            Showing {paginatedData.length} of {sortedData.length} rows
          </span>
        </div>

        <div className="toolbar-right">
          {enableExport && (
            <>
              <button className="btn-icon-text" onClick={exportToCSV} title="Export to CSV">
                📊 CSV
              </button>
              <button className="btn-icon-text" onClick={exportToPDF} title="Export to PDF">
                📄 PDF
              </button>
            </>
          )}
          {enablePrint && (
            <button className="btn-icon-text" onClick={handlePrint} title="Print">
              🖨️ Print
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="interactive-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={column.sortable ? 'sortable' : ''}>
                  <div className="th-content">
                    <span
                      onClick={() => column.sortable && handleSort(column.key)}
                      className="column-label"
                    >
                      {column.label}
                      {sortConfig.key === column.key && (
                        <span className="sort-indicator">
                          {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </span>
                    {column.filterable && enableFilter && (
                      <select
                        className="column-filter"
                        onChange={(e) => handleFilter(column.key, e.target.value)}
                        value={filters[column.key] || ''}
                      >
                        <option value="">All</option>
                        {getFilterOptions(column.key).map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row)}
                className={(onRowClick || onRowDoubleClick) ? 'clickable' : ''}
              >
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="table-pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          <div className="pagination-pages">
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              // Show first, last, current, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="pagination-ellipsis">...</span>;
              }
              return null;
            })}
          </div>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
