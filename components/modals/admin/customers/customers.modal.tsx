"use client";
import { useCustomerModal } from "@/components/context/customers_modal_provider";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import {
  useFetchCustomerById,
  useFetchCustomerOrderStats,
} from "@/api/admin/customers/use_customers";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerOrdersTable } from "@/components/tables/admin/customer_orders/customer_orders.table";
import { CustomerReview } from "./customer_review";
export const CustomerModal = () => {
  const { isOpen, closeModal, selectedCustomerId } = useCustomerModal();
  const { data: customer, isPending } =
    useFetchCustomerById(selectedCustomerId);
  const { data: orderStats } = useFetchCustomerOrderStats(selectedCustomerId);
  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-4xl space-y-0 rounded-3xl bg-background border-none overflow-hidden max-h-[90vh] p-0"
      >
        <DialogTitle className="sr-only">Customer Profile</DialogTitle>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={closeModal}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-title">
              Customer Profile
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Save
            </Button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-6 space-y-6">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-label">JOINED DATE: </span>
              <span className="font-medium text-title">
                {customer?.created_at
                  ? format(new Date(customer.created_at), "dd MMMM yyyy")
                  : ""}
              </span>
            </div>
            <div>
              <span className="text-label">STATUS: </span>
              <span className="font-medium text-green-600">Active</span>
            </div>
            {/* <div>
              <span className="text-label">LAST ACTIVE: </span>
              <span className="font-medium text-title">{}</span>
            </div> */}
          </div>
          <div className="flex items-start gap-6">
            <div className="flex-1 flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={customer?.avatar_url ?? ""} />
                <AvatarFallback className="text-xl">
                  {customer?.full_name ? customer.full_name.charAt(0) : "H"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-3 flex-1">
                <h3 className="text-2xl font-semibold text-title">
                  {customer?.full_name}
                </h3>
                <div className="space-y-2 text-sm text-subtitle flex justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{customer?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{customer?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{customer?.address ?? "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-primary-blue rounded-lg p-4 w-full">
              <p className="text-xs text-label mb-1">Total Money Spent (Kes)</p>
              <p className="text-2xl font-bold text-title">
                {orderStats?.total_spent.toLocaleString() || "0"}
              </p>
            </div>
            <div className="bg-primary-blue rounded-lg p-4 w-full">
              <p className="text-xs text-label mb-1">Total Refunds (Kes)</p>
              <p className="text-2xl font-bold text-title">
                {orderStats?.total_refunds.toLocaleString() || "0"}
              </p>
            </div>
          </div>
          <Tabs defaultValue="orders">
            <TabsList className="w-full">
              {
                //value, label ,Order, Review
                [
                  {
                    value: "orders",
                    label: "Orders",
                  },
                  {
                    value: "reviews",
                    label: "Reviews",
                  },
                ].map((value) => (
                  <TabsTrigger
                    key={value.value}
                    value={value.value}
                    className="px-4 py-2 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-secondary data-[state=active]:text-secondary hover:text-secondary text-foreground"
                  >
                    {value.label}
                  </TabsTrigger>
                ))
              }
            </TabsList>
            <TabsContent value="orders" className="mt-6">
              <CustomerOrdersTable
                customerId={selectedCustomerId ?? undefined}
              />
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <CustomerReview customerId={selectedCustomerId ?? undefined} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
