import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReactNode } from "react";

interface TabItem {
  label: string;
  value: string;
  content: ReactNode;
}

interface OrderTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
}

export const OrderTabs = ({ tabs, defaultValue }: OrderTabsProps) => {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.value} className="w-full">
      <TabsList
        className="grid w-full bg-transparent border-b border-border p-0 h-auto rounded-none gap-0"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-secondary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-secondary data-[state=inactive]:text-muted-foreground font-normal font-manrope text-sm py-2 px-0"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
