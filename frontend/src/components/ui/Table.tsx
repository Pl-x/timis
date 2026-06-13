import React from 'react';

interface Column<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string) => void;
}

export function Table<T extends Record<string, unknown>>({ columns, data, onSort }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3 font-medium text-gray-700">
                <span className={col.sortable ? 'cursor-pointer select-none' : ''} onClick={() => col.sortable && onSort?.(col.key)}>
                  {col.header} {col.sortable && '↕'}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3">{col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
