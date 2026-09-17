import { CartItem } from './cart';

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  deliveryMethod: 'standard' | 'express';
}

export type PaymentMethodType = 'credit-card' | 'paypal' | 'apple-pay' | 'cash-on-delivery';

export interface PaymentDetails {
  paymentMethod: PaymentMethodType;
  cardNumberMasked?: string;
  cardholderName?: string;
  paypalEmail?: string;
}

export interface Order {
  id: string;
  date: string;
  estimatedDelivery: string;
  status: OrderStatus;
  items: CartItem[];
  shippingAddress: ShippingDetails;
  payment: PaymentDetails;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  timeline?: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
}
