"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { GoogleMapsAutocomplete } from "@/components/fields/google_maps/google_auto_complete";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { locationSchema } from "@/components/schema/shared.schema";
import { TBranch } from "../onboarding_utils";

const branchFormSchema = z.object({
  branch_name: z.string().min(2, "Branch name must be at least 2 characters"),
  location: locationSchema
    .nullable()
    .refine((v) => Boolean(v?.description), {
      message: "Please select a branch location",
    }),
  email: z.string().email("Please enter a valid email address"),
});

type BranchFormValues = z.infer<typeof branchFormSchema>;

interface AddBranchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (branch: TBranch) => void;
  editBranch?: TBranch | null;
}

export const AddBranchModal: React.FC<AddBranchModalProps> = ({
  open,
  onOpenChange,
  onSave,
  editBranch,
}) => {
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      branch_name: "",
      location: null,
      email: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        editBranch
          ? {
            branch_name: editBranch.branch_name,
            location: editBranch.location,
            email: editBranch.email,
          }
          : { branch_name: "", location: null, email: "" }
      );
    }
  }, [open, editBranch, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSave({
      id: editBranch?.id,
      branch_name: data.branch_name,
      location: data.location,
      email: data.email,
    });
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl p-5">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-title">
            {editBranch ? "Edit Branch" : "Add Branch"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <BasicInput<BranchFormValues>
              control={form.control}
              name="branch_name"
              label="Branch Name"
              placeholder="LaundrySmart"
              className="rounded-lg px-3 py-2"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <GoogleMapsAutocomplete<BranchFormValues>
                control={form.control}
                name="location"
                label="Location"
                placeholder="Enter location"
                className="rounded-lg"
              />
              <BasicInput<BranchFormValues>
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter outlet email address"
                className="rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-9 rounded-lg px-5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 rounded-lg bg-landing-accent px-5 text-title hover:bg-landing-accent/90"
              >
                {editBranch ? "Update" : "Add Branch"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
