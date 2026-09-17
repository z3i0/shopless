"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useOrderStore } from '@/store/order-store';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-8942-X';
  const getOrderById = useOrderStore((state) => state.getOrderById);

  const order = getOrderById(orderId);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm text-center space-y-6">
        {/* Animated Checkmark */}
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 shadow-xs">
          <CheckCircle className="size-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Order Confirmed
          </span>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Thank you for your order!
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your simulated order has been placed and is now processing. A confirmation email has been dispatched.
          </p>
        </div>

        {/* Order Details Pill Card */}
        <div className="rounded-xl border border-border bg-muted/40 p-4 text-xs text-left grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-muted-foreground block mb-0.5">Order Number</span>
            <span className="font-mono font-bold text-foreground">{orderId}</span>
          </div>
          <div>
            <span className="text-muted-foreground block mb-0.5">Date</span>
            <span className="font-semibold text-foreground">
              {order ? formatDate(order.date) : formatDate(new Date())}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block mb-0.5">Estimated Delivery</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {order ? formatDate(order.estimatedDelivery) : 'In 3–5 Days'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block mb-0.5">Total Amount</span>
            <span className="font-bold text-foreground">
              {order ? formatCurrency(order.total) : '$0.00'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href={`/account/orders/${orderId}`}>
            <Button size="lg" className="w-full sm:w-auto h-11 px-6 font-semibold gap-2">
              <Package className="size-4" />
              View Order Details
            </Button>
          </Link>

          <Link href="/products">
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-11 px-6 font-semibold gap-2">
              <ShoppingBag className="size-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm">Loading confirmation...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
