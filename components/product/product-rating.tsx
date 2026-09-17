import React from 'react';
import { Star } from 'lucide-react';

interface ProductRatingProps {
  rating: number;
  reviewsCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export function ProductRating({
  rating,
  reviewsCount,
  size = 'sm',
  showCount = true,
  className = '',
}: ProductRatingProps) {
  const iconSize = size === 'lg' ? 'size-5' : size === 'md' ? 'size-4' : 'size-3.5';
  const textSize = size === 'lg' ? 'text-base' : size === 'md' ? 'text-sm' : 'text-xs';

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.4;

  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-label={`Rating: ${rating} out of 5 stars`}>
      <div className="flex items-center gap-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < fullStars;
          const isHalf = i === fullStars && hasHalfStar;

          return (
            <Star
              key={i}
              className={`${iconSize} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : isHalf
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-muted-foreground/30'
              }`}
            />
          );
        })}
      </div>

      <span className={`font-medium text-foreground ${textSize}`}>
        {rating.toFixed(1)}
      </span>

      {showCount && reviewsCount !== undefined && (
        <span className={`text-muted-foreground ${textSize}`}>
          ({reviewsCount})
        </span>
      )}
    </div>
  );
}
