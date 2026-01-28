import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useVendor } from "@/components/context/vendors/vendor_provider";
import { EditProfileModal } from "@/components/modals/vendors/profile/edit_profile.modal";
import { useAuth } from "@/components/context/auth_provider";
export const BusinessProfileCard = () => {
  const { user } = useAuth();
  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-card  p-4 w-[30%] ">
      <Avatar className="h-48 w-48 border-2 border-border">
        <AvatarImage src={user?.avatar_url ?? ""} alt={user?.full_name || ""} />
        <AvatarFallback className="text-lg font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-title">{user?.full_name}</h3>
        {user?.vendor_users && (
          <p className="text-sm text-subtitle capitalize">
            {user?.vendor_users[0]?.role}
          </p>
        )}
      </div>
      <p className="text-sm text-label">{user?.email}</p>
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
