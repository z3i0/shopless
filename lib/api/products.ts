import { fetchClient } from './client';
import { Product, ProductsResponse, ProductQueryParams } from '@/types/product';

function buildQueryString(params?: ProductQueryParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();

  if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params.skip !== undefined) searchParams.set('skip', String(params.skip));
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.order) searchParams.set('order', params.order);

  const str = searchParams.toString();
  return str ? `?${str}` : '';
}

export async function getProducts(params?: ProductQueryParams): Promise<ProductsResponse> {
  const query = buildQueryString(params);
  return fetchClient<ProductsResponse>(`/products${query}`);
}

export async function getProductById(id: number | string): Promise<Product> {
  // If slug is passed like "1-apple-airpods", extract numeric ID
  const numericId = typeof id === 'string' ? id.split('-')[0] : id;
  return fetchClient<Product>(`/products/${numericId}`);
}

export async function searchProducts(
  query: string,
  params?: ProductQueryParams
): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('q', query);
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
  if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params?.order) searchParams.set('order', params.order);

  return fetchClient<ProductsResponse>(`/products/search?${searchParams.toString()}`);
}

export async function getProductsByCategory(
  category: string,
  params?: ProductQueryParams
): Promise<ProductsResponse> {
  const query = buildQueryString(params);
  return fetchClient<ProductsResponse>(`/products/category/${encodeURIComponent(category)}${query}`);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const res = await getProducts({ limit, sortBy: 'rating', order: 'desc' });
  return res.products;
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  // Sort by id desc or highest discount
  const res = await getProducts({ limit, sortBy: 'id', order: 'desc' });
  return res.products;
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const res = await getProducts({ limit, sortBy: 'price', order: 'desc' });
  return res.products;
}
