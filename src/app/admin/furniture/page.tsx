"use client";

import React, { useState, useCallback, useEffect } from 'react';
import type { FurnitureCategory, FurnitureFeatureConfig, FurnitureFeatureOption, FurnitureSizeConfig } from '@/lib/definitions';
import {
  FURNITURE_CATEGORIES as initialCategories,
  addCategory as addCategoryData,
  updateCategory as updateCategoryData,
  deleteCategory as deleteCategoryData,
  addFeatureToCategory as addFeatureData,
  updateFeatureInCategory as updateFeatureData,
  deleteFeatureFromCategory as deleteFeatureData,
  addOptionToFeature as addOptionData,
  updateOptionInFeature as updateOptionData,
  deleteOptionFromFeature as deleteOptionData,
  addSizeToCategory as addSizeData,
  updateSizeInCategory as updateSizeData,
  deleteSizeFromCategory as deleteSizeData,
} from '@/lib/furniture-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, ShieldAlert, Settings } from 'lucide-react';
import CategoryFormDialog from '@/components/admin/category-form-dialog';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminFurniturePage() {
  const [categories, setCategories] = useState<FurnitureCategory[]>([]);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FurnitureCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<FurnitureCategory | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    // Load initial data into state. This ensures we are working with a copy
    // that can be updated to reflect changes in the UI during the session.
    setCategories(JSON.parse(JSON.stringify(initialCategories)));
  }, []);

  const refreshCategories = () => {
    // Create a deep copy to ensure re-render
    setCategories(JSON.parse(JSON.stringify(initialCategories)));
  };

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
      refreshCategories(); // Refresh from the source of truth
      toast({ title: "Category Deleted", description: `Category "${categoryToDelete.name}" has been deleted.` });
    } else {
      toast({ title: "Error", description: "Failed to delete category.", variant: "destructive" });
    }
    setCategoryToDelete(null);
  };

  const handleCategoryFormSubmit = useCallback((categoryData: FurnitureCategory) => {
    let success: FurnitureCategory | null = null;
    if (editingCategory) { // Update existing category
      // Preserve existing features/sizes if not managed by form directly yet
      const fullCategoryData = { ...editingCategory, ...categoryData };
      success = updateCategoryData(fullCategoryData);
      if (success) {
        toast({ title: "Category Updated", description: `Category "${success.name}" has been updated.` });
      }
    } else { // Add new category
      const newCategoryData: Omit<FurnitureCategory, 'id' | 'features' | 'sizes'> = {
        name: categoryData.name,
        iconName: categoryData.iconName,
        imagePlaceholder: categoryData.imagePlaceholder,
        imageAiHint: categoryData.imageAiHint,
      };
      // The form now handles features and sizes, so 'addCategoryData' might need adjustment
      // or 'categoryData' from the form is already complete.
      // For simplicity, assuming categoryData from form IS the complete structure.
      const newCat = addCategoryData(newCategoryData); // This function adds an empty category
      // Then we update it with features and sizes from the form
      const finalNewCat = { ...newCat, features: categoryData.features, sizes: categoryData.sizes };
      success = updateCategoryData(finalNewCat); // Effectively saving the features/sizes
      
      if (success) {
        toast({ title: "Category Added", description: `Category "${success.name}" has been added.` });
      }
    }

    if (success) {
      refreshCategories();
    } else {
      toast({ title: "Error", description: "Failed to save category.", variant: "destructive" });
    }
    setIsCategoryFormOpen(false);
    setEditingCategory(null);
  }, [editingCategory, toast]);


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Manage Furniture Categories</CardTitle>
            <CardDescription>Add, edit, or delete furniture categories, their features, and sizes.</CardDescription>
          </div>
          <Button onClick={handleAddCategory}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
          </Button>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No categories found. Add one to get started!</p>
          ) : (
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
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.iconName}</TableCell>
                    <TableCell>{category.features.length}</TableCell>
                    <TableCell>{category.sizes.length}</TableCell>
                    <TableCell className="text-right space-x-2">
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
            <CardTitle className="text-xl flex items-center"><Settings className="mr-2 h-5 w-5 text-primary" />Price Data Management</CardTitle>
            <CardDescription>
                Price data is linked to categories, features, and sizes. Deleting any of these will also affect or remove related price entries.
                Directly editing individual price entries is not supported in this interface. To modify prices, you would typically adjust the underlying data source (currently in-memory in <code>furniture-data.ts</code>).
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                For this demonstration, price data management is simplified. Focus is on managing the structure (categories, features, sizes) that price data depends on.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
