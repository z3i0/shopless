import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';

function formatCategoryName(category?: string): string {
  if (!category) return '';
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
import { getProductById, getProductsByCategory } from '@/lib/api/products';
import { formatCurrency, getDiscountedPrice, formatDate } from '@/lib/utils/format';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductRating } from '@/components/product/product-rating';
import { ProductDetailActions } from '@/components/product/product-detail-actions';
import { ProductCard } from '@/components/product/product-card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductById(slug);
    return {
      title: `${product.title} | Shopless`,
      description: product.description,
      openGraph: {
        images: product.thumbnail ? [product.thumbnail] : [],
      },
    };
  } catch {
    return {
      title: 'Product Details | Shopless',
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductById(slug);
  } catch (err) {
    notFound();
  }

  // Fetch related products in same category
  const relatedResponse = await getProductsByCategory(product.category, { limit: 5 }).catch(
    () => ({ products: [] })
  );
  const relatedProducts = relatedResponse.products.filter((p) => p.id !== product.id).slice(0, 4);

  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-12">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3.5" />
        <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
        <ChevronRight className="size-3.5" />
        <Link href={`/categories/${product.category}`} className="hover:text-foreground transition-colors">
          {formatCategoryName(product.category)}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
          {product.title}
        </span>
      </nav>

      {/* 2. Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery (7 cols) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Right: Info & Actions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Category, Brand & SKU */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <Link
                href={`/categories/${product.category}`}
                className="font-semibold uppercase tracking-wider text-primary hover:underline"
              >
                {formatCategoryName(product.category)}
              </Link>
              {product.brand && (
                <>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="font-medium text-muted-foreground">{product.brand}</span>
                </>
              )}
            </div>
            {product.sku && (
              <span className="text-[11px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/50">
                SKU: {product.sku}
              </span>
            )}
          </div>

          {/* Title (Single H1) */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <ProductRating
              rating={product.rating}
              reviewsCount={product.reviews?.length}
              size="md"
            />
            <span className="text-muted-foreground/50">•</span>
            <span className="text-xs text-muted-foreground">
              {product.availabilityStatus || (product.stock > 0 ? 'In Stock' : 'Out of Stock')}
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-3xl font-black text-foreground">
              {formatCurrency(discountedPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {formatCurrency(product.price)}
                </span>
                <Badge className="bg-destructive text-destructive-foreground font-bold text-xs">
                  Save {Math.round(product.discountPercentage)}%
                </Badge>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed pt-1">
            {product.description}
          </p>

          {/* Interactive Variant Selection & Cart Actions */}
          <ProductDetailActions product={product} />

          {/* Trust Guarantees */}
          <div className="mt-6 rounded-xl border border-border bg-card/60 p-4 divide-y divide-border/60 text-xs">
            <div className="flex items-center gap-3 pb-3">
              <Truck className="size-4 text-primary shrink-0" />
              <div>
                <span className="font-semibold text-foreground">Fast Delivery</span>
                <p className="text-muted-foreground">{product.shippingInformation || 'Ships within 24-48 business hours'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3">
              <RotateCcw className="size-4 text-primary shrink-0" />
              <div>
                <span className="font-semibold text-foreground">Hassle-Free Returns</span>
                <p className="text-muted-foreground">{product.returnPolicy || '30 days standard return guarantee'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <Shield className="size-4 text-primary shrink-0" />
              <div>
                <span className="font-semibold text-foreground">Warranty Protection</span>
                <p className="text-muted-foreground">{product.warrantyInformation || '1 year official brand warranty'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Tabs (Specifications & Customer Reviews) */}
      <div className="mt-8">
        <Tabs defaultValue="specifications" className="w-full">
          <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent gap-6">
            <TabsTrigger
              value="specifications"
              className="rounded-none border-b-2 border-transparent px-2 pb-3 font-semibold data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Specifications & Details
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent px-2 pb-3 font-semibold data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Customer Reviews ({product.reviews?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Specifications Content */}
          <TabsContent value="specifications" className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
              {/* Card 1: General Info & Category */}
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="pb-3 mb-4 border-b border-border">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      General Information
                    </h3>
                  </div>
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground font-medium">Category</span>
                      <Link
                        href={`/categories/${product.category}`}
                        className="font-semibold text-primary hover:underline text-right"
                      >
                        {formatCategoryName(product.category)}
                      </Link>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground font-medium">Brand</span>
                      <span className="font-semibold text-foreground">{product.brand || 'Original'}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground font-medium">Catalog SKU</span>
                      <span className="font-mono text-xs font-semibold text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40">
                        {product.sku || `SKU-${product.id}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground font-medium">Availability</span>
                      <span className="font-semibold text-foreground">
                        {product.availabilityStatus || (product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock')}
                      </span>
                    </div>
                  </div>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-muted-foreground font-medium mr-1">Tags:</span>
                    {product.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/products?q=${encodeURIComponent(tag)}`}
                        className="text-[11px] font-medium text-muted-foreground hover:text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/50 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Card 2: Dimensions & Physical Attributes */}
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="pb-3 mb-4 border-b border-border">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Dimensions & Weight
                    </h3>
                  </div>
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground font-medium">Dimensions</span>
                      <span className="font-semibold text-foreground text-right">
                        {product.dimensions
                          ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`
                          : 'Standard dimensions'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground font-medium">Item Weight</span>
                      <span className="font-semibold text-foreground">
                        {product.weight !== undefined ? `${product.weight} kg` : 'Standard'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground font-medium">Minimum Order</span>
                      <span className="font-semibold text-foreground">
                        {product.minimumOrderQuantity || 1} unit(s)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Shipping & Policies */}
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="pb-3 mb-4 border-b border-border">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Shipping & Policies
                    </h3>
                  </div>
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground font-medium">Shipping</span>
                      <span className="font-semibold text-foreground text-right">
                        {product.shippingInformation || 'Ships in 1-2 days'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground font-medium">Warranty</span>
                      <span className="font-semibold text-foreground text-right">
                        {product.warrantyInformation || '1 year warranty'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground font-medium">Return Policy</span>
                      <span className="font-semibold text-foreground text-right">
                        {product.returnPolicy || '30 days return'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground font-medium">Barcode (EAN)</span>
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {product.meta?.barcode || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Reviews Content */}
          <TabsContent value="reviews" className="pt-6">
            {product.reviews && product.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.reviews.map((rev, index) => (
                  <div key={index} className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-foreground">{rev.reviewerName}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(rev.date)}</span>
                      </div>
                      <ProductRating rating={rev.rating} showCount={false} size="sm" className="mb-3" />
                      <p className="text-sm text-muted-foreground italic">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Verified Buyer
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">No reviews yet for this product.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* 4. Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-8 border-t border-border/60 pt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              You May Also Like
            </h2>
            <Link
              href={`/categories/${product.category}`}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Explore {formatCategoryName(product.category)}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
