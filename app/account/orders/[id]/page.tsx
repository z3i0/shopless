"use client";

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  CreditCard,
  MapPin,
  Clock,
  ShieldCheck,
  Banknote,
} from 'lucide-react';
import { PaypalIcon, ApplePayIcon } from '@/components/ui/payment-icons';
import { useOrderStore } from '@/store/order-store';
import { useAuthStore } from '@/store/auth-store';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { CartItem } from '@/types/cart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { isAuthenticated } = useAuthStore();
  const getOrderById = useOrderStore((state) => state.getOrderById);
  const order = getOrderById(id);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && !order) {
      router.push(`/login?redirect=/account/orders/${id}`);
    }
  }, [mounted, isAuthenticated, order, router, id]);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mb-8" />
        <div className="h-96 bg-muted animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground mx-auto">
          <Package className="size-7" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Order Not Found</h1>
        <p className="text-sm text-muted-foreground">
          We could not locate an order matching ID &ldquo;{id}&rdquo;.
        </p>
        <Link href={isAuthenticated ? "/account/orders" : "/products"}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="size-4" /> {isAuthenticated ? "Back to Orders" : "Browse Products"}
          </Button>
        </Link>
      </div>
    );
  }

  const isShipped = order.status === 'Shipped' || order.status === 'Delivered';
  const isDelivered = order.status === 'Delivered';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
      {/* Order Confirmed Banner */}
      <div className="flex items-start sm:items-center gap-3.5 p-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 text-xs shadow-2xs">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="size-5" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-foreground">Order Confirmed! Your purchase was successful.</p>
          <p className="text-muted-foreground mt-0.5">Order ID <strong className="text-foreground font-mono">{order.id}</strong> is received. Follow your real-time shipment progress below.</p>
        </div>
      </div>

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <Link href={isAuthenticated ? "/account/orders" : "/products"} className="hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="size-3.5" /> {isAuthenticated ? "Back to All Orders" : "Continue Shopping"}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
              {order.id}
            </h1>
            <Badge
              variant="outline"
              className={
                order.status === 'Delivered'
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  : order.status === 'Shipped'
                  ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                  : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
              }
            >
              {order.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Placed on {formatDate(order.date)} • Estimated delivery: {formatDate(order.estimatedDelivery)}
          </p>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xs">
        <h2 className="text-sm font-bold text-foreground mb-6">
          Shipment Progress
        </h2>

        <div className="relative flex flex-col sm:flex-row justify-between gap-6">
          {/* Milestone 1: Placed */}
          <div className="flex items-center sm:flex-col sm:items-start gap-3 relative z-10">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-xs">
              <CheckCircle className="size-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">Order Placed</span>
              <span className="text-[11px] text-muted-foreground">{formatDate(order.date)}</span>
            </div>
          </div>

          {/* Milestone 2: Processing */}
          <div className="flex items-center sm:flex-col sm:items-start gap-3 relative z-10">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-xs">
              <CheckCircle className="size-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">Processing & Packed</span>
              <span className="text-[11px] text-muted-foreground">Distribution Hub</span>
            </div>
          </div>

          {/* Milestone 3: Shipped */}
          <div className="flex items-center sm:flex-col sm:items-start gap-3 relative z-10">
            <div
              className={`flex size-10 items-center justify-center rounded-full text-xs font-bold shadow-xs ${
                isShipped
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground border border-border'
              }`}
            >
              <Truck className="size-5" />
            </div>
            <div>
              <span className={`text-xs font-bold block ${isShipped ? 'text-foreground' : 'text-muted-foreground'}`}>
                In Transit
              </span>
              <span className="text-[11px] text-muted-foreground">Carrier Delivery Network</span>
            </div>
          </div>

          {/* Milestone 4: Delivered */}
          <div className="flex items-center sm:flex-col sm:items-start gap-3 relative z-10">
            <div
              className={`flex size-10 items-center justify-center rounded-full text-xs font-bold shadow-xs ${
                isDelivered
                  ? 'bg-emerald-600 text-white'
                  : 'bg-muted text-muted-foreground border border-border'
              }`}
            >
              <Package className="size-5" />
            </div>
            <div>
              <span className={`text-xs font-bold block ${isDelivered ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                Delivered
              </span>
              <span className="text-[11px] text-muted-foreground">{formatDate(order.estimatedDelivery)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Products List (8 cols) + Addresses & Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Products List */}
        <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-foreground">
            Items in this Order ({order.items.length})
          </h2>

          <div className="divide-y divide-border/60">
            {order.items.map((item: CartItem) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative size-18 shrink-0 overflow-hidden rounded-lg bg-muted/40 border border-border">
                    <Image
                      src={item.product.thumbnail || item.product.images?.[0] || '/placeholder.png'}
                      alt={item.product.title}
                      fill
                      sizes="72px"
                      className="object-contain p-1.5"
                    />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.title}
                    </Link>
                    {(item.selectedColor || item.selectedSize) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {[item.selectedColor, item.selectedSize].filter(Boolean).join(' • ')}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </div>

                <span className="text-sm font-bold text-foreground">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping, Payment & Price Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          {/* Shipping Address & Method */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              Delivery Destination
            </h3>
            <div className="space-y-1 text-muted-foreground">
              <p className="font-semibold text-foreground">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address} {order.shippingAddress.apartment}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-2 text-foreground">Phone: {order.shippingAddress.phone}</p>
              <p className="text-foreground capitalize">Method: {order.shippingAddress.deliveryMethod} shipping</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              {order.payment.paymentMethod === 'paypal' ? (
                <PaypalIcon className="h-4 w-auto" />
              ) : order.payment.paymentMethod === 'apple-pay' ? (
                <ApplePayIcon className="h-4 w-auto" />
              ) : order.payment.paymentMethod === 'cash-on-delivery' ? (
                <Banknote className="size-4 text-primary" />
              ) : (
                <CreditCard className="size-4 text-primary" />
              )}
              Payment Information
            </h3>
            <div className="space-y-1 text-muted-foreground">
              {order.payment.paymentMethod === 'paypal' ? (
                <>
                  <p className="font-semibold text-foreground">PayPal</p>
                  <p className="font-mono">{order.payment.paypalEmail || order.shippingAddress.email}</p>
                  <Badge variant="secondary" className="mt-2 text-[10px]">
                    PayPal Express
                  </Badge>
                </>
              ) : order.payment.paymentMethod === 'apple-pay' ? (
                <>
                  <p className="font-semibold text-foreground">Apple Pay</p>
                  <p className="font-mono">Device Authorization</p>
                  <Badge variant="secondary" className="mt-2 text-[10px]">
                    Biometric Verified
                  </Badge>
                </>
              ) : order.payment.paymentMethod === 'cash-on-delivery' ? (
                <>
                  <p className="font-semibold text-foreground">Cash on Delivery (COD)</p>
                  <p>Pay upon package receipt</p>
                  <Badge variant="outline" className="mt-2 text-[10px]">
                    Pending Courier Collection
                  </Badge>
                </>
              ) : (
                <>
                  <p className="font-semibold text-foreground">{order.payment.cardholderName || 'Card Payment'}</p>
                  <p className="font-mono">{order.payment.cardNumberMasked || '•••• 4242'}</p>
                  <Badge variant="secondary" className="mt-2 text-[10px]">
                    Card Authorized
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-foreground">
              Payment Breakdown
            </h3>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(order.subtotal)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span className="font-medium">-{formatCurrency(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-foreground">
                  {order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium text-foreground">{formatCurrency(order.tax)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-sm font-bold text-foreground pt-1">
                <span>Total Paid</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
