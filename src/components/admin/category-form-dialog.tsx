"use client";

import type { FurnitureCategory, FurnitureFeatureConfig, FurnitureFeatureOption, FurnitureSizeConfig } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import React, { useState, useCallback } from "react";
import FeatureFormDialog from "./feature-form-dialog";
import SizeFormDialog from "./size-form-dialog";
import { useToast } from "@/hooks/use-toast";
import { generateId } from "@/lib/utils";


const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  iconName: z.string().min(1, "Icon name is required (e.g., Sofa, BedDouble from lucide-react)"),
  imagePlaceholder: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  imageAiHint: z.string().max(50, "AI hint too long").optional(),
});
type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: FurnitureCategory) => void; // This will handle both create and update
  initialData?: FurnitureCategory | null;
}

export default function CategoryFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CategoryFormDialogProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit: handleCategorySubmit,
    reset: resetCategoryForm,
    control,
    formState: { errors: categoryErrors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          iconName: initialData.iconName,
          imagePlaceholder: initialData.imagePlaceholder,
          imageAiHint: initialData.imageAiHint,
        }
      : { name: "", iconName: "", imagePlaceholder: "https://picsum.photos/400/300", imageAiHint: "" },
  });

  const [features, setFeatures] = useState<FurnitureFeatureConfig[]>(initialData?.features || []);
  const [sizes, setSizes] = useState<FurnitureSizeConfig[]>(initialData?.sizes || []);

  const [isFeatureFormOpen, setIsFeatureFormOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FurnitureFeatureConfig | null>(null);

  const [isSizeFormOpen, setIsSizeFormOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<FurnitureSizeConfig | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      const defaultValues = initialData
      ? {
          name: initialData.name,
          iconName: initialData.iconName,
          imagePlaceholder: initialData.imagePlaceholder,
          imageAiHint: initialData.imageAiHint,
        }
      : { name: "", iconName: "", imagePlaceholder: "https://picsum.photos/400/300", imageAiHint: "" };
      resetCategoryForm(defaultValues);
      setFeatures(initialData?.features || []);
      setSizes(initialData?.sizes || []);
    }
  }, [initialData, resetCategoryForm, isOpen]);

  const handleFullSubmit = (data: CategoryFormData) => {
     if (features.length === 0 && initialData?.id !== 'tables') { // Example: tables might not need features
        // This check can be made more generic if needed
        // toast({ title: "Validation Error", description: "A category should ideally have at least one feature.", variant: "destructive" });
        // return;
     }
     if (sizes.length === 0) {
        toast({ title: "Validation Error", description: "A category must have at least one size option.", variant: "destructive" });
        return;
     }

    const completeCategoryData: FurnitureCategory = {
      id: initialData?.id || generateId('cat'), // Use existing ID or generate new
      ...data,
      imagePlaceholder: data.imagePlaceholder || 'https://picsum.photos/400/300', // Default placeholder
      imageAiHint: data.imageAiHint || data.name.toLowerCase(), // Default AI hint
      features,
      sizes,
    };
    onSubmit(completeCategoryData);
    onClose();
  };

  // Feature Management
  const handleAddFeature = () => {
    setEditingFeature(null);
    setIsFeatureFormOpen(true);
  };
  const handleEditFeature = (feature: FurnitureFeatureConfig) => {
    setEditingFeature(feature);
    setIsFeatureFormOpen(true);
  };
  const handleDeleteFeature = (featureId: string) => {
    setFeatures(prev => prev.filter(f => f.id !== featureId));
    toast({ title: "Feature Deleted", description: "The feature and its options have been removed from this category."});
  };
  const handleFeatureFormSubmit = useCallback((data: { name: string }, featureOptions: FurnitureFeatureOption[], featureIdToUpdate?: string) => {
    if (featureIdToUpdate) {
      setFeatures(prev => prev.map(f => f.id === featureIdToUpdate ? { ...f, name: data.name, options: featureOptions } : f));
      toast({ title: "Feature Updated", description: "The feature has been successfully updated."});
    } else {
      const newFeature: FurnitureFeatureConfig = { id: generateId('feat'), name: data.name, options: featureOptions.map(opt => ({...opt, id: opt.id.startsWith('temp-') ? generateId('opt') : opt.id })) };
      setFeatures(prev => [...prev, newFeature]);
      toast({ title: "Feature Added", description: "The feature has been added to this category."});
    }
    setIsFeatureFormOpen(false);
  }, [toast]);


  // Size Management
  const handleAddSize = () => {
    setEditingSize(null);
    setIsSizeFormOpen(true);
  };
  const handleEditSize = (size: FurnitureSizeConfig) => {
    setEditingSize(size);
    setIsSizeFormOpen(true);
  };
  const handleDeleteSize = (sizeId: string) => {
    setSizes(prev => prev.filter(s => s.id !== sizeId));
    toast({ title: "Size Deleted", description: "The size option has been removed."});
  };
  const handleSizeFormSubmit = useCallback((data: { label: string }, sizeIdToUpdate?: string) => {
    if (sizeIdToUpdate) {
      setSizes(prev => prev.map(s => s.id === sizeIdToUpdate ? { ...s, ...data } : s));
      toast({ title: "Size Updated", description: "The size option has been successfully updated."});
    } else {
      const newSize: FurnitureSizeConfig = { id: generateId('size'), ...data };
      setSizes(prev => [...prev, newSize]);
      toast({ title: "Size Added", description: "The size option has been added to this category."});
    }
    setIsSizeFormOpen(false);
  }, [toast]);


  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit" : "Add New"} Furniture Category</DialogTitle>
          <DialogDescription>
            Manage the category details, its features, and available sizes.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(80vh-100px)] pr-6"> {/* Adjusted max height and added padding for scrollbar */}
          <form onSubmit={handleCategorySubmit(handleFullSubmit)} className="space-y-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input id="name" {...register("name")} placeholder="e.g., Sofas, Dining Tables" className={categoryErrors.name ? "border-destructive" : ""} />
                  {categoryErrors.name && <p className="text-sm text-destructive mt-1">{categoryErrors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="iconName">Icon Name (from lucide-react)</Label>
                  <Input id="iconName" {...register("iconName")} placeholder="e.g., Sofa, BedDouble, Table2" className={categoryErrors.iconName ? "border-destructive" : ""} />
                  {categoryErrors.iconName && <p className="text-sm text-destructive mt-1">{categoryErrors.iconName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="imagePlaceholder">Image Placeholder URL</Label>
                  <Input id="imagePlaceholder" {...register("imagePlaceholder")} placeholder="https://picsum.photos/400/300" className={categoryErrors.imagePlaceholder ? "border-destructive" : ""} />
                  {categoryErrors.imagePlaceholder && <p className="text-sm text-destructive mt-1">{categoryErrors.imagePlaceholder.message}</p>}
                </div>
                <div>
                  <Label htmlFor="imageAiHint">Image AI Hint (max 2 words)</Label>
                  <Input id="imageAiHint" {...register("imageAiHint")} placeholder="e.g., living room sofa" className={categoryErrors.imageAiHint ? "border-destructive" : ""} />
                  {categoryErrors.imageAiHint && <p className="text-sm text-destructive mt-1">{categoryErrors.imageAiHint.message}</p>}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="features">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="features">Manage Features</TabsTrigger>
                <TabsTrigger value="sizes">Manage Sizes</TabsTrigger>
              </TabsList>
              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Features</CardTitle>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}><PlusCircle className="mr-2 h-4 w-4" />Add Feature</Button>
                    </div>
                    <CardDescription>Define customizable features for this category.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {features.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No features defined for this category yet.</p>
                    ) : (
                      features.map((feature) => (
                        <div key={feature.id} className="p-3 border rounded-md bg-muted/30 shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-foreground">{feature.name}</h4>
                            <div className="space-x-1">
                              <Button type="button" variant="ghost" size="icon" onClick={() => handleEditFeature(feature)} title="Edit feature"><Edit className="h-4 w-4" /></Button>
                              <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteFeature(feature.id)} title="Delete feature" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </div>
                          <ul className="list-disc list-inside pl-2 space-y-1">
                            {feature.options.map(opt => <li key={opt.id} className="text-sm text-muted-foreground">{opt.label}</li>)}
                            {feature.options.length === 0 && <li className="text-sm text-muted-foreground italic">No options for this feature.</li>}
                          </ul>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="sizes">
                <Card>
                  <CardHeader>
                     <div className="flex justify-between items-center">
                        <CardTitle>Sizes</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddSize}><PlusCircle className="mr-2 h-4 w-4" />Add Size</Button>
                     </div>
                    <CardDescription>Define available sizes for this category.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {sizes.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No sizes defined for this category yet.</p>
                    ) : (
                        sizes.map((size) => (
                            <div key={size.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/30 shadow-sm">
                                <span className="text-sm text-foreground">{size.label}</span>
                                <div className="space-x-1">
                                <Button type="button" variant="ghost" size="icon" onClick={() => handleEditSize(size)} title="Edit size"><Edit className="h-4 w-4" /></Button>
                                <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteSize(size.id)} title="Delete size" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </ScrollArea>
        <DialogFooter className="pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleCategorySubmit(handleFullSubmit)}>{initialData ? "Save Changes" : "Create Category"}</Button>
        </DialogFooter>
      </DialogContent>

      {isFeatureFormOpen && (
        <FeatureFormDialog
          isOpen={isFeatureFormOpen}
          onClose={() => setIsFeatureFormOpen(false)}
          onSubmit={handleFeatureFormSubmit}
          initialData={editingFeature}
          categoryName={control._getWatch('name') || initialData?.name || "this category"}
        />
      )}

      {isSizeFormOpen && (
        <SizeFormDialog
            isOpen={isSizeFormOpen}
            onClose={() => setIsSizeFormOpen(false)}
            onSubmit={handleSizeFormSubmit}
            initialData={editingSize}
            categoryName={control._getWatch('name') || initialData?.name || "this category"}
        />
      )}
    </Dialog>
  );
}
