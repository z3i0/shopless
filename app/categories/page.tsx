import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutGrid, ArrowRight } from 'lucide-react';
import { getCategories, getCategoryImage } from '@/lib/api/categories';

export const metadata: Metadata = {
  title: 'Categories | Shopless',
  description: 'Browse all shopping departments including electronics, beauty, groceries, fashion, and home.',
};

export default async function CategoriesPage() {
  const categories = await getCategories().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <LayoutGrid className="size-4" />
          <span>Departments</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Shop by Category
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Explore curated collections across all departments. From the latest smartphones to home decor and beauty essentials.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {categories.map((cat) => {
          const imageUrl = getCategoryImage(cat.slug);
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-300 hover:shadow-md hover:border-primary/50"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                <Image
                  src={imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-1">
                <h2 className="text-sm font-bold text-foreground capitalize group-hover:text-primary transition-colors">
                  {cat.name}
                </h2>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1 group-hover:translate-x-0.5 transition-transform">
                  Explore <ArrowRight className="size-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
