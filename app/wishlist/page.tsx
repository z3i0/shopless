"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist-store';
import { useCartStore } from '@/store/cart-store';
import { ProductCard } from '@/components/product/product-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const handleMoveAllToCart = () => {
    if (items.length === 0) return;
    items.forEach((product) => {
      if (product.stock > 0) {
        addItem(product, 1);
      }
    });
    toast.success(`Moved ${items.length} items to your cart!`);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full flex flex-col items-center">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="You haven't saved any products to your wishlist yet. Tap the heart icon on any product to save items for later."
          actionLabel="Explore Catalog"
          actionHref="/products"
          className="max-w-md w-full"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Heart className="size-6 text-destructive fill-destructive" />
            My Wishlist ({items.length})
          </h1>
          <p className="text-sm text-muted-foreground">
            Saved items remain synced across your browsing session.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={handleMoveAllToCart}
            className="gap-2 text-xs font-semibold"
          >
            <ShoppingBag className="size-3.5" />
            Move All to Cart
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={clearWishlist}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
