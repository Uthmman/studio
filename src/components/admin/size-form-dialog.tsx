
"use client";

import type { FurnitureSizeConfig } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import React from "react";

const sizeSchema = z.object({
  label: z.string().min(1, "Size label is required"),
  iconName: z.string().optional(),
  imagePlaceholder: z.string().url("Must be a valid URL for placeholder image").or(z.literal("")).optional(),
  imageAiHint: z.string().max(50, "AI hint too long").optional(),
});
type SizeFormData = z.infer<typeof sizeSchema>;

interface SizeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SizeFormData, sizeId?: string) => void;
  initialData?: FurnitureSizeConfig | null;
  categoryName: string;
}

const DEFAULT_SIZE_PLACEHOLDER = "https://placehold.co/80x80.png";

export default function SizeFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categoryName,
}: SizeFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SizeFormData>({
    resolver: zodResolver(sizeSchema),
    defaultValues: initialData 
      ? { 
          label: initialData.label, 
          iconName: initialData.iconName || "",
          imagePlaceholder: initialData.imagePlaceholder || DEFAULT_SIZE_PLACEHOLDER,
          imageAiHint: initialData.imageAiHint || "",
        } 
      : { label: "", iconName: "", imagePlaceholder: DEFAULT_SIZE_PLACEHOLDER, imageAiHint: "" },
  });

  React.useEffect(() => {
    if (isOpen) {
      const defaultVals = initialData 
        ? { 
            label: initialData.label, 
            iconName: initialData.iconName || "",
            imagePlaceholder: initialData.imagePlaceholder || DEFAULT_SIZE_PLACEHOLDER,
            imageAiHint: initialData.imageAiHint || "",
          } 
        : { label: "", iconName: "", imagePlaceholder: DEFAULT_SIZE_PLACEHOLDER, imageAiHint: "" };
      reset(defaultVals);
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data: SizeFormData) => {
    const submissionData = {
        ...data,
        imagePlaceholder: data.imagePlaceholder || DEFAULT_SIZE_PLACEHOLDER,
        imageAiHint: data.imageAiHint || data.label.toLowerCase().split(" ").slice(0,2).join(" "),
    };
    onSubmit(submissionData, initialData?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit" : "Add"} Size for {categoryName}
          </DialogTitle>
          <DialogDescription>
            Define a size option for this furniture category, including visual details. Use placehold.co for image URLs.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="sizeLabel">Size Label</Label>
            <Input
              id="sizeLabel"
              {...register("label")}
              placeholder="e.g., Small, Queen, 6-seater"
              className={errors.label ? "border-destructive" : ""}
            />
            {errors.label && (
              <p className="text-sm text-destructive mt-1">
                {errors.label.message}
              </p>
            )}
          </div>
           <div>
            <Label htmlFor="sizeIconName">Icon Name (Lucide)</Label>
            <Input
              id="sizeIconName"
              {...register("iconName")}
              placeholder="e.g., Minimize2, Maximize2 (optional)"
              className={errors.iconName ? "border-destructive" : ""}
            />
            {errors.iconName && (
              <p className="text-sm text-destructive mt-1">
                {errors.iconName.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="sizeImagePlaceholder">Image Placeholder URL</Label>
            <Input
              id="sizeImagePlaceholder"
              {...register("imagePlaceholder")}
              placeholder={DEFAULT_SIZE_PLACEHOLDER}
              className={errors.imagePlaceholder ? "border-destructive" : ""}
            />
            {errors.imagePlaceholder && (
              <p className="text-sm text-destructive mt-1">
                {errors.imagePlaceholder.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">Default: {DEFAULT_SIZE_PLACEHOLDER}</p>
          </div>
          <div>
            <Label htmlFor="sizeImageAiHint">Image AI Hint (max 2 words)</Label>
            <Input
              id="sizeImageAiHint"
              {...register("imageAiHint")}
              placeholder="e.g., compact size"
              className={errors.imageAiHint ? "border-destructive" : ""}
            />
            {errors.imageAiHint && (
              <p className="text-sm text-destructive mt-1">
                {errors.imageAiHint.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Save Changes" : "Add Size"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
