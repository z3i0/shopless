"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Copy, Check, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Product } from '@/types/product';

interface PromoBannerProps {
  dealProducts?: Product[];
}

export function PromoBanner({ dealProducts }: PromoBannerProps = {}) {
  const [copied, setCopied] = useState(false);
  const promoCode = 'SAVE20';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    toast.success(`Coupon code ${promoCode} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-12 shadow-xs">
        {/* Subtle % watermark in the background using project tokens */}
        <Percent
          className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 size-48 sm:size-64 text-foreground/[0.04] dark:text-foreground/[0.06] pointer-events-none select-none"
          strokeWidth={1.5}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl space-y-4">
          <Badge
            variant="destructive"
            className="font-bold text-xs uppercase px-2.5 py-0.5 tracking-wider shadow-2xs"
          >
            Limited Time Promo
          </Badge>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            Get 20% Off Your Entire Cart with Code{' '}
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 font-mono text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary transition-all cursor-pointer"
              title="Click to copy code"
            >
              <span>{promoCode}</span>
              {copied ? (
                <Check className="size-4 text-emerald-600 dark:text-emerald-400 inline" />
              ) : (
                <Copy className="size-4 text-muted-foreground hover:text-foreground inline" />
              )}
            </button>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Upgrade your tech gear, refresh your wardrobe, or discover premium essentials. Applies directly at checkout.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <Link href="/products?sort=discount">
              <Button
                size="lg"
                className="h-11 px-6 rounded-xl font-bold gap-2 shadow-xs"
              >
                Shop Deals Now
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
