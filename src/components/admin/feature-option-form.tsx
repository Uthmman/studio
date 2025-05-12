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
import React from "react"; 

const optionSchema = z.object({
  label: z.string().min(1, "Label is required"),
  iconName: z.string().optional(),
  imagePlaceholder: z.string().url("Must be a valid URL for placeholder image").or(z.literal("")).optional(),
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

export default function FeatureOptionForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  featureName,
}: FeatureOptionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OptionFormData>({
    resolver: zodResolver(optionSchema),
    defaultValues: initialData 
      ? { 
          label: initialData.label,
          iconName: initialData.iconName || "",
          imagePlaceholder: initialData.imagePlaceholder || "https://picsum.photos/50/50",
          imageAiHint: initialData.imageAiHint || "",
        } 
      : { label: "", iconName: "", imagePlaceholder: "https://picsum.photos/50/50", imageAiHint: "" },
  });

  React.useEffect(() => {
    if (isOpen) {
      const defaultVals = initialData 
        ? { 
            label: initialData.label,
            iconName: initialData.iconName || "",
            imagePlaceholder: initialData.imagePlaceholder || "https://picsum.photos/50/50",
            imageAiHint: initialData.imageAiHint || "",
          } 
        : { label: "", iconName: "", imagePlaceholder: "https://picsum.photos/50/50", imageAiHint: "" };
      reset(defaultVals);
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data: OptionFormData) => {
    const submissionData = {
        ...data,
        imagePlaceholder: data.imagePlaceholder || "https://picsum.photos/50/50",
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
            {initialData ? "Edit" : "Add"} Option for {featureName}
          </DialogTitle>
          <DialogDescription>
            Define an option for the feature, including visual details.
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
            />
            {errors.iconName && (
              <p className="text-sm text-destructive mt-1">
                {errors.iconName.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="imagePlaceholder">Image Placeholder URL</Label>
            <Input
              id="imagePlaceholder"
              {...register("imagePlaceholder")}
              placeholder="https://picsum.photos/50/50"
              className={errors.imagePlaceholder ? "border-destructive" : ""}
            />
            {errors.imagePlaceholder && (
              <p className="text-sm text-destructive mt-1">
                {errors.imagePlaceholder.message}
              </p>
            )}
          </div>
           <div>
            <Label htmlFor="imageAiHint">Image AI Hint (max 2 words)</Label>
            <Input
              id="imageAiHint"
              {...register("imageAiHint")}
              placeholder="e.g., wood grain"
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
            <Button type="submit">{initialData ? "Save Changes" : "Add Option"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
