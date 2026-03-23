"use client";

import { useState } from "react";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { PhoneInput } from "@/components/fields/inputs/phone_input";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useOnboarding } from "../onboarding_context";
import { TBranch, TBranchInformation } from "../onboarding_utils";
import { AddBranchModal } from "./add_branch_modal";

export const OnboardingBranchInformation = () => {
  const { branch_information_form } = useOnboarding();
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const branches = branch_information_form.watch("branches");

  const handleAddBranch = (branch: TBranch) => {
    if (editIndex !== null) {
      const updated = [...branches];
      updated[editIndex] = branch;
      branch_information_form.setValue("branches", updated, {
        shouldValidate: true,
      });
      setEditIndex(null);
    } else {
      branch_information_form.setValue("branches", [...branches, branch], {
        shouldValidate: true,
      });
    }
  };

  const handleRemoveBranch = (index: number) => {
    branch_information_form.setValue(
      "branches",
      branches.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const handleEditBranch = (index: number) => {
    setEditIndex(index);
    setModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditIndex(null);
    setModalOpen(true);
  };

  return (
    <Form {...branch_information_form}>
      <form className="flex flex-col gap-4">
        <div>
          <h2 className="font-dm-sans text-xl font-semibold text-title sm:text-2xl">
            Branch Information
          </h2>
          <p className="mt-1 text-sm text-landing-primary">
            Complete your profile details
          </p>
        </div>

        {/* Branches section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-title">Branches</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenNew}
              className="h-8 gap-1.5 rounded-lg border-border px-3 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Branch
            </Button>
          </div>

          {branches.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No branches added yet. Click &quot;Add Branch&quot; to get
              started.
            </p>
          )}

          {branches.map((branch, index) => (
            <div
              key={branch.id ?? index}
              className="flex items-center justify-between border-b border-border py-2 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => handleEditBranch(index)}
                className="text-sm text-title hover:underline"
              >
                {branch.branch_name}
                {branch.location?.main_text
                  ? ` ${branch.location.main_text}`
                  : ""}
              </button>
              <button
                type="button"
                onClick={() => handleRemoveBranch(index)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:text-destructive"
                aria-label={`Remove ${branch.branch_name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {branch_information_form.formState.errors.branches?.message && (
            <p className="text-sm text-destructive">
              {branch_information_form.formState.errors.branches.message}
            </p>
          )}
        </div>

        {/* Contact Person Details */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-title">
            Contact Person Details
          </p>

          <BasicInput<TBranchInformation>
            control={branch_information_form.control}
            name="contact_person"
            label="Contact Person"
            placeholder="Nicholas Wairimu"
            className="rounded-lg px-3 py-2"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <PhoneInput<TBranchInformation>
              control={branch_information_form.control}
              name="contact_phone"
              label="Phone Number"
              placeholder="Enter number"
              className="rounded-lg"
            />
            <BasicInput<TBranchInformation>
              control={branch_information_form.control}
              name="contact_email"
              label="Email"
              placeholder="Enter email address"
              className="rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </form>

      <AddBranchModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditIndex(null);
        }}
        onSave={handleAddBranch}
        editBranch={editIndex !== null ? branches[editIndex] : null}
      />
    </Form>
  );
};
