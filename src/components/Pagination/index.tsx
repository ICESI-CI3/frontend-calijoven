'use client';

import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageNumbers?: boolean;
  maxPageNumbers?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showPageNumbers = true,
  maxPageNumbers = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Logic to show limited number of pages with ellipsis
    if (totalPages <= maxPageNumbers) {
      // If total pages is less than max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of page numbers to show
      let start = Math.max(2, currentPage - Math.floor(maxPageNumbers / 2));
      const end = Math.min(totalPages - 1, start + maxPageNumbers - 3);

      // Adjust start if end is at max
      if (end === totalPages - 1) {
        start = Math.max(2, end - (maxPageNumbers - 3));
      }

      // Add ellipsis if needed at the beginning
      if (start > 2) {
        pageNumbers.push('ellipsis-start');
      }

      // Add page numbers
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed at the end
      if (end < totalPages - 1) {
        pageNumbers.push('ellipsis-end');
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3',
        className
      )}
    >
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando página <span className="font-medium">{currentPage}</span> de{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex gap-3 -space-x-px rounded-md shadow-sm p-2"
            aria-label="Pagination"
          >
            {/* Previous page button */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'relative inline-flex',
                currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
              )}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Anterior</span>
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>

            {/* Page numbers */}
            {showPageNumbers && (
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => {
                  if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <Button
                      key={`page-${page}`}
                      variant={currentPage === page ? 'primary' : 'ghost'}
                      size="sm"
                      className={cn(
                        'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20',
                        currentPage === page ? 'z-10' : ''
                      )}
                      onClick={() => onPageChange(page as number)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Next page button */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'relative inline-flex',
                currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
              )}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Siguiente</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </div>

      {/* Mobile pagination (simpler) */}
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <span className="self-center text-sm">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
