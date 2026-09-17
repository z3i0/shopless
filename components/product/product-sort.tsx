"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'featured';

  const handleSortChange = (value: string | null) => {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
        Sort by:
      </span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="h-9 w-[160px] text-xs">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="rating-desc">Highest Rated</SelectItem>
          <SelectItem value="id-desc">Newest Arrivals</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
