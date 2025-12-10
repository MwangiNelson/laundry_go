import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  title: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar: string;
  avatarBorderColor?: "accent" | "secondary" | "primary";
}

export const ProfileCard = ({
  title,
  name,
  email,
  phone,
  address,
  avatar,
  avatarBorderColor = "primary",
}: ProfileCardProps) => {
  const borderColorMap = {
    accent: "border-accent",
    secondary: "border-secondary",
    primary: "border-primary",
  };

  const avatarBgMap = {
    accent: "bg-accent/10 text-accent",
    secondary: "bg-secondary/10 text-secondary",
    primary: "bg-primary/10 text-primary",
  };

  const getInitials = (fullName: string) =>
    fullName
      .split(" ")
      .map((n) => n[0])
      .join("");

  return (
    <div className="bg-card rounded-2xl p-6 space-y-6">
      <p className="text-sm text-muted-foreground font-normal font-manrope">
        {title}
      </p>

      <div className="space-y-4">
        {/* Profile Header with Avatar */}
        <div className="flex items-start gap-2">
          <Avatar
            className={cn(
              "size-16 border-2",
              borderColorMap[avatarBorderColor]
            )}
          >
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback
              className={cn("font-medium", avatarBgMap[avatarBorderColor])}
            >
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1.5">
            <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
              {name}
            </p>
            {email && (
              <p className="text-xs text-muted-foreground font-normal font-manrope tracking-[0.5px] leading-[1.4]">
                {email}
              </p>
            )}
          </div>
        </div>

        {/* Phone Info */}
        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="size-6 text-card-foreground" />
            <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
              {phone}
            </p>
          </div>
        )}

        {/* Address Info */}
        {address && (
          <div className="flex items-start gap-2">
            <MapPin className="size-6 text-card-foreground shrink-0" />
            <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
              {address}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
