import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { getProductsByCategory } from '@/lib/api/products';
import { getCategories, getCategoryImage } from '@/lib/api/categories';
import { ProductCard } from '@/components/product/product-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} Products | Shopless`,
    description: `Discover best-selling ${name} items at Shopless. Free shipping on orders over $75.`,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const categoryName = slug.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const categoryImage = getCategoryImage(slug);

  const [productsRes, allCategories] = await Promise.all([
    getProductsByCategory(slug, { limit: 30 }).catch(() => ({ products: [] })),
    getCategories().catch(() => []),
  ]);

  const products: Product[] = productsRes.products || [];
  const quickCategories = allCategories.slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3.5" />
        <Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground font-medium capitalize">{categoryName}</span>
      </nav>

      {/* Modern Editorial Hero Banner (Shadcn eCommerce Template Style) */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 min-h-[220px] sm:min-h-[260px] flex flex-col justify-end p-6 sm:p-10 shadow-xs">
        {/* Full bleed atmospheric background photo */}
        <Image
          src={categoryImage}
          alt={categoryName}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover object-center brightness-[0.75] dark:brightness-[0.45] transition-transform duration-700 hover:scale-105"
        />

        {/* Seamless ambient gradient overlay ensuring high text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

        {/* Title and metadata */}
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-md text-xs font-semibold px-2.5 py-0.5 shadow-xs">
              Collection
            </Badge>
            <span className="text-xs font-medium text-foreground/90 bg-background/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-border/40">
              {products.length} Products
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-xs">
            {categoryName}
          </h1>
        </div>
      </div>

      {/* Quick Category Navigation Pills (Shadcn standard pattern) */}
      <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Link href="/products">
            <Badge
              variant="outline"
              className="px-3 py-1 text-xs font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer whitespace-nowrap"
            >
              All Products
            </Badge>
          </Link>
          {quickCategories.map((cat) => {
            const isActive = cat.slug === slug;
            return (
              <Link key={cat.slug} href={`/categories/${cat.slug}`}>
                <Badge
                  variant={isActive ? "default" : "outline"}
                  className={`px-3 py-1 text-xs capitalize cursor-pointer transition-colors whitespace-nowrap ${
                    isActive
                      ? "shadow-xs font-semibold"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </Badge>
              </Link>
            );
          })}
        </div>

        <span className="text-xs text-muted-foreground whitespace-nowrap hidden md:inline">
          Showing {products.length} items
        </span>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No products found in this category"
          description={`We currently don't have any items listed under ${categoryName}. Check back soon or explore other departments.`}
          actionLabel="Browse Other Categories"
          actionHref="/categories"
          className="my-8"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
