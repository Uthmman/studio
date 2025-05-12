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

const optionSchema = z.object({
  label: z.string().min(1, "Label is required"),
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
    defaultValues: initialData || { label: "" },
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ label: "" });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data: OptionFormData) => {
    onSubmit(data, initialData?.id);
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
            Define an option for the feature.
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
