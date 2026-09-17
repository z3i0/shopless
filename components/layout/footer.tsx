"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PaymentBadges } from '@/components/ui/payment-icons';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Thank you for subscribing to the Shopless newsletter!');
  };

  return (
    <footer className="w-full border-t border-border bg-card text-card-foreground mt-auto">
      {/* Value Propositions Bar */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Truck className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Free Shipping</h4>
                <p className="text-xs text-muted-foreground">On all orders over $75</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Secure Checkout</h4>
                <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <RefreshCw className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Easy Returns</h4>
                <p className="text-xs text-muted-foreground">30-day hassle-free policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Headphones className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">24/7 Support</h4>
                <p className="text-xs text-muted-foreground">Dedicated customer care</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-extrabold text-base">
                S
              </div>
              <span className="font-bold text-xl tracking-tight">Shopless</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              A modern, high-performance storefront designed for seamless shopping experiences. Discover curated essentials, tech, fashion, and lifestyle items.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                Subscribe for 10% off your first order
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium py-2">
                  <CheckCircle className="size-4" />
                  You are subscribed! Check code SAVE10.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-xs h-9"
                    required
                  />
                  <Button type="submit" size="sm" className="h-9 px-4 text-xs font-medium">
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link href="/categories/smartphones" className="hover:text-foreground transition-colors">Smartphones</Link></li>
              <li><Link href="/categories/laptops" className="hover:text-foreground transition-colors">Laptops</Link></li>
              <li><Link href="/categories/beauty" className="hover:text-foreground transition-colors">Beauty & Care</Link></li>
              <li><Link href="/categories/fragrances" className="hover:text-foreground transition-colors">Fragrances</Link></li>
              <li><Link href="/products?sort=discount" className="hover:text-foreground transition-colors">Special Deals</Link></li>
            </ul>
          </div>

          {/* Account & Orders */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/account" className="hover:text-foreground transition-colors">My Account</Link></li>
              <li><Link href="/account/orders" className="hover:text-foreground transition-colors">Track Orders</Link></li>
              <li><Link href="/wishlist" className="hover:text-foreground transition-colors">Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-foreground transition-colors">Shopping Bag</Link></li>
              <li><Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Policies & Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
              <li><span className="cursor-default">Shipping Policy</span></li>
              <li><span className="cursor-default">Returns & Refunds</span></li>
              <li><span className="cursor-default">About Shopless</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Shopless Inc. Powered by DummyJSON API. All rights reserved.</p>
          <PaymentBadges />
        </div>
      </div>
    </footer>
  );
}
