'use client';

import { useState, useEffect, useCallback } from 'react';
import type { EstimationRecord, UserSelections, PriceRange } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { generateId } from '@/lib/utils';

const HISTORY_STORAGE_KEY = 'furnitureEstimatorHistory';
const SAVED_ESTIMATES_STORAGE_KEY = 'furnitureEstimatorSaved';
const MAX_HISTORY_ITEMS = 10;

function safelyGetFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
}

function safelySetInLocalStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
}

export function useEstimationStorage() {
  const [history, setHistory] = useState<EstimationRecord[]>([]);
  const [savedEstimates, setSavedEstimates] = useState<EstimationRecord[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setHistory(safelyGetFromLocalStorage<EstimationRecord[]>(HISTORY_STORAGE_KEY, []));
    setSavedEstimates(safelyGetFromLocalStorage<EstimationRecord[]>(SAVED_ESTIMATES_STORAGE_KEY, []));
  }, []);

  const addHistoryItem = useCallback((
    data: { selections: UserSelections; description: string; priceRange: PriceRange | null }
  ) => {
    const newHistoryItem: EstimationRecord = {
      id: generateId('hist'),
      ...data,
      timestamp: Date.now(),
    };

    setHistory(prevHistory => {
      const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, MAX_HISTORY_ITEMS);
      safelySetInLocalStorage(HISTORY_STORAGE_KEY, updatedHistory);
      return updatedHistory;
    });
  }, []);

  const addSavedEstimate = useCallback((
    data: { selections: UserSelections; description: string; priceRange: PriceRange | null },
    name?: string
  ) => {
    const newSavedItem: EstimationRecord = {
      id: generateId('saved'),
      ...data,
      timestamp: Date.now(),
      name: name || data.description,
    };

    let wasDuplicate = false;
    let itemAdded = false;

    setSavedEstimates(prevSaved => {
      const existingItemIndex = prevSaved.findIndex(item => 
        (newSavedItem.name && item.name === newSavedItem.name) || (!newSavedItem.name && item.description === newSavedItem.description)
      );

      if (existingItemIndex > -1) {
        wasDuplicate = true;
        // No change if duplicate found, but ensure localStorage reflects current state if it was somehow out of sync.
        // This typically isn't strictly necessary if prevSaved is always accurate.
        safelySetInLocalStorage(SAVED_ESTIMATES_STORAGE_KEY, prevSaved); 
        return prevSaved; 
      } else {
        const updatedSaved = [newSavedItem, ...prevSaved];
        safelySetInLocalStorage(SAVED_ESTIMATES_STORAGE_KEY, updatedSaved);
        itemAdded = true;
        return updatedSaved;
      }
    });

    if (wasDuplicate) {
      toast({ title: "Already Saved", description: `An estimate similar to "${newSavedItem.name}" is already saved.`, variant: "default" });
    } else if (itemAdded) {
      toast({ title: "Estimate Saved", description: `"${newSavedItem.name}" has been saved.` });
    }
  }, [toast]);

  const deleteSavedEstimate = useCallback((id: string) => {
    let itemWasDeleted = false;
    let deletedItemName = "Estimate"; // Default name

    setSavedEstimates(prevSaved => {
      const itemIndex = prevSaved.findIndex(item => item.id === id);
      if (itemIndex === -1) {
        // Item not found, no change
        return prevSaved;
      }
      
      deletedItemName = prevSaved[itemIndex].name || prevSaved[itemIndex].description;
      const updatedSaved = prevSaved.filter(item => item.id !== id);
      safelySetInLocalStorage(SAVED_ESTIMATES_STORAGE_KEY, updatedSaved);
      itemWasDeleted = true;
      return updatedSaved;
    });

    if (itemWasDeleted) {
      toast({ title: "Estimate Deleted", description: `"${deletedItemName}" has been removed.` });
    }
  }, [toast]);
  
  const clearHistory = useCallback(() => {
    setHistory([]);
    safelySetInLocalStorage(HISTORY_STORAGE_KEY, []);
    toast({ title: "History Cleared", description: "Your estimation history has been cleared." });
  }, [toast]);

  return { 
    history, 
    savedEstimates, 
    addHistoryItem, 
    addSavedEstimate, 
    deleteSavedEstimate,
    clearHistory 
  };
}