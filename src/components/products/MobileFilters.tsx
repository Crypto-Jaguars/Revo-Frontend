'use client';

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { ProductFilters } from "./ProductFilters";

interface MobileFiltersProps {
  categories: string[];
  farmingMethods: string[];
  onFilterChange: (filters: ProductFilters) => void;
}

export function MobileFilters({ categories, farmingMethods, onFilterChange }: MobileFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <ProductFilters
          categories={categories}
          farmingMethods={farmingMethods}
          onFilterChange={onFilterChange}
        />
      </SheetContent>
    </Sheet>
  );
} 