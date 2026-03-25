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
import { PhoneInput } from "@/components/fields/inputs/phone_input";
import { GoogleMapsAutocomplete } from "@/components/fields/google_maps/google_auto_complete";
import { Form } from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { locationSchema } from "@/components/schema/shared.schema";
import { TBranch } from "../onboarding_utils";
import { Info } from "lucide-react";

const branchFormSchema = z.object({
  branch_name: z.string().min(2, "Branch name must be at least 2 characters"),
  location: locationSchema
    .nullable()
    .refine((v) => Boolean(v?.description), {
      message: "Please select a branch location",
    }),
  email: z.string().email("Please enter a valid email address"),
  contact_person: z.string().min(2, "Please enter the contact person name"),
  contact_phone: z.string().min(10, "Please enter a valid phone number"),
  contact_email: z.string().email("Please enter a valid email address"),
});

type BranchFormValues = z.infer<typeof branchFormSchema>;

const LabelWithTooltip = ({
  label,
  tooltip,
}: {
  label: string;
  tooltip: string;
}) => (
  <span className="inline-flex items-center gap-1">
    {label}
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-3 w-3 cursor-help text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px]">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  </span>
);

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
      contact_person: "",
      contact_phone: "",
      contact_email: "",
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
            contact_person: editBranch.contact_person,
            contact_phone: editBranch.contact_phone,
            contact_email: editBranch.contact_email,
          }
          : {
            branch_name: "",
            location: null,
            email: "",
            contact_person: "",
            contact_phone: "",
            contact_email: "",
          }
      );
    }
  }, [open, editBranch, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSave({
      id: editBranch?.id,
      branch_name: data.branch_name,
      location: data.location,
      email: data.email,
      contact_person: data.contact_person,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email,
    });
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full min-w-3xl rounded-2xl p-5">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-title">
            {editBranch ? "Edit Branch" : "Add Branch"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Branch Details */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-title">Branch Details</p>

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
                  label={
                    <LabelWithTooltip
                      label="Email"
                      tooltip="Client-facing email for this branch, e.g. info@laundrygo.com"
                    />
                  }
                  placeholder="Enter outlet email address"
                  className="rounded-lg px-3 py-2"
                />
              </div>
            </div>

            {/* Contact Person Details */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-title">
                Contact Person Details
              </p>

              <BasicInput<BranchFormValues>
                control={form.control}
                name="contact_person"
                label="Contact Person"
                placeholder="Nicholas Wairimu"
                className="rounded-lg px-3 py-2"
              />

              <div className="grid gap-3 sm:grid-cols-2">



                <BasicInput<BranchFormValues>
                  control={form.control}
                  name="contact_email"
                  label={
                    <LabelWithTooltip
                      label="Email"
                      tooltip="This email will receive the branch invitation"
                    />
                  }
                  placeholder="Enter email address"
                  className="rounded-lg px-3 py-2"
                />
                <PhoneInput<BranchFormValues>
                  control={form.control}
                  name="contact_phone"
                  label="Phone Number"
                  placeholder="Enter number"
                  className="rounded-lg "
                />
              </div>
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
