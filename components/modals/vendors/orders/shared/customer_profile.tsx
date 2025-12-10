import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CustomerProfileProps {
  name: string;
  email: string;
  avatar: string;
}

export const CustomerProfile = ({
  name,
  email,
  avatar,
}: CustomerProfileProps) => {
  return (
    <div className="px-6 space-y-6">
      <p className="text-sm text-muted-foreground font-normal font-manrope">
        Customer Info
      </p>
      <div className="flex items-start gap-2">
        <Avatar className="size-16 border-2 border-primary">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1.5">
          <p className="text-base text-foreground font-normal font-manrope leading-[1.6]">
            {name}
          </p>
          <p className="text-xs text-muted-foreground font-normal font-manrope tracking-[0.5px] leading-[1.4]">
            {email}
          </p>
        </div>
      </div>
    </div>
  );
};
