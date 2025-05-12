"use client";

import type { PriceRange, UserSelections, FurnitureCategory } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';
import Image from 'next/image';
import { getFinalImageForSelections } from '@/lib/furniture-data';

interface PriceDisplayProps {
  priceRange: PriceRange | null;
  itemName: string;
  onStartOver: () => void;
  onSave: () => void; // New prop to handle saving
  currentSelections: UserSelections;
  allCategories: FurnitureCategory[];
}

export default function PriceDisplay({ 
  priceRange, 
  itemName, 
  onStartOver, 
  onSave,
  currentSelections,
  allCategories
}: PriceDisplayProps) {
  const { finalImageUrl, finalImageAiHint } = getFinalImageForSelections(currentSelections, allCategories);

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">Price Estimation Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {finalImageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md mb-4 border shadow-md">
            <Image
              src={finalImageUrl}
              alt={`Final selected: ${itemName}`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={finalImageAiHint || itemName.split(" ").slice(0,2).join(" ")}
              priority
            />
          </div>
        )}
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-2">For: <span className="font-medium text-foreground">{itemName}</span></p>
          {priceRange ? (
            <div className="p-6 bg-primary/10 border border-primary rounded-lg">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-4xl font-bold text-primary">
                ${priceRange.min} - ${priceRange.max}
              </p>
              <p className="text-sm text-primary/80 mt-2">This is an estimated price range based on your selections.</p>
            </div>
          ) : (
            <div className="p-6 bg-destructive/10 border border-destructive rounded-lg">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-2xl font-semibold text-destructive">
                Price Not Available
              </p>
              <p className="text-sm text-destructive/80 mt-2">We couldn't find a price for the selected combination. Please try different options.</p>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onStartOver} className="flex-1" size="lg" variant="outline">
            Start Over
          </Button>
          <Button onClick={onSave} className="flex-1" size="lg">
            <Save className="mr-2 h-5 w-5" /> Save Estimate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
