"use client";

import type { EstimationRecord } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, SaveAll } from 'lucide-react'; // SaveAll might be better than Save for "Save from History"
import { format } from 'date-fns';

interface EstimationListProps {
  items: EstimationRecord[];
  listType: 'history' | 'saved';
  onDeleteItem?: (id: string) => void; // Only for saved list
  onSaveItem?: (item: EstimationRecord) => void; // Only for history list
  emptyListMessage: string;
}

export default function EstimationList({
  items,
  listType,
  onDeleteItem,
  onSaveItem,
  emptyListMessage,
}: EstimationListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">{emptyListMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">{item.name || item.description}</CardTitle>
            <CardDescription>
              Estimated on: {format(new Date(item.timestamp), "PPP p")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-lg text-primary">
              Price: {item.priceRange ? `$${item.priceRange.min} - $${item.priceRange.max}` : "N/A"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Details: {item.description}
            </p>
            <p className="text-xs text-muted-foreground mt-2">ID: {item.id}</p>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            {listType === 'history' && onSaveItem && (
              <Button variant="outline" size="sm" onClick={() => onSaveItem(item)}>
                <SaveAll className="mr-2 h-4 w-4" /> Save to Favorites
              </Button>
            )}
            {listType === 'saved' && onDeleteItem && (
              <Button variant="destructive" size="sm" onClick={() => onDeleteItem(item.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
            {/* Future: "Load into Estimator" button */}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
