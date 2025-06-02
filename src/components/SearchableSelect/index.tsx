import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Spinner } from '@/components/Spinner';

export interface SearchableSelectItem {
  id: string;
  name: string;
  description?: string;
}

export interface SearchableSelectProps {
  label: string;
  placeholder?: string;
  searchFunction: (
    search: string,
    page: number,
    limit: number
  ) => Promise<{
    data: SearchableSelectItem[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  onSelect: (item: SearchableSelectItem) => void;
  selectedItems?: string[];
  disabled?: boolean;
  maxHeight?: string;
  itemsPerPage?: number;
}

export function SearchableSelect({
  label,
  placeholder = 'Buscar...',
  searchFunction,
  onSelect,
  selectedItems = [],
  disabled = false,
  maxHeight = '200px',
  itemsPerPage = 50,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<SearchableSelectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const performSearch = async (
    search: string = searchTerm,
    page: number = 1,
    append: boolean = false
  ) => {
    if (!search.trim()) {
      setItems([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await searchFunction(search.trim(), page, itemsPerPage);

      if (append) {
        setItems((prev) => [...prev, ...result.data]);
      } else {
        setItems(result.data);
        setCurrentPage(result.page);
      }

      setTotalPages(result.totalPages);
      setTotal(result.total);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    performSearch(searchTerm, 1, false);
    setIsOpen(true);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      performSearch(searchTerm, nextPage, true);
      setCurrentPage(nextPage);
    }
  };

  const handleSelectItem = (item: SearchableSelectItem) => {
    onSelect(item);
    setIsOpen(false);
    setSearchTerm('');
    setItems([]);
    setHasSearched(false);
  };

  const filteredItems = items.filter((item) => !selectedItems.includes(item.id));

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            onFocus={() => {
              if (hasSearched && items.length > 0) {
                setIsOpen(true);
              }
            }}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleSearch}
          disabled={disabled || !searchTerm.trim() || isLoading}
          className="px-3"
        >
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </Button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg"
          style={{ maxHeight }}
        >
          <div className="overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 3rem)` }}>
            {isLoading && items.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Spinner size="sm" className="mx-auto mb-2" />
                <span>Buscando...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              hasSearched ? (
                <div className="p-4 text-center text-gray-500">
                  No se encontraron resultados para "{searchTerm}"
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Escribe un término y presiona buscar
                </div>
              )
            ) : (
              <>
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className="cursor-pointer border-b border-gray-100 p-3 last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.description && (
                      <div className="mt-1 text-sm text-gray-600">{item.description}</div>
                    )}
                  </div>
                ))}

                {/* Load more button */}
                {currentPage < totalPages && (
                  <div className="border-t border-gray-100 p-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="w-full"
                      size="sm"
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Cargando...
                        </>
                      ) : (
                        `Cargar más (${filteredItems.length} de ${total})`
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Results info */}
          {hasSearched && !isLoading && (
            <div className="border-t border-gray-100 bg-gray-50 p-2 text-center text-xs text-gray-600">
              {total > 0 ? `${filteredItems.length} de ${total} resultados` : 'No hay resultados'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
