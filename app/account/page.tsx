"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  Heart,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  LogOut,
  ChevronRight,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { useCartStore } from '@/store/cart-store';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function AccountPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { user, isAuthenticated, logout } = useAuthStore();
  const orders = useOrderStore((state) => state.orders);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const cartCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-muted animate-pulse rounded-2xl" />
          <div className="h-64 md:col-span-2 bg-muted animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  const recentOrders = orders.slice(0, 3);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

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
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Account Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile, tracked shipments, saved addresses, and wishlist.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2 text-xs text-destructive hover:bg-destructive/10 self-start sm:self-auto"
        >
          <LogOut className="size-3.5" />
          Sign Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link
          href="/account/orders"
          className="rounded-2xl border border-border bg-card p-5 shadow-2xs hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Orders</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground">{orders.length}</p>
          <span className="text-xs text-primary font-semibold flex items-center gap-1 mt-2 group-hover:underline">
            View orders <ChevronRight className="size-3" />
          </span>
        </Link>

        <Link
          href="/wishlist"
          className="rounded-2xl border border-border bg-card p-5 shadow-2xs hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Wishlist</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <Heart className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground">{wishlistCount}</p>
          <span className="text-xs text-primary font-semibold flex items-center gap-1 mt-2 group-hover:underline">
            View wishlist <ChevronRight className="size-3" />
          </span>
        </Link>

        <Link
          href="/cart"
          className="rounded-2xl border border-border bg-card p-5 shadow-2xs hover:shadow-sm transition-all group col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cart Items</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShoppingBag className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground">{cartCount}</p>
          <span className="text-xs text-primary font-semibold flex items-center gap-1 mt-2 group-hover:underline">
            Go to checkout <ChevronRight className="size-3" />
          </span>
        </Link>
      </div>

      {/* Main Grid: User Profile (4 cols) + Recent Orders (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* User Card */}
        <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 border-2 border-primary/20">
              <AvatarImage src={user.image} alt={user.firstName} />
              <AvatarFallback className="text-lg font-bold">
                {user.firstName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-xs text-muted-foreground font-mono">@{user.username}</p>
              <Badge variant="secondary" className="mt-1 text-[10px]">
                Verified Member
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="size-4 text-primary shrink-0" />
              <span className="text-foreground truncate">{user.email}</span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="size-4 text-primary shrink-0" />
              <span className="text-foreground">{user.phone || '+1 (555) 019-2834'}</span>
            </div>

            <div className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
              <span className="text-foreground">
                {user.address?.address || '626 Main Street'}, {user.address?.city || 'Phoenix'},{' '}
                {user.address?.state || 'Mississippi'} {user.address?.postalCode || '29112'}, United States
              </span>
            </div>
          </div>

          <Separator />

          <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
            <span>Authenticated with DummyJSON API session.</span>
          </div>
        </div>

        {/* Recent Orders Card */}
        <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Recent Orders
              </h2>
              <p className="text-xs text-muted-foreground">
                Your latest purchases and shipment milestones.
              </p>
            </div>
            <Link
              href="/account/orders"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View All Orders
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No orders placed yet.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground">{ord.id}</span>
                      {getStatusBadge(ord.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Placed on {formatDate(ord.date)} • {ord.items.length} item{ord.items.length > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-sm font-bold text-foreground">
                      {formatCurrency(ord.total)}
                    </span>
                    <Link href={`/account/orders/${ord.id}`}>
                      <Button size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1">
                        Details <ChevronRight className="size-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
