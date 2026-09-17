import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center space-y-6">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <ShoppingBag className="size-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-primary">404 ERROR</span>
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Page Not Found
        </h1>
        <p className="text-sm text-muted-foreground">
          Sorry, we couldn&apos;t find the product, category, or page you were looking for.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link href="/">
          <Button className="w-full sm:w-auto gap-2">
            <Home className="size-4" /> Back to Home
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <ArrowLeft className="size-4" /> Explore Catalog
          </Button>
        </Link>
      </div>
    </div>
  );
}
