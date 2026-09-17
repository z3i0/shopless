"use client";

import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center space-y-6">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-destructive">SYSTEM NOTICE</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground">
          We encountered an unexpected error while processing your request. Please try again.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button onClick={() => reset()} className="w-full sm:w-auto gap-2">
          <RotateCcw className="size-4" /> Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <Home className="size-4" /> Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
