'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Product } from "@/types/product";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { CalendarDays, Package2, Truck } from "lucide-react";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onClick: (productId: string) => void;
  locale?: string;
}

export function ProductCard({ product, viewMode, onClick, locale = 'en' }: ProductCardProps) {
  const formatPrice = useCallback((amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }, [locale]);

  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium'
    }).format(date);
  }, [locale]);

  const cardClassName = cn(
    'w-full cursor-pointer transition-all',
    'hover:shadow-lg focus-visible:shadow-lg',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    'focus-visible:ring-offset-2',
    {
      'flex flex-row': viewMode === 'list'
    }
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(product.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={cardClassName}
      onClick={() => onClick(product.id)}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${product.name}`}
    >
      <div className={viewMode === 'grid' ? 'w-full' : 'w-1/4'}>
        <Image
          src={`/images/${product.images[0]}`}
          alt={product.name}
          width={viewMode === 'grid' ? 300 : 200}
          height={viewMode === 'grid' ? 200 : 150}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.jpg';
          }}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
          className="object-cover w-full h-48 rounded-t-lg"
        />
      </div>
      <div className={viewMode === 'grid' ? 'p-4' : 'w-3/4 p-4'}>
        {/* Farm Info Section */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/logo.jpeg"
              alt={`${product.farmer.farmName} logo`}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-sm text-gray-500">{product.farmer.farmName}</p>
        </div>

        {/* Product Info Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <div className="text-right">
              <p className="text-lg font-bold">
                {formatPrice(product.price.amount)}
                <span className="text-sm text-gray-500">{product.price.unit}</span>
              </p>
            </div>
          </div>

          {/* Certifications */}
          <div className="flex flex-wrap gap-1.5">
            {product.certifications.map((cert) => (
              <Badge key={cert} variant="secondary" className="text-xs">
                {cert}
              </Badge>
            ))}
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Package2 className="h-4 w-4" />
              <span>Stock: {product.stockQuantity}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>{formatDate(product.harvestDate)}</span>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="flex gap-2">
            {product.availableForDelivery && (
              <Badge variant="outline" className="text-xs">
                <Truck className="h-3 w-3 mr-1" aria-hidden="true" />
                <span aria-label="Delivery available">Delivery</span>
              </Badge>
            )}
            {product.pickupAvailable && (
              <Badge variant="outline" className="text-xs">
                <Package2 className="h-3 w-3 mr-1" aria-hidden="true" />
                <span aria-label="Pickup available">Pickup</span>
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 