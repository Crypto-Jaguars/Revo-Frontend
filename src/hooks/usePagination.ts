import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/product';

interface UsePaginationProps {
  items: Product[];
  itemsPerPage: number;
  infinite?: boolean;
}

export function usePagination({ items, itemsPerPage, infinite = false }: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setPaginatedItems([]);
    setError(null);
  }, [items]);

  useEffect(() => {
    try {
      setIsLoading(true);
      if (infinite) {
        const end = currentPage * itemsPerPage;
        setPaginatedItems(prevItems => {
          const newItems = items.slice(0, end);
          return newItems;
        });
        setHasMore(end < items.length);
      } else {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setPaginatedItems(items.slice(start, end));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to paginate items'));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, items, itemsPerPage, infinite]);

  const loadMore = useCallback(() => {
    if (isLoading) return;
    if (currentPage < totalPages) {
      try {
        setCurrentPage(prev => prev + 1);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load more items'));
      }
    }
  }, [currentPage, totalPages, isLoading]);

  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages || isLoading) return;
    try {
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to navigate to page'));
    }
  }, [totalPages, isLoading]);

  return {
    items: paginatedItems,
    currentPage,
    totalPages,
    hasMore,
    loadMore,
    goToPage,
    isLoading,
    error
  };
} 