"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  Tag,
  CheckCircle,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { formatCurrency } from '@/lib/utils/format';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useMounted } from '@/lib/hooks/use-mounted';

export default function CartPage() {
  const mounted = useMounted();
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    promoCode,
    promoDiscountPercent,
    applyPromoCode,
    removePromoCode,
    getTotals,
  } = useCartStore();

  const [inputCode, setInputCode] = useState('');

  const { subtotal, discount, shipping, tax, total } = getTotals();
  const freeShippingThreshold = 75;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromoCode(inputCode.trim());
      setInputCode('');
    }
  };

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-96 bg-muted animate-pulse rounded-2xl" />
          <div className="lg:col-span-4 h-64 bg-muted animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full flex flex-col items-center">
        <EmptyState
          icon={ShoppingBag}
          title="Your shopping cart is empty"
          description="You haven't added any items to your shopping cart yet. Discover our top collections, trending deals, and bestsellers!"
          actionLabel="Explore Catalog"
          actionHref="/products"
          className="max-w-md w-full"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Shopping Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
          </h1>
          <p className="text-sm text-muted-foreground">
            Review your selected products, apply promotional coupons, and proceed to checkout.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-xs text-muted-foreground hover:text-destructive self-start sm:self-auto"
        >
          Clear Cart
        </Button>
      </div>

      {/* Main Grid: Items Table (8 cols) + Order Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Free Shipping Alert Bar */}
          <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <Truck className="size-5 text-emerald-500 shrink-0" />
              <div>
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Add <strong className="text-foreground font-semibold">{formatCurrency(remainingForFreeShipping)}</strong> more to unlock <strong className="text-emerald-600 dark:text-emerald-400">FREE shipping</strong>.
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="size-3.5 inline" /> You unlocked FREE standard shipping!
                  </span>
                )}
              </div>
            </div>
            <span className="font-mono text-muted-foreground hidden sm:inline">Orders $75+</span>
          </div>

          {/* Items Container */}
          <div className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden shadow-2xs">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Image + Title */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Link
                    href={`/products/${item.productId}`}
                    className="relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-lg bg-muted/30 border border-border"
                  >
                    <Image
                      src={item.product.thumbnail || item.product.images?.[0] || '/placeholder.png'}
                      alt={item.product.title}
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                    />
                  </Link>

                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-muted-foreground capitalize">
                      {item.product.category.replace('-', ' ')}
                    </span>
                    <Link
                      href={`/products/${item.productId}`}
                      className="text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.product.title}
                    </Link>

                    {(item.selectedColor || item.selectedSize) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {[item.selectedColor, item.selectedSize].filter(Boolean).join(' • ')}
                      </p>
                    )}

                    <span className="text-xs font-bold text-foreground sm:hidden mt-2">
                      {formatCurrency(item.unitPrice)} each
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                  {/* Quantity Controller */}
                  <div className="flex items-center rounded-lg border border-border bg-background shadow-2xs">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="flex flex-col text-right min-w-[80px]">
                    <span className="text-base font-bold text-foreground">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[11px] text-muted-foreground">
                        {formatCurrency(item.unitPrice)} ea
                      </span>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    aria-label={`Remove ${item.product.title}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/products"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Tag className="size-3.5" />
                Promo Code
              </label>

              {promoCode ? (
                <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 text-xs text-emerald-700 dark:text-emerald-400">
                  <span className="font-semibold flex items-center gap-1.5">
                    <CheckCircle className="size-4" />
                    Code {promoCode} ({promoDiscountPercent}% OFF)
                  </span>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="font-bold hover:underline text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <Input
                    placeholder="Try SAVE10 or SAVE20"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="text-xs h-9 uppercase"
                  />
                  <Button type="submit" size="sm" variant="outline" className="h-9 px-3 text-xs">
                    Apply
                  </Button>
                </form>
              )}
            </div>

            <Separator />

            {/* Price Line Items */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Coupon Discount ({promoDiscountPercent}%)</span>
                  <span className="font-medium">-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Shipping</span>
                <span className="font-medium text-foreground">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Sales Tax (8%)</span>
                <span className="font-medium text-foreground">{formatCurrency(tax)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-base font-extrabold text-foreground pt-1">
                <span>Grand Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <Button
              size="lg"
              onClick={() => router.push('/checkout')}
              className="w-full h-12 text-sm font-bold gap-2 rounded-xl shadow-xs"
            >
              Proceed to Checkout
              <ArrowRight className="size-4" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="size-4 text-primary" />
              <span>Safe & Secure 256-bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
