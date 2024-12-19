'use client';

import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { useInView } from 'react-intersection-observer';
import { useEffect, useCallback } from 'react';
import { ProductSkeleton } from "./ProductSkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  onProductClick: (productId: string) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
  isFilterLoading?: boolean;
  error?: Error | null;
}

export function ProductGrid({ 
  products, 
  viewMode, 
  onProductClick, 
  hasMore = false, 
  onLoadMore,
  isLoading = false,
  isFilterLoading = false,
  error = null
}: ProductGridProps) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    delay: 100
  });

  const handleInView = useCallback(() => {
    if (inView && hasMore && onLoadMore && !isLoading && !isFilterLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore, isLoading, isFilterLoading]);

  useEffect(() => {
    handleInView();
  }, [handleInView]);

  const gridClassName = viewMode === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    : 'flex flex-col gap-4';

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message || 'An error occurred while loading products'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div 
        className={gridClassName} 
        aria-busy="true" 
        role="grid"
        aria-label="Loading products"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div 
        className="text-center py-8 text-muted-foreground"
        role="status"
        aria-label="No products found"
      >
        No products found
      </div>
    );
  }

  return (
    <div className="space-y-6" role="region" aria-label="Products grid">
      <div 
        className={`${gridClassName} ${isFilterLoading ? 'opacity-50' : ''}`}
        role={viewMode === 'grid' ? 'grid' : 'list'}
        aria-busy={isFilterLoading}
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            onClick={onProductClick}
            aria-setsize={products.length}
            aria-posinset={index + 1}
          />
        ))}
      </div>
      {hasMore && (
        <div 
          ref={ref} 
          className="w-full flex justify-center"
          aria-hidden="true"
        >
          <ProductSkeleton />
        </div>
      )}
    </div>
  );
} 