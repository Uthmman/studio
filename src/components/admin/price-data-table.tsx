"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { PriceDataEntry, DisplayablePriceEntry as DisplayablePriceEntryType } from '@/lib/definitions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
// ScrollArea removed
import { useToast } from '@/hooks/use-toast';
import { getCanonicalFeatureValue } from '@/lib/furniture-data'; 

interface PriceDataTableProps {
  priceEntries: DisplayablePriceEntryType[];
  onSavePrice: (entry: PriceDataEntry) => void;
}

const createEntryKey = (entry: DisplayablePriceEntryType): string => {
  const featuresKey = Object.entries(entry.featureSelections)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) 
    .map(([key, value]) => `${key}:${getCanonicalFeatureValue(value)}`) 
    .join(';');
  return `${entry.categoryId}|${featuresKey}|${entry.sizeId}`;
};

export default function PriceDataTable({ priceEntries, onSavePrice }: PriceDataTableProps) {
  const [editablePrices, setEditablePrices] = useState<Record<string, { min: string; max: string }>>({});
  const { toast } = useToast();

  useEffect(() => {
    const initialEditablePrices: Record<string, { min: string; max: string }> = {};
    priceEntries.forEach(entry => {
      const key = createEntryKey(entry);
      initialEditablePrices[key] = {
        min: entry.priceRange.min.toString(),
        max: entry.priceRange.max.toString(),
      };
    });
    setEditablePrices(initialEditablePrices);
  }, [priceEntries]);

  const handleInputChange = (key: string, field: 'min' | 'max', value: string) => {
    setEditablePrices(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { min: '0', max: '0'}), 
        [field]: value,
      },
    }));
  };

  const handleSave = useCallback((entry: DisplayablePriceEntryType) => {
    const key = createEntryKey(entry);
    const { min: minStr, max: maxStr } = editablePrices[key] || { min: '0', max: '0' };
    
    const minPrice = parseFloat(minStr); 
    const maxPrice = parseFloat(maxStr);

    if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < 0) {
      toast({ title: "Validation Error", description: "Min and Max prices must be valid, non-negative numbers.", variant: "destructive" });
      return;
    }
    if (minPrice > maxPrice) {
      toast({ title: "Validation Error", description: "Min price cannot be greater than Max price.", variant: "destructive" });
      return;
    }
    
    onSavePrice({
      categoryId: entry.categoryId,
      featureSelections: entry.featureSelections, 
      sizeId: entry.sizeId,
      priceRange: { min: minPrice, max: maxPrice },
    });
  }, [editablePrices, onSavePrice, toast]);
  
  if (priceEntries.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No priceable combinations found. Ensure categories have sizes. If categories have features, they must also have options.</p>;
  }

  // Removed ScrollArea wrapper. The Table component has its own overflow handling.
  // The parent div in AdminFurniturePage will manage overall scroll constraints (max-height, overflow-x).
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="sticky top-0 bg-card z-10 min-w-[150px] whitespace-nowrap">Category</TableHead>
          <TableHead className="sticky top-0 bg-card z-10 min-w-[250px] whitespace-nowrap">Features</TableHead>
          <TableHead className="sticky top-0 bg-card z-10 min-w-[120px] whitespace-nowrap">Size</TableHead>
          <TableHead className="sticky top-0 bg-card z-10 w-[110px] min-w-[110px] whitespace-nowrap">Min Price</TableHead>
          <TableHead className="sticky top-0 bg-card z-10 w-[110px] min-w-[110px] whitespace-nowrap">Max Price</TableHead>
          <TableHead className="sticky top-0 bg-card z-10 text-right w-[110px] min-w-[110px] whitespace-nowrap">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {priceEntries.map((entry) => {
          const key = createEntryKey(entry);
          const currentEditPrices = editablePrices[key] || { min: entry.priceRange.min.toString(), max: entry.priceRange.max.toString() };
          return (
            <TableRow 
              key={key} 
              className={!entry.isPriced ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'}
              data-testid={`price-row-${key}`}
            >
              <TableCell className="font-medium whitespace-nowrap">{entry.categoryName}</TableCell>
              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{entry.featureDescription}</TableCell>
              <TableCell className="text-sm whitespace-nowrap">{entry.sizeLabel}</TableCell>
              <TableCell className="whitespace-nowrap">
                <Input
                  type="number"
                  value={currentEditPrices.min}
                  onChange={(e) => handleInputChange(key, 'min', e.target.value)}
                  placeholder="0"
                  className="h-9 text-sm w-full"
                  min="0"
                  step="0.01" 
                />
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Input
                  type="number"
                  value={currentEditPrices.max}
                  onChange={(e) => handleInputChange(key, 'max', e.target.value)}
                  placeholder="0"
                  className="h-9 text-sm w-full"
                  min="0"
                  step="0.01"
                />
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <Button variant="outline" size="sm" onClick={() => handleSave(entry)}>
                  <Save className="mr-1 h-3 w-3" /> {entry.isPriced ? 'Save' : 'Add'}
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
