"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { PhoneInput } from "@/components/fields/inputs/phone_input";
import { X } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { locationSchema } from "@/components/schema/shared.schema";
import { ProfilePhotoUpload } from "@/components/fields/files/profile_photo_upload";
import { useAuth } from "@/components/context/auth_provider";
import { useUpdateUserProfile } from "@/api/auth/use_auth";
import { get_profile } from "@/api/supabase/functions";

type EditProfileModalProps = {
  trigger?: React.ReactNode;
};
const schema = z.object({
  username: z.string().min(2).max(50),
  phone: z.string().min(7).max(15),
  email: z.string().email(),
  location: locationSchema.optional(),
  profile_photo: z.instanceof(File).optional(),
});

type EditProfileFormData = z.infer<typeof schema>;

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  trigger,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useAuth();

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      phone: "",
      email: "",
    },
  });
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.full_name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);
  const handleClose = () => {
    setOpen(false);
  };
  const { mutateAsync: updateUser, isPending } = useUpdateUserProfile();
  const handleComplete = async (data: EditProfileFormData) => {
    if (!user?.id) return;
    await updateUser({
      user_id: user.id,
      full_name: data.username,
      phone: data.phone,
      email: data.email,
      profile_photo: data.profile_photo,
      current_avatar_url: get_profile(user.id),
    });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild className="cursor-pointer">
          {trigger}
        </DialogTrigger>
      ) : null}

      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl p-0 rounded-lg bg-background border border-border overflow-hidden"
      >
        <DialogTitle className="sr-only">Edit Details</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleComplete)}>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-title">Edit Profile</h2>
                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground"
                  type={"button"}
                >
                  <X size={24} />
                </button>
              </div>

              <div className=" max-h-[50vh] overflow-y-auto space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <BasicInput
                    name="username"
                    label="Username"
                    placeholder="Beatrice Githinji"
                    control={form.control}
                  />
                  <PhoneInput
                    name="phone"
                    label="Phone Number"
                    placeholder="12345678"
                    control={form.control}
                  />
                  <BasicInput
                    name="email"
                    label="Email Address"
                    placeholder="beatrice@admin.com"
                    control={form.control}
                  />
                </div>

                <div className="flex flex-col items-center gap-4 py-6">
                  <h3 className="text-base font-semibold text-title">
                    Edit Profile
                  </h3>
                  <ProfilePhotoUpload
                    name="profile_photo"
                    description="PNG, JPG or GIF (max 3MB)"
                    control={form.control}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  loading={isPending}
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
