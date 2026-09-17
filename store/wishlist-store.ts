import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';
import { toast } from 'sonner';

interface WishlistState {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product) => {
        const currentItems = get().items;
        const exists = currentItems.some((item) => item.id === product.id);

        if (exists) {
          set({
            items: currentItems.filter((item) => item.id !== product.id),
          });
          toast.info(`Removed ${product.title} from wishlist`);
        } else {
          set({
            items: [...currentItems, product],
          });
          toast.success(`Saved ${product.title} to wishlist`);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      removeFromWishlist: (productId) => {
        const item = get().items.find((i) => i.id === productId);
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
        if (item) {
          toast.info(`Removed ${item.title} from wishlist`);
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'shopless-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
