"use client";

import type { FurnitureFeatureConfig, FurnitureFeatureOption } from "@/lib/definitions";
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
import { Trash2, Edit, PlusCircle } from "lucide-react";
import React, { useState, useCallback } from "react";
import FeatureOptionForm from "./feature-option-form";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import * as LucideIcons from "lucide-react";

const featureSchema = z.object({
  name: z.string().min(1, "Feature name is required"),
});
type FeatureFormData = z.infer<typeof featureSchema>;

interface FeatureFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeatureFormData, options: FurnitureFeatureOption[], featureId?: string) => void;
  initialData?: FurnitureFeatureConfig | null;
  categoryName: string;
}

export default function FeatureFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categoryName,
}: FeatureFormDialogProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit: handleFeatureSubmit,
    reset: resetFeatureForm,
    formState: { errors: featureErrors },
  } = useForm<FeatureFormData>({
    resolver: zodResolver(featureSchema),
    defaultValues: initialData || { name: "" },
  });

  const [options, setOptions] = useState<FurnitureFeatureOption[]>(initialData?.options || []);
  const [isOptionFormOpen, setIsOptionFormOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<FurnitureFeatureOption | null>(null);

  React.useEffect(() => {
    if (isOpen) {
        resetFeatureForm(initialData || { name: "" });
        setOptions(initialData?.options || []);
    }
  }, [initialData, resetFeatureForm, isOpen]);

  const handleFullFormSubmit = (data: FeatureFormData) => {
    if (options.length === 0) {
        toast({
            title: "Validation Error",
            description: "A feature must have at least one option.",
            variant: "destructive",
        });
        return;
    }
    onSubmit(data, options, initialData?.id);
    onClose();
  };

  const handleAddOption = () => {
    setEditingOption(null);
    setIsOptionFormOpen(true);
  };

  const handleEditOption = (option: FurnitureFeatureOption) => {
    setEditingOption(option);
    setIsOptionFormOpen(true);
  };

  const handleDeleteOption = (optionId: string) => {
    setOptions(prev => prev.filter(opt => opt.id !== optionId));
    toast({ title: "Option Deleted", description: "The option has been removed from this feature." });
  };

  const handleOptionFormSubmit = useCallback((
    data: { label: string; iconName?: string; imagePlaceholder?: string; imageAiHint?: string }, 
    optionIdToUpdate?: string
  ) => {
    if (optionIdToUpdate) {
      setOptions(prev => prev.map(opt => opt.id === optionIdToUpdate ? { ...opt, ...data } : opt));
      toast({ title: "Option Updated", description: "The option has been successfully updated." });
    } else {
      const tempId = `temp-option-${Date.now()}`; 
      setOptions(prev => [...prev, { 
        id: tempId, 
        label: data.label,
        iconName: data.iconName || "",
        imagePlaceholder: data.imagePlaceholder || "https://picsum.photos/50/50",
        imageAiHint: data.imageAiHint || data.label.toLowerCase().split(" ").slice(0,2).join(" ")
      }]);
      toast({ title: "Option Added", description: "The option has been added to this feature." });
    }
    setIsOptionFormOpen(false);
  }, [toast]);


  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit" : "Add"} Feature for {categoryName}
          </DialogTitle>
          <DialogDescription>
            Define the feature and its available options.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFeatureSubmit(handleFullFormSubmit)} className="space-y-6 py-4">
          <div>
            <Label htmlFor="featureName">Feature Name</Label>
            <Input
              id="featureName"
              {...register("name")}
              placeholder="e.g., Material, Color, Style"
              className={featureErrors.name ? "border-destructive" : ""}
            />
            {featureErrors.name && (
              <p className="text-sm text-destructive mt-1">
                {featureErrors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Feature Options</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Option
              </Button>
            </div>
            {options.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">No options added yet. A feature must have at least one option.</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3 bg-muted/50">
                {options.map((option) => {
                  const IconComponent = option.iconName ? (LucideIcons as any)[option.iconName] || LucideIcons.Minus : null;
                  return (
                    <li key={option.id} className="flex items-center justify-between p-2 bg-background rounded-md shadow-sm">
                      <div className="flex items-center space-x-2">
                        {IconComponent && <IconComponent className="h-4 w-4 text-muted-foreground" />}
                        {option.imagePlaceholder && (
                          <div className="relative w-10 h-10 rounded overflow-hidden border">
                            <Image 
                              src={option.imagePlaceholder} 
                              alt={option.label} 
                              fill
                              style={{ objectFit: 'cover' }}
                              sizes="(max-width: 768px) 50vw, 33vw"
                              data-ai-hint={option.imageAiHint || option.label}
                            />
                          </div>
                        )}
                        <span className="text-sm">{option.label}</span>
                      </div>
                      <div className="space-x-1">
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleEditOption(option)} title="Edit option">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteOption(option.id)} title="Delete option" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Save Changes" : "Add Feature"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
      {isOptionFormOpen && (
        <FeatureOptionForm
          isOpen={isOptionFormOpen}
          onClose={() => setIsOptionFormOpen(false)}
          onSubmit={handleOptionFormSubmit}
          initialData={editingOption}
          featureName={initialData?.name || "this feature"}
        />
      )}
    </Dialog>
  );
}