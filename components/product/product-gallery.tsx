"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const displayImages = images && images.length > 0 ? images : ['/placeholder.png'];
  const [selectedImage, setSelectedImage] = useState<string>(displayImages[0]);

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      {/* Thumbnails list */}
      {displayImages.length > 1 && (
        <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[480px] pb-2 sm:pb-0 scrollbar-thin">
          {displayImages.map((img, idx) => {
            const isSelected = selectedImage === img;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-lg border-2 bg-muted/30 transition-all ${
                  isSelected
                    ? 'border-primary shadow-xs ring-2 ring-primary/20'
                    : 'border-border/60 hover:border-border opacity-70 hover:opacity-100'
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1.5"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image Preview */}
      <div className="relative aspect-square w-full flex-1 overflow-hidden rounded-2xl border border-border bg-muted/20 p-6 flex items-center justify-center">
        <Image
          src={selectedImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-contain p-6 transition-all duration-300 hover:scale-105"
        />
      </div>
    </div>
  );
}
