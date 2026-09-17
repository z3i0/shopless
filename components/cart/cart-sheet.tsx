"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { formatCurrency } from '@/lib/utils/format';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function CartSheet() {
  const router = useRouter();
  const {
    items,
    isOpen,
    setOpen,
    removeItem,
    updateQuantity,
    getTotals,
  } = useCartStore();

  const { subtotal } = getTotals();
  const freeShippingThreshold = 75;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    setOpen(false);
    router.push('/checkout');
  };

  const handleViewCart = () => {
    setOpen(false);
    router.push('/cart');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-border text-left">
          <SheetTitle className="flex items-center justify-between text-base font-semibold">
            <span className="flex items-center gap-2">
              <ShoppingBag className="size-5 text-primary" />
              Your Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </span>
          </SheetTitle>

          {/* Free Shipping Progress */}
          {items.length > 0 && (
            <div className="mt-2 text-xs">
              {remainingForFreeShipping > 0 ? (
                <p className="text-muted-foreground mb-1.5">
                  Add <span className="font-semibold text-foreground">{formatCurrency(remainingForFreeShipping)}</span> more for <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE shipping</span>!
                </p>
              ) : (
                <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-1.5 flex items-center gap-1">
                  🎉 You qualify for FREE shipping!
                </p>
              )}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}
        </SheetHeader>

        {/* Item List or Empty State */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
              <ShoppingBag className="size-8" />
            </div>
            <h4 className="text-base font-semibold mb-1">Your cart is empty</h4>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Looks like you have not added anything to your cart yet. Explore our top products!
            </p>
            <Button
              onClick={() => {
                setOpen(false);
                router.push('/products');
              }}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border/60">
            {items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-center">
                {/* Thumbnail */}
                <Link
                  href={`/products/${item.productId}`}
                  onClick={() => setOpen(false)}
                  className="relative size-18 shrink-0 overflow-hidden rounded-lg bg-muted/50 border border-border"
                >
                  <Image
                    src={item.product.thumbnail || item.product.images?.[0] || '/placeholder.png'}
                    alt={item.product.title}
                    fill
                    sizes="72px"
                    className="object-contain p-1.5"
                  />
                </Link>

                {/* Info & Quantity */}
                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.productId}`}
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      aria-label={`Remove ${item.product.title}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {(item.selectedColor || item.selectedSize) && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[item.selectedColor, item.selectedSize].filter(Boolean).join(' • ')}
                    </p>
                  )}

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-border bg-background">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-foreground">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <SheetFooter className="px-6 py-4 border-t border-border bg-card/60 flex flex-col gap-3 sm:flex-col">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-base font-bold text-foreground">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              Taxes and shipping calculated at checkout.
            </p>

            <div className="flex flex-col gap-2 w-full pt-1">
              <Button
                onClick={handleCheckout}
                className="w-full justify-center gap-2 h-11 text-sm font-semibold"
              >
                Checkout Now
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                onClick={handleViewCart}
                className="w-full justify-center h-10 text-xs"
              >
                View Full Cart
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
