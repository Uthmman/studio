
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import type { FurnitureCategory, PriceDataEntry, DisplayablePriceEntry } from '@/lib/definitions';
import {
  getAllPossibleCombinationsWithPrices, 
  updateOrAddPriceData, 
  getFirebaseCategories,
  addFirebaseCategory,
  updateFirebaseCategory,
  deleteFirebaseCategory,
} from '@/lib/furniture-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Settings, DollarSign, Loader2, ImageUp } from 'lucide-react';
import CategoryFormDialog from '@/components/admin/category-form-dialog';
import PriceDataTable from '@/components/admin/price-data-table';
import PriceCombinationImageDialog from '@/components/admin/price-combination-image-dialog'; // New Dialog
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminFurniturePage() {
  const [categories, setCategories] = useState<FurnitureCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [priceCombinations, setPriceCombinations] = useState<DisplayablePriceEntry[]>([]);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FurnitureCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<FurnitureCategory | null>(null);

  const [isPriceImageDialogOpen, setIsPriceImageDialogOpen] = useState(false);
  const [editingPriceCombination, setEditingPriceCombination] = useState<DisplayablePriceEntry | null>(null);

  const { toast } = useToast();

  const refreshAdminData = useCallback(async () => {
    setIsLoadingCategories(true);
    setIsLoadingPrices(true);
    const fetchedCategories = await getFirebaseCategories();
    setCategories(fetchedCategories);
    setIsLoadingCategories(false);

    if (fetchedCategories.length > 0) {
        const combinations = await getAllPossibleCombinationsWithPrices(fetchedCategories);
        setPriceCombinations(combinations);
    } else {
        setPriceCombinations([]);
    }
    setIsLoadingPrices(false);
  }, []);

  useEffect(() => {
    refreshAdminData();
  }, [refreshAdminData]);


  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryFormOpen(true);
  };

  const handleEditCategory = (category: FurnitureCategory) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const confirmDeleteCategory = (category: FurnitureCategory) => {
    setCategoryToDelete(category);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    const success = await deleteFirebaseCategory(categoryToDelete.id);
    if (success) {
      await refreshAdminData(); 
      toast({ title: "Category Deleted", description: `Category "${categoryToDelete.name}" has been deleted from Firestore.` });
    } else {
      toast({ title: "Error", description: "Failed to delete category from Firestore.", variant: "destructive" });
    }
    setCategoryToDelete(null);
  };

  const handleCategoryFormSubmit = useCallback(async (categoryDataFromForm: FurnitureCategory) => {
    let success: FurnitureCategory | null = null;
    if (editingCategory && editingCategory.id) {
       const categoryToUpdate: FurnitureCategory = {
        ...categoryDataFromForm,
        features: categoryDataFromForm.features || [],
        sizes: categoryDataFromForm.sizes || [],
      };
      success = await updateFirebaseCategory(categoryToUpdate);
      if (success) {
        toast({ title: "Category Updated", description: `Category "${success.name}" has been updated in Firestore.` });
      }
    } else { 
      const newCategoryData: Omit<FurnitureCategory, 'id'> = {
        name: categoryDataFromForm.name,
        iconName: categoryDataFromForm.iconName,
        imagePlaceholder: categoryDataFromForm.imagePlaceholder,
        imageAiHint: categoryDataFromForm.imageAiHint,
        features: categoryDataFromForm.features || [],
        sizes: categoryDataFromForm.sizes || [],
      };
      success = await addFirebaseCategory(newCategoryData);
      
      if (success) {
        toast({ title: "Category Added", description: `Category "${success.name}" has been added to Firestore.` });
      }
    }

    if (success) {
      await refreshAdminData();
    } else {
      toast({ title: "Error", description: "Failed to save category to Firestore.", variant: "destructive" });
    }
    setIsCategoryFormOpen(false);
    setEditingCategory(null);
  }, [editingCategory, toast, refreshAdminData]);

  // Updated to accept override image data
  const handleSavePrice = useCallback(async (
    priceEntry: PriceDataEntry, 
    overrideImageUrl?: string, 
    overrideImageAiHint?: string
  ) => {
    if (categories.length === 0) {
        toast({ title: "Error", description: "Cannot save price, category data not loaded.", variant: "destructive" });
        return;
    }
    
    const entryToSave: PriceDataEntry = {
        ...priceEntry,
        overrideImageUrl: overrideImageUrl, // Can be undefined
        overrideImageAiHint: overrideImageAiHint, // Can be undefined
    };

    const result = await updateOrAddPriceData(entryToSave, categories); 
    if (result) {
      setIsLoadingPrices(true);
      const combinations = await getAllPossibleCombinationsWithPrices(categories);
      setPriceCombinations(combinations);
      setIsLoadingPrices(false);
      toast({ title: "Price Data Updated (Firestore)", description: `Price data for the combination has been saved.` });
    } else {
      toast({ title: "Error Saving Price Data (Firestore)", description: "Failed to save price data to Firestore.", variant: "destructive" });
    }
  }, [toast, categories]);

  const handleOpenPriceImageDialog = (combination: DisplayablePriceEntry) => {
    setEditingPriceCombination(combination);
    setIsPriceImageDialogOpen(true);
  };

  const handlePriceImageDialogSubmit = async (
    originalEntry: DisplayablePriceEntry, 
    newOverrideImageUrl?: string, 
    newOverrideImageAiHint?: string
  ) => {
    const priceEntryToUpdate: PriceDataEntry = {
        categoryId: originalEntry.categoryId,
        featureSelections: originalEntry.featureSelections,
        sizeId: originalEntry.sizeId,
        priceRange: originalEntry.priceRange, // Keep existing price range
        // These are the new values
        overrideImageUrl: newOverrideImageUrl, 
        overrideImageAiHint: newOverrideImageAiHint,
    };
    await handleSavePrice(priceEntryToUpdate, newOverrideImageUrl, newOverrideImageAiHint);
    setIsPriceImageDialogOpen(false);
    setEditingPriceCombination(null);
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2">
          <div className="flex-grow">
            <CardTitle className="text-2xl flex items-center"><Settings className="mr-2 h-6 w-6 text-primary" />Manage Furniture Categories (Firestore)</CardTitle>
            <CardDescription>Add, edit, or delete furniture categories. Images uploaded are stored as Data URIs.</CardDescription>
          </div>
          <Button onClick={handleAddCategory} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingCategories ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <p>Loading categories from Firestore...</p>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No categories found in Firestore. Add one to get started!</p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Sizes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium whitespace-nowrap">{category.name}</TableCell>
                      <TableCell className="whitespace-nowrap">{category.iconName}</TableCell>
                      <TableCell>
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-md border overflow-hidden bg-muted">
                           <img src={category.imagePlaceholder || "https://placehold.co/100x100.png"} alt={category.name} className="h-full w-full object-contain p-1" />
                        </div>
                      </TableCell>
                      <TableCell>{(category.features || []).length}</TableCell>
                      <TableCell>{(category.sizes || []).length}</TableCell>
                      <TableCell className="text-right space-x-2 whitespace-nowrap">
                        <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                          <Edit className="mr-1 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => confirmDeleteCategory(category)}>
                          <Trash2 className="mr-1 h-4 w-4" /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isCategoryFormOpen && (
        <CategoryFormDialog
          isOpen={isCategoryFormOpen}
          onClose={() => {
            setIsCategoryFormOpen(false);
            setEditingCategory(null);
          }}
          onSubmit={handleCategoryFormSubmit}
          initialData={editingCategory}
        />
      )}

      {categoryToDelete && (
        <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete "{categoryToDelete.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the category.
                Associated price data in Firestore will NOT be automatically deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete Category
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      
      <Card className="mt-8">
        <CardHeader>
            <CardTitle className="text-2xl flex items-center"><DollarSign className="mr-2 h-6 w-6 text-primary" />Manage Price Data (Firestore)</CardTitle>
            <CardDescription>
                Define or update price ranges and specific images for each combination.
                Rows highlighted indicate no specific price entry in Firestore.
                Images uploaded here override default derived images for the combination.
            </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPrices || (isLoadingCategories && categories.length === 0) ? (
             <div className="flex items-center justify-center py-10">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <p>Loading price combinations...</p>
            </div>
          ) : priceCombinations.length === 0 && categories.length > 0 ? (
             <p className="text-muted-foreground text-center py-4">No priceable combinations found.</p>
          ) : priceCombinations.length === 0 && categories.length === 0 && !isLoadingCategories ? (
             <p className="text-muted-foreground text-center py-4">No categories loaded. Add categories first.</p>
          ) : (
            <div className="overflow-auto max-h-[70vh] rounded-md border">
              <PriceDataTable 
                priceEntries={priceCombinations} 
                onSavePrice={handleSavePrice} 
                onEditImage={handleOpenPriceImageDialog}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {editingPriceCombination && isPriceImageDialogOpen && (
        <PriceCombinationImageDialog
          isOpen={isPriceImageDialogOpen}
          onClose={() => {
            setIsPriceImageDialogOpen(false);
            setEditingPriceCombination(null);
          }}
          onSubmit={handlePriceImageDialogSubmit}
          combination={editingPriceCombination}
        />
      )}
    </div>
  );
}
