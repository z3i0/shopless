import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Filter, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { getProducts, searchProducts, getProductsByCategory } from '@/lib/api/products';
import { getCategories } from '@/lib/api/categories';
import { ProductCard } from '@/components/product/product-card';
import { ProductGridSkeleton } from '@/components/product/product-card-skeleton';
import { ProductFilters } from '@/components/product/product-filters';
import { ProductSort } from '@/components/product/product-sort';
import { ProductPagination } from '@/components/product/product-pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export const metadata: Metadata = {
  title: 'All Products | Shopless',
  description: 'Browse our complete catalog of electronics, lifestyle, beauty, and fashion products.',
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const q = typeof params.q === 'string' ? params.q.trim() : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const sort = typeof params.sort === 'string' ? params.sort : 'featured';
  const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page, 10)) : 1;
  const minPrice = typeof params.minPrice === 'string' ? parseFloat(params.minPrice) : 0;
  const maxPrice = typeof params.maxPrice === 'string' ? parseFloat(params.maxPrice) : 2000;
  const minRating = typeof params.minRating === 'string' ? parseFloat(params.minRating) : 0;
  const inStockOnly = params.inStock === 'true';

  const limit = 12;
  const skip = (page - 1) * limit;

  // Determine sort parameters for DummyJSON API
  let sortBy: string | undefined;
  let order: 'asc' | 'desc' | undefined;

  if (sort === 'price-asc') {
    sortBy = 'price';
    order = 'asc';
  } else if (sort === 'price-desc') {
    sortBy = 'price';
    order = 'desc';
  } else if (sort === 'rating-desc') {
    sortBy = 'rating';
    order = 'desc';
  } else if (sort === 'id-desc') {
    sortBy = 'id';
    order = 'desc';
  } else if (sort === 'discount') {
    sortBy = 'discountPercentage';
    order = 'desc';
  }

  // Fetch categories for filter sidebar & product response
  const [categories, apiResponse] = await Promise.all([
    getCategories().catch(() => []),
    (async () => {
      try {
        if (q) {
          return await searchProducts(q, { limit, skip, sortBy, order });
        } else if (category) {
          return await getProductsByCategory(category, { limit, skip, sortBy, order });
        } else {
          return await getProducts({ limit, skip, sortBy, order });
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        return { products: [], total: 0, skip: 0, limit: 12 };
      }
    })(),
  ]);

  // Apply secondary client filters if set
  let displayedProducts = apiResponse.products;
  if (minPrice > 0 || maxPrice < 2000 || minRating > 0 || inStockOnly) {
    displayedProducts = displayedProducts.filter((p) => {
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (minRating > 0 && p.rating < minRating) return false;
      if (inStockOnly && p.stock <= 0) return false;
      return true;
    });
  }

  const total = apiResponse.total;
  const startItem = total > 0 ? skip + 1 : 0;
  const endItem = Math.min(skip + displayedProducts.length, total);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Page Title & Breadcrumb Area */}
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {q
            ? `Search results for "${q}"`
            : category
            ? `${category.replace('-', ' ').toUpperCase()} Products`
            : 'Explore All Products'}
        </h1>
        <p className="text-sm text-muted-foreground">
          Showing {startItem}-{endItem} of {total} items found
        </p>
      </div>

      {/* Main Layout: Filters Sidebar (Desktop) + Products (Center/Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-5 shadow-2xs">
            <ProductFilters
              categories={categories}
              currentCategory={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
              minRating={minRating}
              inStockOnly={inStockOnly}
            />
          </div>
        </aside>

        {/* Products Content Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Top Bar: Mobile Filter Sheet Trigger + Sort Select */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-3 shadow-2xs">
            {/* Mobile Filter Button with Sheet */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger render={<Button variant="outline" size="sm" className="gap-2 text-xs" />}>
                  <SlidersHorizontal className="size-3.5" />
                  Filters
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-6 overflow-y-auto">
                  <SheetHeader className="mb-4 text-left">
                    <SheetTitle className="text-base font-bold">Filters</SheetTitle>
                  </SheetHeader>
                  <ProductFilters
                    categories={categories}
                    currentCategory={category}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    minRating={minRating}
                    inStockOnly={inStockOnly}
                  />
                </SheetContent>
              </Sheet>
            </div>

            <div className="hidden lg:block text-xs text-muted-foreground">
              {total} products available
            </div>

            {/* Sort Dropdown */}
            <div className="ml-auto">
              <ProductSort />
            </div>
          </div>

          {/* Product Grid / Empty State */}
          {displayedProducts.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No products found"
              description="We couldn't find any products matching your current filters or search query. Try clearing your filters or searching for something else."
              actionLabel="View All Products"
              actionHref="/products"
              className="my-8"
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 sm:gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <ProductPagination
                total={total}
                limit={limit}
                currentPage={page}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
