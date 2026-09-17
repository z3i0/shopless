"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { formatCurrency, getDiscountedPrice } from '@/lib/utils/format';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { ProductRating } from './product-rating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { flyToCart } from '@/lib/utils/fly-to-cart';
import { useMounted } from '@/lib/hooks/use-mounted';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const mounted = useMounted();
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const isFavorited = mounted && isInWishlist;

  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      flyToCart(e.currentTarget, product.thumbnail || product.images?.[0]);
      addItem(product, 1);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
      {/* Image Container */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square w-full overflow-hidden bg-muted/40 block"
      >
        <Image
          src={product.thumbnail || product.images?.[0] || '/placeholder.png'}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {hasDiscount && (
            <Badge className="bg-destructive text-destructive-foreground font-semibold px-2 py-0.5 text-xs shadow-xs">
              -{Math.round(product.discountPercentage)}%
            </Badge>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <Badge variant="outline" className="bg-background/90 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] px-1.5 py-0">
              Only {product.stock} left
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
              Out of stock
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          suppressHydrationWarning
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-xs text-foreground shadow-xs transition-colors hover:bg-background hover:scale-110 active:scale-95"
        >
          <Heart
            className={`size-4 transition-colors ${
              isFavorited
                ? 'fill-destructive text-destructive'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          />
        </button>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground capitalize truncate">
            {product.brand || product.category.replace('-', ' ')}
          </span>
          <ProductRating
            rating={product.rating}
            reviewsCount={product.reviews?.length}
            showCount={false}
            size="sm"
          />
        </div>

        <h3 className="text-sm font-semibold tracking-tight text-foreground line-clamp-2 min-h-[2.5rem] mb-2 hover:text-primary transition-colors">
          <Link href={`/products/${product.id}`}>
            {product.title}
          </Link>
        </h3>

        {/* Price & Action */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground">
              {formatCurrency(discountedPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="rounded-lg gap-1.5 text-xs h-8 px-2.5 hover:bg-primary hover:text-primary-foreground transition-all"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingBag className="size-3.5" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
