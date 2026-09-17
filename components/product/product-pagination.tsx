"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductPaginationProps {
  total: number;
  limit: number;
  currentPage: number;
}

export function ProductPagination({
  total,
  limit,
  currentPage,
}: ProductPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (totalPages <= 1) return null;

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    router.push(`/products?${params.toString()}`);
  };

  // Build page numbers window
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 py-6" aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        onClick={() => navigateToPage(currentPage - 1)}
        className="size-9 rounded-lg"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`dots-${idx}`} className="px-2 text-xs text-muted-foreground">
                ...
              </span>
            );
          }
          const isCurrent = p === currentPage;
          return (
            <Button
              key={`page-${p}`}
              variant={isCurrent ? 'default' : 'outline'}
              size="sm"
              onClick={() => navigateToPage(Number(p))}
              className={`size-9 rounded-lg text-xs font-semibold ${
                isCurrent ? 'pointer-events-none' : ''
              }`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {p}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        onClick={() => navigateToPage(currentPage + 1)}
        className="size-9 rounded-lg"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
