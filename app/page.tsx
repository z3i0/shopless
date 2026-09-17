import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Tag, Flame, Shield, TrendingUp, Compass } from 'lucide-react';
import { getFeaturedProducts, getNewArrivals, getBestSellers } from '@/lib/api/products';
import { getCategories, getCategoryImage } from '@/lib/api/categories';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PromoBanner } from '@/components/home/promo-banner';

export const revalidate = 300; // 5 min revalidation for homepage

export default async function HomePage() {
  // Fetch real data from DummyJSON concurrently
  const [featuredProducts, newArrivals, bestSellers, categories] = await Promise.all([
    getFeaturedProducts(8).catch(() => []),
    getNewArrivals(4).catch(() => []),
    getBestSellers(4).catch(() => []),
    getCategories().catch(() => []),
  ]);

  // Featured 6 categories for homepage showcase
  const topCategories = categories.slice(0, 6);

  return (
    <div className="flex flex-col gap-12 sm:gap-16 lg:gap-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 via-background to-background pt-8 pb-12 sm:pt-12 sm:pb-16 lg:py-20 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-4 sm:space-y-6 text-left">

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                Shop without limits, live with <span className="bg-gradient-to-r from-primary via-neutral-600 to-primary bg-clip-text text-transparent dark:from-white dark:via-neutral-400 dark:to-white">purpose.</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
                Discover exceptional electronics, trending fashion, beauty essentials, and home decor. Fast delivery, hassle-free returns, and verified customer reviews.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/products">
                  <Button size="lg" className="h-11 px-6 rounded-xl font-semibold gap-2 shadow-sm">
                    Explore Catalog
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>

                <Link href="/products?sort=discount">
                  <Button variant="outline" size="lg" className="h-11 px-6 rounded-xl font-semibold gap-2">
                    <Flame className="size-4 text-destructive" />
                    Special Deals
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-muted-foreground border-t border-border/60 w-full">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-primary" />
                  <span>100% Authentic Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-emerald-500" />
                  <span>Free shipping over $75</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="size-4 text-primary" />
                  <span>Use code SAVE20 for 20% off</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visuals */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto aspect-4/3 sm:aspect-square max-w-md lg:max-w-none rounded-2xl overflow-hidden bg-gradient-to-tr from-muted/80 to-muted/20 border border-border/80 shadow-lg p-6 flex flex-col justify-between">
                <div className="absolute -top-12 -right-12 size-48 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative z-10 flex justify-between items-start">
                  <Badge className="bg-background/90 text-foreground backdrop-blur-xs font-semibold px-2.5 py-1">
                    Featured Collection
                  </Badge>
                  <span className="text-xs font-medium text-muted-foreground bg-muted/70 px-2 py-0.5 rounded">
                    Spring 2026
                  </span>
                </div>

                <div className="relative z-10 my-auto py-4 flex items-center justify-center">
                  <Image
                    src="https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20AirPods%20Max%20Silver/1.png"
                    alt="Hero Product"
                    width={320}
                    height={320}
                    priority
                    className="object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="relative z-10 flex items-center justify-between rounded-xl bg-background/90 backdrop-blur-md p-3 border border-border/80 shadow-xs">
                  <div>
                    <h3 className="text-xs font-bold text-foreground">Apple AirPods Max</h3>
                    <p className="text-[11px] text-muted-foreground">High-fidelity active audio</p>
                  </div>
                  <Link href="/products/101">
                    <Button size="sm" variant="secondary" className="h-7 text-xs px-2.5 rounded-lg">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Browse By Department</span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1">
              Popular Categories
            </h2>
          </div>
          <Link href="/categories" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            All 20+ Categories
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {topCategories.map((cat) => {
            const imageUrl = getCategoryImage(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group relative flex flex-col items-center overflow-hidden rounded-xl border border-border bg-card p-3 text-center transition-all duration-200 hover:shadow-md hover:border-primary/40"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted mb-3">
                  <Image
                    src={imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors capitalize">
                  {cat.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Hand-Picked Quality</span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1">
              Featured Products
            </h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            View All Products
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL BANNER */}
      <PromoBanner dealProducts={bestSellers} />

      {/* 5. NEW ARRIVALS & BEST SELLERS SECTIONS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* New Arrivals */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Compass className="size-5 text-primary" />
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  New Arrivals
                </h3>
              </div>
              <Link href="/products?sort=id-desc" className="text-xs font-semibold text-primary hover:underline">
                See More
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Best Sellers */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Flame className="size-5 text-destructive" />
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  Best Sellers
                </h3>
              </div>
              <Link href="/products?sort=price-desc" className="text-xs font-semibold text-primary hover:underline">
                See More
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
