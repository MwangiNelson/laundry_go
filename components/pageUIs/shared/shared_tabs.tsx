import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TabData {
  value: string;
  label: string;
  content?: React.ComponentType;
}

interface SharedTabsProps extends React.ComponentProps<typeof Tabs> {
  tabs: TabData[];
  defaultValue?: string;
  className?: string;
  children?: React.ReactNode;
  contents?: React.ReactElement;
}

// Underline tab list component
interface UnderlineTabListProps extends React.ComponentProps<typeof Tabs> {
  tabs: { value: string; label: string }[];
}

export const UnderlineTabList = ({ tabs, ...props }: UnderlineTabListProps) => {
  return (
    <div className="w-full border-b-2">
      <TabsList className="bg-transparent p-0 gap-0 h-auto" {...props}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="px-4 py-2 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary hover:text-primary text-foreground"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};

export const SharedTabs = ({
  tabs,
  defaultValue,
  className,
  ...props
}: SharedTabsProps) => {
  const defaultTab = defaultValue || tabs[0]?.value || "";

  return (
    <Tabs
      {...props}
      defaultValue={defaultTab}
      className={className || "w-full"}
    >
      <div className="w-full bg-muted rounded-lg">
        <TabsList className="bg-transparent p-2 gap-1 h-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-primary px-6  data-[state=active]:text-background bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors duration-200"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {props.children
        ? props.children
        : tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="mt-4">{tab.content && <tab.content />}</div>
            </TabsContent>
          ))}
    </Tabs>
  );
};
export const CustomTabList = ({ tabs }: { tabs: TabData[] }) => {
  return (
    <TabsList className="p-2 gap-1 h-auto bg-foreground/10 rounded-lg">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="data-[state=active]:bg-card/70 px-6  data-[state=active]:text-foreground  text-foreground 
           hover:bg-card/70 transition-colors duration-200"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
