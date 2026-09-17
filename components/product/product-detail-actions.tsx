"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Minus, Plus, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { Button } from '@/components/ui/button';
import { flyToCart } from '@/lib/utils/fly-to-cart';
import { useMounted } from '@/lib/hooks/use-mounted';

interface ProductDetailActionsProps {
  product: Product;
}

const DEFAULT_COLORS = [
  { name: 'Midnight', value: '#1e293b' },
  { name: 'Silver', value: '#e2e8f0' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Emerald', value: '#10b981' },
];

const DEFAULT_SIZES = ['Standard', 'Compact', 'Pro'];

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const router = useRouter();
  const mounted = useMounted();
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const isFavorited = mounted && isInWishlist;

  const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_COLORS[0].name);
  const [selectedSize, setSelectedSize] = useState<string>(DEFAULT_SIZES[0]);
  const [quantity, setQuantity] = useState<number>(1);

  const isOutOfStock = product.stock <= 0;
  const maxStock = Math.min(product.stock || 10, 10);

  const handleAddToCart = (e: React.MouseEvent<HTMLElement>) => {
    if (isOutOfStock) return;
    flyToCart(e.currentTarget, product.thumbnail || product.images?.[0]);
    addItem(product, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedColor, selectedSize);
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col gap-6 pt-4 border-t border-border/80">
      {/* 1. Color Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>Color: <strong className="text-foreground font-semibold">{selectedColor}</strong></span>
        </label>
        <div className="flex items-center gap-2.5">
          {DEFAULT_COLORS.map((c) => {
            const isSelected = selectedColor === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c.name)}
                className={`relative size-8 rounded-full border-2 transition-transform ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/30 scale-110'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
                aria-label={`Select color ${c.name}`}
              >
                {isSelected && (
                  <Check
                    className={`absolute inset-0 m-auto size-3.5 ${
                      c.name === 'Silver' ? 'text-black' : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Size / Variant Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>Variant: <strong className="text-foreground font-semibold">{selectedSize}</strong></span>
        </label>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SIZES.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                    : 'border-border bg-card text-foreground hover:bg-muted'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Quantity Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border border-border bg-background shadow-2xs">
            <button
              type="button"
              disabled={quantity <= 1 || isOutOfStock}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex size-9 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-12 text-center text-sm font-semibold">
              {quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= maxStock || isOutOfStock}
              onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
              className="flex size-9 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          <span className="text-xs text-muted-foreground">
            {isOutOfStock ? (
              <span className="text-destructive font-semibold">Currently Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">Only {product.stock} units available</span>
            ) : (
              <span>In stock & ready to ship</span>
            )}
          </span>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
        {/* On mobile: Add to Cart + Wishlist side-by-side */}
        <div className="flex items-center gap-2.5 flex-1">
          <Button
            size="lg"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="flex-1 h-12 text-sm font-semibold gap-2 rounded-xl shadow-xs"
          >
            <ShoppingBag className="size-4" />
            Add to Cart
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => toggleWishlist(product)}
            suppressHydrationWarning
            className="size-12 shrink-0 rounded-xl p-0 sm:hidden border border-border"
            aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`size-5 transition-colors ${
                isFavorited
                  ? 'fill-destructive text-destructive'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            />
          </Button>
        </div>

        {/* Buy Now: Full width on mobile, flex-1 on desktop */}
        <Button
          size="lg"
          variant="secondary"
          disabled={isOutOfStock}
          onClick={handleBuyNow}
          className="w-full sm:flex-1 h-12 text-sm font-semibold rounded-xl border border-border/80"
        >
          Buy Now
        </Button>

        {/* Wishlist: Visible on desktop */}
        <Button
          size="lg"
          variant="outline"
          onClick={() => toggleWishlist(product)}
          suppressHydrationWarning
          className="size-12 shrink-0 rounded-xl p-0 hidden sm:flex items-center justify-center border border-border"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`size-5 transition-colors ${
              isFavorited
                ? 'fill-destructive text-destructive'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          />
        </Button>
      </div>
    </div>
  );
}
