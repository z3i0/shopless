"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight, ArrowLeft, Clock, CheckCircle, Truck, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AccountOrdersPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { isAuthenticated } = useAuthStore();
  const orders = useOrderStore((state) => state.orders);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login?redirect=/account/orders');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mb-8" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    if (selectedFilter === 'all') return true;
    return o.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Delivered</Badge>;
      case 'Shipped':
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Shipped</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Processing</Badge>;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          <Link href="/account" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="size-3.5" /> Back to Account
          </Link>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Order History ({orders.length})
        </h1>
        <p className="text-sm text-muted-foreground">
          Track packages, view past receipts, and monitor simulated shipments.
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="all" className="rounded-lg text-xs font-semibold">
            All ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="processing" className="rounded-lg text-xs font-semibold">
            Processing
          </TabsTrigger>
          <TabsTrigger value="shipped" className="rounded-lg text-xs font-semibold">
            Shipped
          </TabsTrigger>
          <TabsTrigger value="delivered" className="rounded-lg text-xs font-semibold">
            Delivered
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders found"
          description="You don't have any orders under this category. Start shopping to create your first order!"
          actionLabel="Browse Catalog"
          actionHref="/products"
          className="my-8"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-foreground">
                    {order.id}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <p className="text-xs text-muted-foreground">
                  Ordered on {formatDate(order.date)} • {order.items.length} unique item{order.items.length > 1 ? 's' : ''} • Estimated delivery {formatDate(order.estimatedDelivery)}
                </p>

                <p className="text-xs text-foreground font-medium truncate">
                  Ship to: {order.shippingAddress.fullName} ({order.shippingAddress.city}, {order.shippingAddress.state})
                </p>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/60">
                <div className="text-left sm:text-right">
                  <span className="text-xs text-muted-foreground block">Total Amount</span>
                  <span className="text-base font-bold text-foreground">
                    {formatCurrency(order.total)}
                  </span>
                </div>

                <Link href={`/account/orders/${order.id}`}>
                  <Button size="sm" className="gap-1.5 h-9 text-xs font-semibold">
                    View Details
                    <ChevronRight className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
