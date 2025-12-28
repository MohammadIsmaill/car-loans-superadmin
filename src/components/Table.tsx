'use client';

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
}

export default function Table<T extends { id?: string | number; _id?: string | number }>({
  columns,
  data,
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
}: TableProps<T>) {
  const getValue = (item: T, key: keyof T | string): unknown => {
    if (typeof key === 'string' && key.includes('.')) {
      return key.split('.').reduce((obj, k) => (obj as Record<string, unknown>)?.[k], item as unknown);
    }
    return item[key as keyof T];
  };

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`py-3 sm:py-4 px-3 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-500 ${
                  column.sortable ? 'cursor-pointer hover:text-gray-700' : ''
                }`}
                onClick={() => column.sortable && onSort?.(String(column.key))}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  {column.sortable && (
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  )}
                  <span className="whitespace-nowrap">{column.label}</span>
                  {sortColumn === column.key && (
                    <span className="text-xs">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            <th className="py-3 sm:py-4 px-3 sm:px-4"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id || item._id || index}
              className={`border-b border-gray-100 ${
                onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
              }`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td key={String(column.key)} className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-900">
                  {column.render
                    ? column.render(item)
                    : String(getValue(item, column.key) ?? '')}
                </td>
              ))}
              <td className="py-3 sm:py-4 px-3 sm:px-4">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="6" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="18" r="2" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
