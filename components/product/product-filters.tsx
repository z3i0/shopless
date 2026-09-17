"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, RotateCcw } from 'lucide-react';
import { CategoryItem } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

interface ProductFiltersProps {
  categories: CategoryItem[];
  currentCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
}

export function ProductFilters({
  categories,
  currentCategory,
  minPrice = 0,
  maxPrice = 2000,
  minRating = 0,
  inStockOnly = false,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const [selectedRating, setSelectedRating] = React.useState<number>(minRating);
  const [stockOnly, setStockOnly] = React.useState<boolean>(inStockOnly);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Always reset to page 1 on filter change
    params.delete('page');

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === undefined) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryClick = (slug: string) => {
    if (currentCategory === slug) {
      updateFilters({ category: null });
    } else {
      updateFilters({ category: slug });
    }
  };

  const handlePriceApply = () => {
    updateFilters({
      minPrice: priceRange[0] > 0 ? String(priceRange[0]) : null,
      maxPrice: priceRange[1] < 2000 ? String(priceRange[1]) : null,
    });
  };

  const handleRatingClick = (rating: number) => {
    if (selectedRating === rating) {
      setSelectedRating(0);
      updateFilters({ minRating: null });
    } else {
      setSelectedRating(rating);
      updateFilters({ minRating: String(rating) });
    }
  };

  const handleStockToggle = (checked: boolean) => {
    setStockOnly(checked);
    updateFilters({ inStock: checked ? 'true' : null });
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    const q = params.get('q');
    const newParams = new URLSearchParams();
    if (q) newParams.set('q', q);
    router.push(`/products${newParams.toString() ? `?${newParams.toString()}` : ''}`);
  };

  const hasActiveFilters =
    currentCategory ||
    minPrice > 0 ||
    maxPrice < 2000 ||
    minRating > 0 ||
    inStockOnly;

  return (
    <div className="flex flex-col gap-6 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <Filter className="size-4" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
          >
            <RotateCcw className="size-3" />
            Reset
          </Button>
        )}
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Department
        </h4>
        <div className="max-h-56 overflow-y-auto pr-1 space-y-1.5">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleCategoryClick(cat.slug)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-left transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <span className="capitalize">{cat.name}</span>
                {isSelected && <span className="text-[10px]">✕</span>}
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Price Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Price Range
          </h4>
          <span className="text-xs font-medium text-foreground">
            ${priceRange[0]} - ${priceRange[1] >= 2000 ? '2000+' : priceRange[1]}
          </span>
        </div>

        <Slider
          defaultValue={[minPrice, maxPrice]}
          value={priceRange}
          min={0}
          max={2000}
          step={20}
          onValueChange={(val) => {
            if (Array.isArray(val)) {
              setPriceRange([val[0], val[1]]);
            } else if (typeof val === 'number') {
              setPriceRange([0, val]);
            }
          }}
          className="py-2"
        />

        <Button
          size="sm"
          variant="outline"
          onClick={handlePriceApply}
          className="w-full text-xs h-7"
        >
          Apply Price
        </Button>
      </div>

      <Separator />

      {/* Minimum Rating */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Rating
        </h4>
        <div className="space-y-1">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRatingClick(r)}
              className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-left transition-colors ${
                selectedRating === r
                  ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <span>{r}★ & above</span>
              {selectedRating === r && <span className="text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Availability
        </h4>
        <div className="flex items-center space-x-2 pt-1">
          <Checkbox
            id="instock-only"
            checked={stockOnly}
            onCheckedChange={(checked) => handleStockToggle(Boolean(checked))}
          />
          <Label htmlFor="instock-only" className="text-xs font-normal cursor-pointer">
            In Stock items only
          </Label>
        </div>
      </div>
    </div>
  );
}
