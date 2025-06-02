'use client';

import { Button } from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { ReactNode, useState } from 'react';
import { SearchInput } from '../SearchInput';

export type TableColumn<T> = {
  key: string;
  header: string;
  width?: string;
  flex?: number;
  align?: 'left' | 'center' | 'right';
  render?: (item: T, index: number) => ReactNode;
};

export type PaginationConfig = {
  enabled: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  pagination?: PaginationConfig;
  className?: string;
  search?: boolean;
  onSearch?: (value: string) => void;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No hay datos para mostrar',
  pagination,
  className = '',
  search = false,
  onSearch,
}: TableProps<T>) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={columns.length} className="px-6 py-10 text-center">
            <div className="flex justify-center">
              <Spinner size="lg" />
            </div>
          </td>
        </tr>
      );
    }

    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length} className="px-6 py-10 text-center">
            <p className="text-lg text-gray-600">{emptyMessage}</p>
          </td>
        </tr>
      );
    }

    return data.map((item, index) => (
      <tr key={keyExtractor(item)} className="hover:bg-gray-50">
        {columns.map((column) => (
          <td
            key={column.key}
            className={`px-6 py-4 ${column.align ? `text-${column.align}` : 'text-center'}`}
          >
            {column.render
              ? column.render(item, index)
              : (item as unknown as Record<string, unknown>)[column.key] != null
                ? String((item as unknown as Record<string, unknown>)[column.key])
                : ''}
          </td>
        ))}
      </tr>
    ));
  };

  const renderPagination = () => {
    if (!pagination || !pagination.enabled) return null;

    const { currentPage, totalPages, onPageChange } = pagination;

    return (
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`w-full overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}
    >
      {search && (
        <div className="flex items-center justify-between p-4">
          <SearchInput
            onChange={handleSearch}
            placeholder="Buscar por título o descripción..."
            className="w-full text-xs sm:text-sm"
            label="Buscar"
          />
        </div>
      )}

        <div className="w-full overflow-x-auto overflow-y-visible">
          <table className="w-full">
          <colgroup>
            {columns.map((column) => {
              // Calculate percentage width based on flex value if provided
              const flexPercentage = column.flex
                ? `${(column.flex / columns.reduce((sum, col) => sum + (col.flex || 0), 0)) * 100}%`
                : column.width;

              return (
                <col
                  key={column.key}
                  style={{
                    width: flexPercentage || 'auto',
                  }}
                />
              );
            })}
          </colgroup>
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                    column.align ? `text-${column.align}` : 'text-center'
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">{renderContent()}</tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
}
