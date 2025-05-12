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

    setSavedEstimates(prevSaved => {
      // Check if an item with the same name (if provided) or description already exists
      const existingItemIndex = prevSaved.findIndex(item => 
        (name && item.name === name) || (!name && item.description === newSavedItem.description)
      );

      let updatedSaved;
      if (existingItemIndex > -1) {
        // Optional: Update existing if found, or prevent duplicate. For now, let's just add.
        // Or, inform user: toast({ title: "Already Saved", description: "An estimate with this name/description already exists."}); return prevSaved;
        updatedSaved = [...prevSaved]; // No change if duplicate found and we decide to prevent
         toast({ title: "Already Saved", description: `An estimate similar to "${newSavedItem.name}" is already saved.`, variant: "default" });
         return updatedSaved; // Exit without adding
      } else {
         updatedSaved = [newSavedItem, ...prevSaved];
         toast({ title: "Estimate Saved", description: `"${newSavedItem.name}" has been saved.` });
      }
      
      safelySetInLocalStorage(SAVED_ESTIMATES_STORAGE_KEY, updatedSaved);
      return updatedSaved;
    });
  }, [toast]);

  const deleteSavedEstimate = useCallback((id: string) => {
    setSavedEstimates(prevSaved => {
      const itemToDelete = prevSaved.find(item => item.id === id);
      const updatedSaved = prevSaved.filter(item => item.id !== id);
      safelySetInLocalStorage(SAVED_ESTIMATES_STORAGE_KEY, updatedSaved);
      if (itemToDelete) {
        toast({ title: "Estimate Deleted", description: `"${itemToDelete.name || itemToDelete.description}" has been removed.` });
      }
      return updatedSaved;
    });
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
