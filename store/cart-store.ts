import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';
import { CartItem, CartCalculation } from '@/types/cart';
import { getDiscountedPrice, calculateCartTotals } from '@/lib/utils/format';
import { toast } from 'sonner';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string;
  promoDiscountPercent: number;
  deliveryMethod: 'standard' | 'express';
  
  // Actions
  addItem: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setOpen: (isOpen: boolean) => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  setDeliveryMethod: (method: 'standard' | 'express') => void;
  
  // Getters
  getItemCount: () => number;
  getTotals: () => CartCalculation;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: '',
      promoDiscountPercent: 0,
      deliveryMethod: 'standard',

      addItem: (product, quantity = 1, selectedColor, selectedSize) => {
        const compositeId = `${product.id}-${selectedColor || 'default'}-${selectedSize || 'default'}`;
        const unitPrice = getDiscountedPrice(product.price, product.discountPercentage);

        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.id === compositeId);

        let newItems: CartItem[];
        if (existingIndex > -1) {
          newItems = currentItems.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [
            ...currentItems,
            {
              id: compositeId,
              productId: product.id,
              product,
              quantity,
              selectedColor,
              selectedSize,
              unitPrice,
            },
          ];
        }

        set({ items: newItems });
        toast.success(`Added ${product.title} to cart`);
      },

      removeItem: (id) => {
        const item = get().items.find((i) => i.id === id);
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
        if (item) {
          toast.info(`Removed ${item.product.title} from cart`);
        }
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.product.stock || 99) } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], promoCode: '', promoDiscountPercent: 0 });
      },

      setOpen: (isOpen) => set({ isOpen }),

      applyPromoCode: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'SAVE10' || clean === 'SHOP10') {
          set({ promoCode: clean, promoDiscountPercent: 10 });
          toast.success('Promo code applied: 10% off!');
          return true;
        } else if (clean === 'SAVE20' || clean === 'VIP20') {
          set({ promoCode: clean, promoDiscountPercent: 20 });
          toast.success('Promo code applied: 20% off!');
          return true;
        } else {
          toast.error('Invalid promo code. Try SAVE10 or SAVE20');
          return false;
        }
      },

      removePromoCode: () => {
        set({ promoCode: '', promoDiscountPercent: 0 });
        toast.info('Promo code removed');
      },

      setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotals: () => {
        const { items, promoDiscountPercent, deliveryMethod } = get();
        return calculateCartTotals(items, promoDiscountPercent, deliveryMethod);
      },
    }),
    {
      name: 'shopless-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
        promoDiscountPercent: state.promoDiscountPercent,
        deliveryMethod: state.deliveryMethod,
      }),
    }
  )
);
