
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
import { PlusCircle, Edit, Trash2, Settings, DollarSign, Loader2 } from 'lucide-react';
import CategoryFormDialog from '@/components/admin/category-form-dialog';
import PriceDataTable from '@/components/admin/price-data-table';
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
  const [priceCombinations, setPriceCombinations] = useState<DisplayablePriceEntry[]>([]);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FurnitureCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<FurnitureCategory | null>(null);

  const { toast } = useToast();

  const refreshAdminData = useCallback(async () => {
    setIsLoadingCategories(true);
    const fetchedCategories = await getFirebaseCategories();
    setCategories(fetchedCategories);
    setIsLoadingCategories(false);

    // Pass fetchedCategories to generate combinations for the price table
    // Note: Price data itself is still local.
    if (fetchedCategories.length > 0) {
        setPriceCombinations(JSON.parse(JSON.stringify(getAllPossibleCombinationsWithPrices(fetchedCategories))));
    } else {
        setPriceCombinations([]); // No categories, no combinations
    }
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
    const { id, ...dataToSave } = categoryDataFromForm; // id might be new or existing

    if (editingCategory && editingCategory.id) { // Editing existing category
       const categoryToUpdate: FurnitureCategory = {
        id: editingCategory.id, 
        name: categoryDataFromForm.name,
        iconName: categoryDataFromForm.iconName,
        imagePlaceholder: categoryDataFromForm.imagePlaceholder,
        imageAiHint: categoryDataFromForm.imageAiHint,
        features: categoryDataFromForm.features || [],
        sizes: categoryDataFromForm.sizes || [],
      };
      success = await updateFirebaseCategory(categoryToUpdate);
      if (success) {
        toast({ title: "Category Updated", description: `Category "${success.name}" has been updated in Firestore.` });
      }
    } else { // Adding new category
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

  // Price saving logic still uses local data via updateOrAddPriceData.
  // It now needs the current list of categories (from Firestore) to correctly interpret feature selections.
  const handleSavePrice = useCallback((priceEntry: PriceDataEntry) => {
    if (categories.length === 0) {
        toast({ title: "Error", description: "Cannot save price, category data not loaded.", variant: "destructive" });
        return;
    }
    // Pass 'categories' (which are from Firestore) to updateOrAddPriceData
    const result = updateOrAddPriceData(priceEntry, categories); 
    if (result) {
      // Refresh price table from local PRICE_DATA, using Firestore categories for combination generation
      setPriceCombinations(JSON.parse(JSON.stringify(getAllPossibleCombinationsWithPrices(categories)))); 
      toast({ title: "Price Updated (Local)", description: `Price for the combination has been saved locally.` });
    } else {
      toast({ title: "Error Saving Price (Local)", description: "Failed to save price data. Check console for errors.", variant: "destructive" });
    }
  }, [toast, categories]); // Add categories to dependency array


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2">
          <div className="flex-grow">
            <CardTitle className="text-2xl flex items-center"><Settings className="mr-2 h-6 w-6 text-primary" />Manage Furniture Categories (Firestore)</CardTitle>
            <CardDescription>Add, edit, or delete furniture categories. Data is stored in Firestore. <br/> Note: Price data below is still managed locally for now but combinations are based on Firestore categories.</CardDescription>
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
                      <TableCell>{category.features?.length || 0}</TableCell>
                      <TableCell>{category.sizes?.length || 0}</TableCell>
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
                This action cannot be undone. This will permanently delete the category
                and all its associated features and sizes from Firestore.
                Associated price data (if any, locally) will also be affected.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete from Firestore
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      
      <Card className="mt-8">
        <CardHeader>
            <CardTitle className="text-2xl flex items-center"><DollarSign className="mr-2 h-6 w-6 text-primary" />Manage Price Data (Local Data)</CardTitle>
            <CardDescription>
                Define or update price ranges. Categories, features, and sizes are from Firestore; prices are saved locally.
                Rows highlighted in light yellow indicate combinations that do not yet have a specific price entry in local data.
                Use horizontal scroll if needed to see all columns.
            </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCategories && categories.length === 0 ? (
             <div className="flex items-center justify-center py-10">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <p>Loading category data for price combinations...</p>
            </div>
          ) : priceCombinations.length === 0 && categories.length > 0 ? (
             <p className="text-muted-foreground text-center py-4">No priceable combinations found. Ensure categories fetched from Firestore have sizes defined. If features exist, they must have options.</p>
          ) : priceCombinations.length === 0 && categories.length === 0 && !isLoadingCategories ? (
             <p className="text-muted-foreground text-center py-4">No categories loaded from Firestore. Add categories first to manage prices.</p>
          ) : (
            <div className="overflow-auto max-h-[70vh] rounded-md border">
              <PriceDataTable priceEntries={priceCombinations} onSavePrice={handleSavePrice} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

