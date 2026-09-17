import { CartItem, CartCalculation } from '@/types/cart';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

export function getDiscountedPrice(originalPrice: number, discountPercentage: number): number {
  if (!discountPercentage || discountPercentage <= 0) return originalPrice;
  const discounted = originalPrice * (1 - discountPercentage / 100);
  return Math.round(discounted * 100) / 100;
}

export function formatDate(dateString: string | number | Date): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return String(dateString);
  }
}

export function calculateCartTotals(
  items: CartItem[],
  promoDiscountPercent = 0,
  deliveryMethod: 'standard' | 'express' = 'standard'
): CartCalculation {
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  
  // Promo discount
  const discount = Math.round((subtotal * (promoDiscountPercent / 100)) * 100) / 100;
  
  // Shipping: free over $75, otherwise $9.99 for standard, $19.99 for express
  let shipping = 0;
  if (items.length > 0) {
    if (deliveryMethod === 'express') {
      shipping = 19.99;
    } else {
      shipping = subtotal >= 75 ? 0 : 9.99;
    }
  }

  // Estimated tax (approx 8%)
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round((taxableAmount * 0.08) * 100) / 100;

  const total = Math.max(0, Math.round((taxableAmount + shipping + tax) * 100) / 100);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount,
    shipping,
    tax,
    total,
  };
}
