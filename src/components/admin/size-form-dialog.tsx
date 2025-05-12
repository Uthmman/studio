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
});
type SizeFormData = z.infer<typeof sizeSchema>;

interface SizeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SizeFormData, sizeId?: string) => void;
  initialData?: FurnitureSizeConfig | null;
  categoryName: string;
}

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
    defaultValues: initialData || { label: "" },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(initialData || { label: "" });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data: SizeFormData) => {
    onSubmit(data, initialData?.id);
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
            Define a size option for this furniture category.
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
