"use client";

import { faker } from "@faker-js/faker";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivityItem {
  id: string;
  avatar: string;
  message: string;
  time: string;
}

// Generate sample activity data with faker
const generateActivities = (): ActivityItem[] => {
  // Seed faker to get consistent results during development
  faker.seed(123);

  return [
    {
      id: "1",
      avatar: faker.image.avatarGitHub(),
      message: "Fresh Laundry Mart just joined the platform 🎉",
      time: "Just now",
    },
    {
      id: "2",
      avatar: faker.image.avatarGitHub(),
      message: "Order #4582 is delayed — awaiting laundry mart update.",
      time: "59 minutes ago",
    },
    {
      id: "3",
      avatar: faker.image.avatarGitHub(),
      message: "1 new dispute raised by customer for Order #4510.",
      time: "12 hours ago",
    },
    {
      id: "4",
      avatar: faker.image.avatarGitHub(),
      message: "Payment gateway downtime reported earlier today.",
      time: "Today, 11:59 AM",
    },
  ];
};

interface ActivityItemProps {
  avatar: string;
  message: string;
  time: string;
  showConnector?: boolean;
}

const ActivityItemRow = ({
  avatar,
  message,
  time,
  showConnector = true,
}: ActivityItemProps) => (
  <div className="flex items-start gap-2 p-1 rounded-lg relative">
    {/* Avatar */}
    <div className="relative">
      <Avatar className=" rounded-full">
        <AvatarImage src={avatar} alt="User avatar" className="object-cover" />
        <AvatarFallback className="bg-muted text-muted-foreground">
          U
        </AvatarFallback>
      </Avatar>
      {/* Connector line */}
      {showConnector && (
        <div className="absolute left-1/2 top-full w-px h-2 bg-title/10 -translate-x-1/2" />
      )}
    </div>

    {/* Text content */}
    <div className="flex flex-col flex-1 justify-center min-w-0">
      <p className="text-sm font-normal text-title font-manrope leading-[1.5] truncate">
        {message}
      </p>
      <p className="text-xs font-medium text-title/40 font-manrope tracking-[0.5px] leading-[1.4]">
        {time}
      </p>
    </div>
  </div>
);

export function ActivityFeed() {
  const activities = generateActivities();

  return (
    <Card className="bg-card rounded-2xl border-none shadow-none">
      <CardHeader className="">
        <h3 className="font-bold text-base text-title font-manrope leading-[1.6]">
          Activity Feed
        </h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 ">
        {activities.map((activity, index) => (
          <ActivityItemRow
            key={activity.id}
            avatar={activity.avatar}
            message={activity.message}
            time={activity.time}
            showConnector={index < activities.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export default ActivityFeed;
