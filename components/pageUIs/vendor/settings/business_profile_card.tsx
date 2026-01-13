import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useVendor } from "@/components/context/vendors/vendor_provider";
import { EditProfileModal } from "@/components/modals/vendors/profile/edit_profile.modal";

export const BusinessProfileCard = () => {
  const { user, vendor } = useVendor();
  const image = undefined;
  const name = "Beatrice Githinji";
  const role = "Super Admin";
  const email = "beatrice@admin.com";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-card  p-4 w-[30%] ">
      {/* Profile Image */}
      <Avatar className="h-48 w-48 border-2 border-border">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback className="text-lg font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Name */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-title">{name}</h3>
        {role && <p className="text-sm text-subtitle">{role}</p>}
      </div>

      {/* Email */}
      <p className="text-sm text-label">{email}</p>

      <EditProfileModal
        trigger={
          <Button
            variant="outline"
            size="sm"
            className="mt-2 bg-transparent shadow-none px-8"
          >
            Edit
          </Button>
        }
      />
    </div>
  );
};
