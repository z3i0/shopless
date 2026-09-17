"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Search,
  User as UserIcon,
  LogOut,
  Package,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { ThemeToggle } from './theme-toggle';
import { MobileNav } from './mobile-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const { user, isAuthenticated, logout } = useAuthStore();
  const setCartOpen = useCartStore((state) => state.setOpen);
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Left: Mobile menu & Brand */}
        <div className="flex items-center gap-3">
          <MobileNav />

          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-lg tracking-wider shadow-xs">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">
                Shopless
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 ml-6 text-sm font-medium">
            <Link
              href="/products"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/categories"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Categories
            </Link>
          </nav>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              type="search"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-9 text-xs rounded-full bg-muted/50 focus-visible:bg-background"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {/* Wishlist */}
          <Link href="/wishlist">
            <Button
              variant="ghost"
              size="icon"
              className="relative size-9 rounded-full"
              aria-label="Wishlist"
            >
              <Heart className="size-4" />
              {isMounted && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart Drawer Trigger */}
          <Button
            id="nav-cart-button"
            variant="ghost"
            size="icon"
            onClick={() => setCartOpen(true)}
            className="relative size-9 rounded-full"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="size-4" />
            {isMounted && cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </Button>

          {/* User Profile / Auth */}
          {isMounted && isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="relative flex items-center gap-2 pl-2 pr-3 h-9 rounded-full hover:bg-muted"
                  />
                }
              >
                <Avatar className="size-7">
                  <AvatarImage src={user.image} alt={user.firstName} />
                  <AvatarFallback className="text-xs font-semibold">
                    {user.firstName[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline text-xs font-semibold max-w-[80px] truncate">
                  {user.firstName}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{user.firstName} {user.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/account')}>
                  <UserIcon className="mr-2 size-4" />
                  Account Overview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/account/orders')}>
                  <Package className="mr-2 size-4" />
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/wishlist')}>
                  <Heart className="mr-2 size-4" />
                  Wishlist ({wishlistCount})
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/login">
                <Button size="sm" variant="ghost" className="h-8 px-2.5 sm:px-3 text-xs">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:inline-block">
                <Button size="sm" className="h-8 px-3 text-xs">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
