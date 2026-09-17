import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Top Banner Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-32 rounded-md" />
        <Skeleton className="h-10 w-72 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="pt-2 flex justify-between items-center">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-14 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
