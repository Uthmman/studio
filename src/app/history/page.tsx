"use client";

import React, { useCallback } from 'react';
import { useEstimationStorage } from '@/hooks/use-estimation-storage';
import EstimationList from '@/components/history/estimation-list';
import Header from '@/components/layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Trash2, Save, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { EstimationRecord } from '@/lib/definitions';
import SaveEstimationDialog from '@/components/history/save-estimation-dialog';


export default function HistoryPage() {
  const { 
    history, 
    savedEstimates, 
    deleteSavedEstimate, 
    clearHistory,
    addSavedEstimate // We need this to save from history
  } = useEstimationStorage();

  const [itemToSave, setItemToSave] = React.useState<EstimationRecord | null>(null);
  const [isSaveDialogVisible, setIsSaveDialogVisible] = React.useState(false);

  const handleOpenSaveDialog = useCallback((item: EstimationRecord) => {
    setItemToSave(item);
    setIsSaveDialogVisible(true);
  }, []);

  const handleConfirmSave = useCallback((name?: string) => {
    if (itemToSave) {
      addSavedEstimate({
        selections: itemToSave.selections,
        description: itemToSave.description,
        priceRange: itemToSave.priceRange,
      }, name || itemToSave.name || itemToSave.description);
    }
    setIsSaveDialogVisible(false);
    setItemToSave(null);
  }, [itemToSave, addSavedEstimate]);


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Estimation History & Saved</h1>
          {history.length > 0 && (
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" /> Clear Recent History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to clear all recent history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone and will remove all items from your recent estimation history. Saved estimates will not be affected.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Clear History
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="saved">
              <Save className="mr-2 h-4 w-4" /> Saved Estimates ({savedEstimates.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              <Trash2 className="mr-2 h-4 w-4" /> Recent History ({history.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved">
            <EstimationList
              items={savedEstimates}
              listType="saved"
              onDeleteItem={deleteSavedEstimate}
              emptyListMessage="You have no saved estimates yet. Save one from the estimator or your history!"
            />
          </TabsContent>
          <TabsContent value="history">
            <EstimationList
              items={history}
              listType="history"
              onSaveItem={handleOpenSaveDialog} // Pass the handler to open save dialog
              emptyListMessage="Your recent estimation history is empty. Make an estimate to see it here."
            />
          </TabsContent>
        </Tabs>
         {itemToSave && (
          <SaveEstimationDialog
            isOpen={isSaveDialogVisible}
            onClose={() => {
              setIsSaveDialogVisible(false);
              setItemToSave(null);
            }}
            onSave={handleConfirmSave}
            defaultName={itemToSave.name || itemToSave.description}
          />
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        &copy; {new Date().getFullYear()} FurnitureFind.
      </footer>
    </div>
  );
}
