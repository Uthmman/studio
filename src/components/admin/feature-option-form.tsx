
"use client";

import type { FurnitureFeatureOption } from "@/lib/definitions";
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
import React, { useState, useEffect } from "react";
import NextImage from "next/image";
import { UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const optionSchema = z.object({
  label: z.string().min(1, "Label is required"),
  iconName: z.string().optional(),
  imagePlaceholder: z.string().refine(val => val.startsWith('data:image/') || val.startsWith('http://') || val.startsWith('https://') || val === '', {
    message: "Must be a valid Data URI, URL, or empty",
  }).optional(),
  imageAiHint: z.string().max(50, "AI hint too long").optional(),
});
type OptionFormData = z.infer<typeof optionSchema>;

interface FeatureOptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OptionFormData, optionId?: string) => void;
  initialData?: FurnitureFeatureOption | null;
  featureName: string;
}

const DEFAULT_FEATURE_OPTION_PLACEHOLDER = "https://placehold.co/50x50.png";

// Helper to convert File to Data URI
const fileToDataUri = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

export default function FeatureOptionForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  featureName,
}: FeatureOptionFormProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OptionFormData>({
    resolver: zodResolver(optionSchema),
    defaultValues: initialData
      ? {
          label: initialData.label,
          iconName: initialData.iconName || "",
          imagePlaceholder: initialData.imagePlaceholder || DEFAULT_FEATURE_OPTION_PLACEHOLDER,
          imageAiHint: initialData.imageAiHint || "",
        }
      : { label: "", iconName: "", imagePlaceholder: DEFAULT_FEATURE_OPTION_PLACEHOLDER, imageAiHint: "" },
  });

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imagePlaceholder || DEFAULT_FEATURE_OPTION_PLACEHOLDER);
  const watchedImagePlaceholder = watch("imagePlaceholder");

  useEffect(() => {
    if (isOpen) {
      const defaultVals = initialData
        ? {
            label: initialData.label,
            iconName: initialData.iconName || "",
            imagePlaceholder: initialData.imagePlaceholder || DEFAULT_FEATURE_OPTION_PLACEHOLDER,
            imageAiHint: initialData.imageAiHint || "",
          }
        : { label: "", iconName: "", imagePlaceholder: DEFAULT_FEATURE_OPTION_PLACEHOLDER, imageAiHint: "" };
      reset(defaultVals);
      setSelectedImageFile(null);
      setImagePreview(initialData?.imagePlaceholder || DEFAULT_FEATURE_OPTION_PLACEHOLDER);
    }
  }, [initialData, reset, isOpen]);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (selectedImageFile) {
      objectUrl = URL.createObjectURL(selectedImageFile);
      setImagePreview(objectUrl);
    } else {
      setImagePreview(watchedImagePlaceholder || DEFAULT_FEATURE_OPTION_PLACEHOLDER);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedImageFile, watchedImagePlaceholder]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 1024 * 1024) { // 1MB
        toast({
          title: "Image Too Large",
          description: "Please select an image smaller than 1MB for Data URI storage.",
          variant: "destructive",
        });
        setSelectedImageFile(null);
        event.target.value = "";
        return;
      }
      setSelectedImageFile(file);
    } else {
      setSelectedImageFile(null);
    }
  };

  const handleFormSubmit = async (data: OptionFormData) => {
    let finalImagePlaceholder = data.imagePlaceholder || DEFAULT_FEATURE_OPTION_PLACEHOLDER;
    if (selectedImageFile) {
      try {
        const dataUri = await fileToDataUri(selectedImageFile);
        finalImagePlaceholder = dataUri;
      } catch (error) {
        console.error("Error converting file to Data URI:", error);
        toast({ title: "Image Processing Failed", description: "Could not process image. Previous or default image will be used.", variant: "destructive" });
      }
    }

    const submissionData = {
      ...data,
      imagePlaceholder: finalImagePlaceholder,
      imageAiHint: data.imageAiHint || data.label.toLowerCase().split(" ").slice(0, 2).join(" "),
    };
    onSubmit(submissionData, initialData?.id);
    // onClose(); // Parent handles closing typically
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); setSelectedImageFile(null); } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit" : "Add"} Option for {featureName}
          </DialogTitle>
          <DialogDescription>
            Define an option for the feature. Images are stored as Data URIs (max 1MB).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="label">Option Label</Label>
            <Input
              id="label"
              {...register("label")}
              placeholder="e.g., Red, Large, With Arms"
              className={errors.label ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            {errors.label && (
              <p className="text-sm text-destructive mt-1">
                {errors.label.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="iconName">Icon Name (Lucide)</Label>
            <Input
              id="iconName"
              {...register("iconName")}
              placeholder="e.g., Check, Circle, Zap (optional)"
              className={errors.iconName ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            {errors.iconName && (
              <p className="text-sm text-destructive mt-1">
                {errors.iconName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="optionImage">Option Image (Max 1MB)</Label>
            {imagePreview && (
              <div className="mt-2 relative w-full aspect-square max-w-[100px] rounded-md border overflow-hidden bg-muted">
                <NextImage src={imagePreview} alt="Option preview" fill style={{ objectFit: 'contain' }} sizes="100px" />
              </div>
            )}
            <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => document.getElementById('optionImageUpload')?.click()} className="flex-1" disabled={isSubmitting}>
                    <UploadCloud className="mr-2 h-4 w-4" /> {selectedImageFile ? "Change Image" : "Upload Image"}
                </Button>
                 {selectedImageFile && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => {
                        setSelectedImageFile(null);
                        (document.getElementById('optionImageUpload') as HTMLInputElement).value = "";
                        setValue("imagePlaceholder", initialData?.imagePlaceholder || DEFAULT_FEATURE_OPTION_PLACEHOLDER);
                        setImagePreview(initialData?.imagePlaceholder || DEFAULT_FEATURE_OPTION_PLACEHOLDER);
                    }} disabled={isSubmitting}>
                        Clear
                    </Button>
                )}
            </div>
            <Input
              id="optionImageUpload"
              type="file"
              accept="image/png, image/jpeg, image/gif, image/webp"
              onChange={handleImageFileChange}
              className="hidden"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">Upload PNG, JPG, GIF, WEBP. Max 1MB.</p>
            {errors.imagePlaceholder && <p className="text-sm text-destructive mt-1">{errors.imagePlaceholder.message}</p>}
          </div>
          <input type="hidden" {...register("imagePlaceholder")} />

          <div>
            <Label htmlFor="imageAiHint">Image AI Hint (max 2 words)</Label>
            <Input
              id="imageAiHint"
              {...register("imageAiHint")}
              placeholder="e.g., wood grain"
              className={errors.imageAiHint ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            {errors.imageAiHint && (
              <p className="text-sm text-destructive mt-1">
                {errors.imageAiHint.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { onClose(); setSelectedImageFile(null);}} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (initialData ? "Save Changes" : "Add Option")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
