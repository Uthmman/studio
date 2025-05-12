"use client";

import type { PriceRange } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface PriceDisplayProps {
  priceRange: PriceRange | null;
  itemName: string;
  onStartOver: () => void;
}

export default function PriceDisplay({ priceRange, itemName, onStartOver }: PriceDisplayProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">Price Estimation Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
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
        <Button onClick={onStartOver} className="w-full" size="lg">
          Start Over
        </Button>
      </CardContent>
    </Card>
  );
}
