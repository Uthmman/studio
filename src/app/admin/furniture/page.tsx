
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import type { FurnitureCategory, PriceDataEntry, DisplayablePriceEntry } from '@/lib/definitions';
import {
  FURNITURE_CATEGORIES as initialCategoriesData,
  PRICE_DATA as initialPriceData,
  addCategory as addCategoryData,
  updateCategory as updateCategoryData,
  deleteCategory as deleteCategoryData,
  getAllPossibleCombinationsWithPrices,
  updateOrAddPriceData,
} from '@/lib/furniture-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Settings, DollarSign } from 'lucide-react';
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
  const [priceCombinations, setPriceCombinations] = useState<DisplayablePriceEntry[]>([]);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FurnitureCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<FurnitureCategory | null>(null);

  const { toast } = useToast();

  const refreshAdminData = useCallback(() => {
    setCategories(JSON.parse(JSON.stringify(initialCategoriesData)));
    setPriceCombinations(JSON.parse(JSON.stringify(getAllPossibleCombinationsWithPrices())));
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

  const handleDeleteCategory = () => {
    if (!categoryToDelete) return;
    const success = deleteCategoryData(categoryToDelete.id);
    if (success) {
      refreshAdminData(); 
      toast({ title: "Category Deleted", description: `Category "${categoryToDelete.name}" has been deleted.` });
    } else {
      toast({ title: "Error", description: "Failed to delete category.", variant: "destructive" });
    }
    setCategoryToDelete(null);
  };

  const handleCategoryFormSubmit = useCallback((categoryData: FurnitureCategory) => {
    let success: FurnitureCategory | null = null;
    if (editingCategory) {
      const fullCategoryData = { ...editingCategory, ...categoryData };
      success = updateCategoryData(fullCategoryData);
      if (success) {
        toast({ title: "Category Updated", description: `Category "${success.name}" has been updated.` });
      }
    } else {
      const newCategoryData: Omit<FurnitureCategory, 'id' | 'features' | 'sizes'> = {
        name: categoryData.name,
        iconName: categoryData.iconName,
        imagePlaceholder: categoryData.imagePlaceholder,
        imageAiHint: categoryData.imageAiHint,
      };
      const newCat = addCategoryData(newCategoryData);
      const finalNewCat = { ...newCat, features: categoryData.features, sizes: categoryData.sizes };
      success = updateCategoryData(finalNewCat); 
      
      if (success) {
        toast({ title: "Category Added", description: `Category "${success.name}" has been added.` });
      }
    }

    if (success) {
      refreshAdminData();
    } else {
      toast({ title: "Error", description: "Failed to save category.", variant: "destructive" });
    }
    setIsCategoryFormOpen(false);
    setEditingCategory(null);
  }, [editingCategory, toast, refreshAdminData]);

  const handleSavePrice = useCallback((priceEntry: PriceDataEntry) => {
    const result = updateOrAddPriceData(priceEntry);
    if (result) {
      refreshAdminData();
      toast({ title: "Price Updated", description: `Price for the combination has been saved.` });
    } else {
      toast({ title: "Error Saving Price", description: "Failed to save price data. Check console for errors.", variant: "destructive" });
    }
  }, [toast, refreshAdminData]);


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2">
          <div className="flex-grow">
            <CardTitle className="text-2xl flex items-center"><Settings className="mr-2 h-6 w-6 text-primary" />Manage Furniture Categories</CardTitle>
            <CardDescription>Add, edit, or delete furniture categories, their features, and sizes.</CardDescription>
          </div>
          <Button onClick={handleAddCategory} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
          </Button>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No categories found. Add one to get started!</p>
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
                      <TableCell>{category.features.length}</TableCell>
                      <TableCell>{category.sizes.length}</TableCell>
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
                and all its associated features, sizes, and price data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      
      <Card className="mt-8">
        <CardHeader>
            <CardTitle className="text-2xl flex items-center"><DollarSign className="mr-2 h-6 w-6 text-primary" />Manage Price Data</CardTitle>
            <CardDescription>
                Define or update price ranges for every possible combination of furniture category, features, and sizes.
                Rows highlighted in light yellow indicate combinations that do not yet have a specific price entry.
                Use horizontal scroll if needed to see all columns.
            </CardDescription>
        </CardHeader>
        <CardContent>
          {/* This div now controls scrolling and max-height for the PriceDataTable */}
          <div className="overflow-auto max-h-[70vh] rounded-md border">
            <PriceDataTable priceEntries={priceCombinations} onSavePrice={handleSavePrice} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
