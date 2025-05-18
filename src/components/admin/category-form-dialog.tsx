
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
import { PlusCircle, Edit, Trash2, CheckSquare, ListChecks, UploadCloud, Image as ImageIcon } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import FeatureFormDialog from "./feature-form-dialog";
import SizeFormDialog from "./size-form-dialog";
import { useToast } from "@/hooks/use-toast";
import { generateId } from "@/lib/utils";
import NextImage from "next/image"; // Renamed to avoid conflict with Lucide's Image icon
import * as LucideIcons from "lucide-react";
import { uploadImageToFirebaseStorage, deleteImageFromFirebaseStorage } from "@/lib/storage-utils"; // Added

const DEFAULT_PLACEHOLDER_URL = "https://placehold.co/400x300.png";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  iconName: z.string().min(1, "Icon name is required (e.g., Sofa, BedDouble from lucide-react)"),
  // imagePlaceholder is now handled by file upload, URL will be set programmatically.
  // It's not directly part of the RHF Zod schema in the same way if it's a file.
  // However, we will still manage its string (URL) value via RHF.
  imagePlaceholder: z.string().url("Must be a valid URL or will be set by upload").or(z.literal("")).optional(),
  imageAiHint: z.string().max(50, "AI hint too long").optional(),
});
type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: FurnitureCategory) => void;
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
    watch,
    setValue,
    formState: { errors: categoryErrors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          iconName: initialData.iconName,
          imagePlaceholder: initialData.imagePlaceholder || DEFAULT_PLACEHOLDER_URL,
          imageAiHint: initialData.imageAiHint,
        }
      : { name: "", iconName: "", imagePlaceholder: DEFAULT_PLACEHOLDER_URL, imageAiHint: "" },
  });

  const [features, setFeatures] = useState<FurnitureFeatureConfig[]>(initialData?.features || []);
  const [sizes, setSizes] = useState<FurnitureSizeConfig[]>(initialData?.sizes || []);
  
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imagePlaceholder || DEFAULT_PLACEHOLDER_URL);

  const watchedImagePlaceholder = watch("imagePlaceholder");

  useEffect(() => {
    if (isOpen) {
      const defaultVals = initialData
      ? {
          name: initialData.name,
          iconName: initialData.iconName,
          imagePlaceholder: initialData.imagePlaceholder || DEFAULT_PLACEHOLDER_URL,
          imageAiHint: initialData.imageAiHint,
        }
      : { name: "", iconName: "", imagePlaceholder: DEFAULT_PLACEHOLDER_URL, imageAiHint: "" };
      resetCategoryForm(defaultVals);
      setFeatures(initialData?.features || []);
      setSizes(initialData?.sizes || []);
      setSelectedImageFile(null);
      setImagePreview(initialData?.imagePlaceholder || DEFAULT_PLACEHOLDER_URL);
    }
  }, [initialData, resetCategoryForm, isOpen]);

  useEffect(() => {
    // If a new file is selected, update the preview
    if (selectedImageFile) {
      const objectUrl = URL.createObjectURL(selectedImageFile);
      setImagePreview(objectUrl);
      // Clean up the object URL when the component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      // If no file selected, show the placeholder from the form (which might be initialData's or default)
      setImagePreview(watchedImagePlaceholder || DEFAULT_PLACEHOLDER_URL);
    }
  }, [selectedImageFile, watchedImagePlaceholder]);


  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImageFile(event.target.files[0]);
    } else {
      setSelectedImageFile(null);
    }
  };

  const handleFullSubmit = async (data: CategoryFormData) => {
     if (sizes.length === 0) {
        toast({ title: "Validation Error", description: "A category must have at least one size option.", variant: "destructive" });
        return;
     }

    let finalImagePlaceholder = data.imagePlaceholder || DEFAULT_PLACEHOLDER_URL;
    const oldImagePlaceholder = initialData?.imagePlaceholder;

    if (selectedImageFile) {
      const pathPrefix = `furniture_images/categories/${initialData?.id || data.name.toLowerCase().replace(/\s+/g, '-')}`;
      const uploadedUrl = await uploadImageToFirebaseStorage(selectedImageFile, pathPrefix);
      if (uploadedUrl) {
        finalImagePlaceholder = uploadedUrl;
        setValue("imagePlaceholder", uploadedUrl); // Update RHF state
        // Optionally delete old image if it's different and was a Firebase URL
        if (oldImagePlaceholder && oldImagePlaceholder !== uploadedUrl && oldImagePlaceholder.includes('firebasestorage')) {
          await deleteImageFromFirebaseStorage(oldImagePlaceholder);
        }
      } else {
        toast({ title: "Image Upload Failed", description: "Could not upload image. Previous or default image will be used.", variant: "destructive" });
        // Keep finalImagePlaceholder as data.imagePlaceholder (which could be old URL or default)
      }
    }

    const completeCategoryData: FurnitureCategory = {
      id: initialData?.id || generateId('cat'),
      ...data, // contains name, iconName, imageAiHint, and potentially the old imagePlaceholder
      imagePlaceholder: finalImagePlaceholder, // this is now the potentially new URL
      imageAiHint: data.imageAiHint || data.name.toLowerCase().split(" ").slice(0,2).join(" "), 
      features,
      sizes,
    };
    onSubmit(completeCategoryData);
    // onClose(); // onSubmit from parent usually handles closing
  };

  // Feature Management (omitted for brevity - unchanged)
  const handleAddFeature = () => { setEditingFeature(null); setIsFeatureFormOpen(true); };
  const handleEditFeature = (feature: FurnitureFeatureConfig) => { setEditingFeature(feature); setIsFeatureFormOpen(true); };
  const handleDeleteFeature = (featureId: string) => { setFeatures(prev => prev.filter(f => f.id !== featureId)); toast({ title: "Feature Deleted" }); };
  const handleFeatureFormSubmit = useCallback((fd: { name: string; selectionType: 'single' | 'multiple' }, opts: FurnitureFeatureOption[], fId?: string) => {
    const completeOpts = opts.map(opt => ({ ...opt, id: opt.id.startsWith('temp-') ? generateId('opt') : opt.id, iconName: opt.iconName || "", imagePlaceholder: opt.imagePlaceholder || "https://placehold.co/50x50.png", imageAiHint: opt.imageAiHint || opt.label.toLowerCase().split(" ").slice(0,2).join(" ") }));
    if (fId) { setFeatures(prev => prev.map(f => f.id === fId ? { ...f, name: fd.name, selectionType: fd.selectionType, options: completeOpts } : f)); toast({ title: "Feature Updated"});
    } else { const newFeat: FurnitureFeatureConfig = { id: generateId('feat'), name: fd.name, selectionType: fd.selectionType, options: completeOpts }; setFeatures(prev => [...prev, newFeat]); toast({ title: "Feature Added"}); }
    setIsFeatureFormOpen(false);
  }, [toast]);

  // Size Management (omitted for brevity - unchanged)
  const [isSizeFormOpen, setIsSizeFormOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<FurnitureSizeConfig | null>(null);
  const handleAddSize = () => { setEditingSize(null); setIsSizeFormOpen(true); };
  const handleEditSize = (size: FurnitureSizeConfig) => { setEditingSize(size); setIsSizeFormOpen(true); };
  const handleDeleteSize = (sizeId: string) => { setSizes(prev => prev.filter(s => s.id !== sizeId)); toast({ title: "Size Deleted"}); };
  const handleSizeFormSubmit = useCallback((sd: { label: string; iconName?: string; imagePlaceholder?: string; imageAiHint?: string }, sId?: string) => {
    const completeSize = { ...sd, iconName: sd.iconName || "", imagePlaceholder: sd.imagePlaceholder || "https://placehold.co/80x80.png", imageAiHint: sd.imageAiHint || sd.label.toLowerCase().split(" ").slice(0,2).join(" ") };
    if (sId) { setSizes(prev => prev.map(s => s.id === sId ? { ...s, ...completeSize } : s)); toast({ title: "Size Updated"});
    } else { const newSize: FurnitureSizeConfig = { id: generateId('size'), ...completeSize }; setSizes(prev => [...prev, newSize]); toast({ title: "Size Added"}); }
    setIsSizeFormOpen(false);
  }, [toast]);

  // Feature Dialog state (omitted for brevity - unchanged)
  const [isFeatureFormOpen, setIsFeatureFormOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FurnitureFeatureConfig | null>(null);


  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); setSelectedImageFile(null); } }}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit" : "Add New"} Furniture Category</DialogTitle>
          <DialogDescription>
            Manage the category details, its features, available sizes, and image.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(80vh-100px)] pr-6"> 
          {/* Form submission is now handled by the footer button */}
          <div className="space-y-6 py-4">
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
                
                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label htmlFor="categoryImage">Category Image</Label>
                  {imagePreview && (
                    <div className="mt-2 relative w-full aspect-video rounded-md border overflow-hidden bg-muted">
                      <NextImage src={imagePreview} alt="Category preview" fill style={{ objectFit: 'contain' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => document.getElementById('categoryImageUpload')?.click()} className="flex-1">
                        <UploadCloud className="mr-2 h-4 w-4" /> {selectedImageFile ? "Change Image" : "Upload Image"}
                    </Button>
                     {selectedImageFile && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedImageFile(null)}>
                            Clear Selection
                        </Button>
                    )}
                  </div>
                  <Input
                    id="categoryImageUpload"
                    type="file"
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    onChange={handleImageFileChange}
                    className="hidden" // Hidden, triggered by button
                  />
                  <p className="text-xs text-muted-foreground">Upload a PNG, JPG, GIF or WEBP file. Max 2MB recommended.</p>
                </div>
                {/* End Image Upload Section */}

                <div>
                  <Label htmlFor="imageAiHint">Image AI Hint (max 2 words for image generation/search)</Label>
                  <Input id="imageAiHint" {...register("imageAiHint")} placeholder="e.g., living room sofa" className={categoryErrors.imageAiHint ? "border-destructive" : ""} />
                  {categoryErrors.imageAiHint && <p className="text-sm text-destructive mt-1">{categoryErrors.imageAiHint.message}</p>}
                </div>
                {/* Hidden input to store the image URL managed by RHF, potentially updated by upload */}
                <input type="hidden" {...register("imagePlaceholder")} />

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
                      <p className="text-sm text-muted-foreground text-center py-4">No features defined yet.</p>
                    ) : (
                      features.map((feature) => (
                        <div key={feature.id} className="p-3 border rounded-md bg-muted/30 shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              {feature.selectionType === 'multiple' ? <ListChecks className="h-5 w-5 text-primary" /> : <CheckSquare className="h-5 w-5 text-primary" />}
                              <h4 className="font-semibold text-foreground">{feature.name}</h4>
                              <span className="text-xs text-muted-foreground">({feature.selectionType || 'single'} select)</span>
                            </div>
                            <div className="space-x-1">
                              <Button type="button" variant="ghost" size="icon" onClick={() => handleEditFeature(feature)} title="Edit feature"><Edit className="h-4 w-4" /></Button>
                              <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteFeature(feature.id)} title="Delete feature" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </div>
                          <ul className="list-none pl-0 space-y-2">
                            {feature.options.map(opt => {
                              const OptIcon = opt.iconName ? (LucideIcons as any)[opt.iconName] || null : null;
                              return (
                                <li key={opt.id} className="text-sm text-muted-foreground flex items-center space-x-2 p-1 bg-background/50 rounded">
                                  {OptIcon && <OptIcon className="h-4 w-4 text-primary" />}
                                  {opt.imagePlaceholder && (
                                    <div className="relative w-8 h-8 rounded-sm overflow-hidden border">
                                      <NextImage 
                                        src={opt.imagePlaceholder} 
                                        alt={opt.label} 
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 768px) 50vw, 33vw" // Consider adjusting sizes
                                        data-ai-hint={opt.imageAiHint || opt.label}
                                      />
                                    </div>
                                  )}
                                  <span>{opt.label}</span>
                                </li>
                              );
                            })}
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
                        <p className="text-sm text-muted-foreground text-center py-4">No sizes defined yet.</p>
                    ) : (
                        sizes.map((size) => {
                          const SizeIcon = size.iconName ? (LucideIcons as any)[size.iconName] || null : null;
                          return (
                            <div key={size.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/30 shadow-sm">
                                <div className="flex items-center space-x-2">
                                  {SizeIcon && <SizeIcon className="h-5 w-5 text-primary" />}
                                  {size.imagePlaceholder && (
                                    <div className="relative w-10 h-10 rounded-sm overflow-hidden border">
                                      <NextImage 
                                        src={size.imagePlaceholder} 
                                        alt={size.label} 
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 768px) 50vw, 33vw" // Consider adjusting sizes
                                        data-ai-hint={size.imageAiHint || size.label}
                                      />
                                    </div>
                                  )}
                                  <span className="text-sm text-foreground">{size.label}</span>
                                </div>
                                <div className="space-x-1">
                                <Button type="button" variant="ghost" size="icon" onClick={() => handleEditSize(size)} title="Edit size"><Edit className="h-4 w-4" /></Button>
                                <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteSize(size.id)} title="Delete size" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                          );
                        })
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => { onClose(); setSelectedImageFile(null);}} disabled={isSubmitting}>Cancel</Button>
          <Button 
            type="button" 
            onClick={handleCategorySubmit(handleFullSubmit)} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : (initialData ? "Save Changes" : "Create Category")}
          </Button>
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
