"use client";

import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Pencil, Trash2, Building2 } from "lucide-react";
import { useOnboarding } from "../onboarding_context";
import { TBranch } from "../onboarding_utils";
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

          {/* Empty state */}
          {branches.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No branches added yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Click &quot;Add Branch&quot; to add your first branch
              </p>
            </div>
          )}

          {/* Branch cards */}
          {branches.map((branch, index) => (
            <div
              key={branch.id ?? index}
              className="rounded-xl border border-border p-4"
            >
              {/* Branch header with actions */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold text-title">
                      {branch.branch_name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {branch.location?.description ?? branch.location?.main_text ?? "No location set"}
                      {branch.email ? ` · ${branch.email}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBranch(index)}
                    className="h-8 gap-1.5 rounded-lg px-3 text-xs"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveBranch(index)}
                    className="h-8 gap-1.5 rounded-lg px-3 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Contact person nested inside card */}
              <div className="ml-6.5 mt-3 rounded-lg bg-muted/50 px-4 py-3">
                <p className="text-sm font-medium text-title">
                  {branch.contact_person}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {branch.contact_phone}
                  {branch.contact_email ? ` · ${branch.contact_email}` : ""}
                </p>
              </div>
            </div>
          ))}

          {branch_information_form.formState.errors.branches?.message && (
            <p className="text-sm text-destructive">
              {branch_information_form.formState.errors.branches.message}
            </p>
          )}
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
