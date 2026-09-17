"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  ShoppingBag,
  Heart,
  User,
  Package,
  LogOut,
  LogIn,
  LayoutGrid,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useMounted } from '@/lib/hooks/use-mounted';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';

export function MobileNav() {
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setOpen(false);
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push('/');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden size-9" aria-label="Open mobile menu" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 sm:w-80 flex-col p-0">
        <SheetHeader className="p-4 border-b border-border text-left">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-extrabold text-base">
              S
            </div>
            <span>Shopless</span>
          </SheetTitle>
        </SheetHeader>

        {/* Mobile Search */}
        <div className="p-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 text-sm"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Submit search"
            >
              <Search className="size-4" />
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            <ShoppingBag className="size-4 text-muted-foreground" />
            All Products
          </Link>

          <Link
            href="/categories"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            <LayoutGrid className="size-4 text-muted-foreground" />
            Categories
          </Link>

          <Separator className="my-3" />

          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            <span className="flex items-center gap-3">
              <ShoppingBag className="size-4 text-muted-foreground" />
              My Cart
            </span>
            {mounted && cartItemCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>

          <Link
            href="/wishlist"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            <span className="flex items-center gap-3">
              <Heart className="size-4 text-muted-foreground" />
              Wishlist
            </span>
            {mounted && wishlistCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Separator className="my-3" />

          {mounted && isAuthenticated && user ? (
            <>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                <User className="size-4 text-muted-foreground" />
                Account Overview
              </Link>

              <Link
                href="/account/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                <Package className="size-4 text-muted-foreground" />
                Order History
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="size-4" />
                Sign Out ({user.firstName})
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <Link href="/login" onClick={() => setOpen(false)} className="block">
                <Button className="w-full justify-center gap-2">
                  <LogIn className="size-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} className="block">
                <Button variant="outline" className="w-full justify-center">
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
