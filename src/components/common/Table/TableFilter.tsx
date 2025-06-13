import React from 'react';
import { Search, X } from 'lucide-react';
import { Column } from './DataTable';

interface TableFilterProps<T> {
  columns: Column<T>[];
  filters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
}

const TableFilter = <T extends Record<string, any>>({
  columns,
  filters,
  onFilterChange,
}: TableFilterProps<T>) => {
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    onFilterChange(newFilters);
  };

  const clearFilter = (key: string) => {
    handleFilterChange(key, '');
  };

  const filterableColumns = columns.filter(col => col.filterable);

  if (filterableColumns.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterableColumns.map((column) => (
          <div key={column.key as string} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {column.header}
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters[column.key as string] || ''}
                onChange={(e) => handleFilterChange(column.key as string, e.target.value)}
                placeholder={`Filter by ${column.header}`}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {filters[column.key as string] ? (
                  <button
                    onClick={() => clearFilter(column.key as string)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <Search className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {Object.keys(filters).length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {Object.keys(filters).length} filter{Object.keys(filters).length > 1 ? 's' : ''} applied
          </span>
          <button
            onClick={() => onFilterChange({})}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(TableFilter) as typeof TableFilter;