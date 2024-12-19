'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { productsMock } from '@/mocks/products';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import Bounded from '@/components/Bounded';
import { useTranslations } from 'next-intl';
import { usePagination } from '@/hooks/usePagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductFilters } from '@/components/products/ProductFilters';

export default function ProductsPage() {
  const t = useTranslations('Products');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    farmingMethod: '',
    deliveryOnly: false,
    pickupOnly: false,
  });
  const [sortBy, setSortBy] = useState<'price' | 'date' | 'stock'>('date');
  const ITEMS_PER_PAGE = 12;
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const handleProductClick = useCallback((productId: string) => {
    console.log('Product clicked:', productId);
  }, []);

  const filteredProducts = useMemo(() => {
    return productsMock.filter((product) => {
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      if (filters.farmingMethod && product.farmingMethod !== filters.farmingMethod) {
        return false;
      }
      if (filters.deliveryOnly && !product.availableForDelivery) {
        return false;
      }
      if (filters.pickupOnly && !product.pickupAvailable) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price.amount - b.price.amount;
        case 'date':
          return b.harvestDate.getTime() - a.harvestDate.getTime();
        case 'stock':
          return b.stockQuantity - a.stockQuantity;
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  const categories = useMemo(() => 
    Array.from(new Set(productsMock.map((p) => p.category))),
    []
  );
  
  const farmingMethods = useMemo(() => 
    Array.from(new Set(productsMock.map((p) => p.farmingMethod))),
    []
  );

  const { 
    items: paginatedProducts, 
    hasMore, 
    loadMore 
  } = usePagination({
    items: sortedProducts,
    itemsPerPage: ITEMS_PER_PAGE,
    infinite: true
  });

  const handleFilterChange = useCallback(async (newFilters: Partial<ProductFilters>) => {
    setIsFilterLoading(true);
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsFilterLoading(false);
  }, []);

  const handleSortChange = useCallback((value: 'price' | 'date' | 'stock') => {
    setSortBy(value);
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  useEffect(() => {
    // Simulate initial data loading
    const loadInitialData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadInitialData();
  }, []);

  return (
    <Bounded>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <ProductFilters 
            onFilterChange={handleFilterChange}
            categories={categories}
            farmingMethods={farmingMethods}
          />
        </aside>

        <main className="md:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('sortBy.label')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">{t('sortBy.price')}</SelectItem>
                  <SelectItem value="date">{t('sortBy.date')}</SelectItem>
                  <SelectItem value="stock">{t('sortBy.stock')}</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => handleViewModeChange('grid')}
                  title={t('viewMode.grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => handleViewModeChange('list')}
                  title={t('viewMode.list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <ProductGrid
            products={paginatedProducts}
            viewMode={viewMode}
            onProductClick={handleProductClick}
            hasMore={hasMore}
            onLoadMore={loadMore}
            isLoading={isLoading}
            isFilterLoading={isFilterLoading}
          />
        </main>
      </div>
    </Bounded>
  );
} 