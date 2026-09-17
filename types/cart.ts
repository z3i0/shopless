import { Product } from './product';

export interface CartItem {
  id: string; // product id + color + size unique composite key
  productId: number;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  unitPrice: number;
}

export interface CartCalculation {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}
