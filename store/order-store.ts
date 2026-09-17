import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Order } from '@/types/order';

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrderById: (id: string) => Order | undefined;
}

const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-8942-X',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Shipped',
    items: [
      {
        id: '1-default-default',
        productId: 1,
        product: {
          id: 1,
          title: 'Essence Mascara Lash Princess',
          description: 'The Essence Mascara Lash Princess is a popular mascara known for volumizing lashes.',
          category: 'beauty',
          price: 9.99,
          discountPercentage: 10,
          rating: 4.8,
          stock: 99,
          thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
          images: ['https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png'],
        },
        quantity: 2,
        unitPrice: 8.99,
      },
      {
        id: '101-Silver-Standard',
        productId: 101,
        product: {
          id: 101,
          title: 'Apple AirPods Max Silver',
          description: 'Premium over-ear headphones with high-fidelity audio.',
          category: 'mobile-accessories',
          price: 549.99,
          discountPercentage: 13,
          rating: 4.6,
          stock: 50,
          thumbnail: 'https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20AirPods%20Max%20Silver/thumbnail.png',
          images: ['https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20AirPods%20Max%20Silver/1.png'],
        },
        quantity: 1,
        selectedColor: 'Silver',
        unitPrice: 478.49,
      },
    ],
    shippingAddress: {
      fullName: 'Emily Johnson',
      email: 'emily.johnson@x.dummyjson.com',
      phone: '+1 (555) 342-9102',
      address: '626 Main Street',
      city: 'Phoenix',
      state: 'Mississippi',
      postalCode: '29112',
      country: 'United States',
      deliveryMethod: 'standard',
    },
    payment: {
      cardNumberMasked: '•••• •••• •••• 4242',
      cardholderName: 'Emily Johnson',
      paymentMethod: 'credit-card',
    },
    subtotal: 496.47,
    shipping: 0,
    tax: 39.72,
    discount: 0,
    total: 536.19,
    timeline: [
      {
        status: 'Processing',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Order placed and confirmed',
      },
      {
        status: 'Shipped',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Carrier picked up parcel from distribution hub',
      },
    ],
  },
  {
    id: 'ORD-7215-A',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Delivered',
    items: [
      {
        id: '2-default-default',
        productId: 2,
        product: {
          id: 2,
          title: 'Eyeshadow Palette with Mirror',
          description: 'High pigmentation versatile makeup palette.',
          category: 'beauty',
          price: 19.99,
          discountPercentage: 5,
          rating: 4.2,
          stock: 40,
          thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png',
          images: ['https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png'],
        },
        quantity: 1,
        unitPrice: 18.99,
      },
    ],
    shippingAddress: {
      fullName: 'Emily Johnson',
      email: 'emily.johnson@x.dummyjson.com',
      phone: '+1 (555) 342-9102',
      address: '626 Main Street',
      city: 'Phoenix',
      state: 'Mississippi',
      postalCode: '29112',
      country: 'United States',
      deliveryMethod: 'standard',
    },
    payment: {
      cardNumberMasked: '•••• •••• •••• 4242',
      cardholderName: 'Emily Johnson',
      paymentMethod: 'credit-card',
    },
    subtotal: 18.99,
    shipping: 9.99,
    tax: 1.52,
    discount: 0,
    total: 30.50,
    timeline: [
      {
        status: 'Processing',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Order placed',
      },
      {
        status: 'Shipped',
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Package in transit',
      },
      {
        status: 'Delivered',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Delivered to front porch',
      },
    ],
  },
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_MOCK_ORDERS,

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },

      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id);
      },
    }),
    {
      name: 'shopless-orders',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
