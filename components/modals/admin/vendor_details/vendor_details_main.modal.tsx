"use client";
import { useVendorModal } from "@/components/context/admin/vendors_context";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorServicesPortfolio } from "./vendor_service_portfolio";
import { VendorOrdersTable } from "@/components/tables/admin/vendor_orders/vendor_orders.table";
import { VendorReviews } from "./vendor_reviews.modal";

export const VendorDetailsModal = () => {
  const { isOpen, closeModal, selectedVendor } = useVendorModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-4xl space-y-0 rounded-3xl bg-background border-none overflow-hidden max-h-[90vh] p-0"
      >
        <DialogTitle className="sr-only">Vendor Profile</DialogTitle>
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
            <h2 className="text-lg font-semibold text-title">Vendor Profile</h2>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-6 space-y-6">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-label">JOINED DATE: </span>
              <span className="font-medium text-title">
                {selectedVendor?.created_at
                  ? format(new Date(selectedVendor.created_at), "dd MMMM yyyy")
                  : ""}
              </span>
            </div>
            <div>
              <span className="text-label">STATUS: </span>
              <Badge variant="secondary">
                {selectedVendor?.status ?? "N/A"}
              </Badge>
            </div>
            <div>
              <span className="text-label">LAST ACTIVE: </span>
              <span className="font-medium text-title">
                {selectedVendor?.last_active
                  ? format(
                      new Date(selectedVendor.last_active),
                      "dd MMM yyyy, HH:mm"
                    )
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-1 flex items-start gap-4">
              <Avatar className="h-20 w-20 ring-2 ring-orange-500">
                <AvatarImage src={selectedVendor?.logo_url ?? ""} />
                <AvatarFallback className="text-xl bg-orange-100 text-orange-700">
                  {selectedVendor?.business_name
                    ? selectedVendor.business_name.charAt(0)
                    : "V"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-2xl font-semibold text-title">
                    {selectedVendor?.business_name}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    {selectedVendor?.services?.map((service) => (
                      <Badge
                        key={service.id}
                        variant="outline"
                        className="text-xs"
                      >
                        {service.service}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-subtitle">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{selectedVendor?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{selectedVendor?.phone ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedVendor?.address ?? "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-primary-blue rounded-lg p-4">
              <p className="text-xs text-label mb-1">Total revenue (Kes)</p>
              <p className="text-2xl font-bold text-title">129,746</p>
            </div>
            <div className="bg-primary-blue rounded-lg p-4">
              <p className="text-xs text-label mb-1">Commission Earned (Kes)</p>
              <p className="text-2xl font-bold text-title">23,086</p>
            </div>
            <div className="bg-primary-blue rounded-lg p-4">
              <p className="text-xs text-label mb-1">Total Refunds (Kes)</p>
              <p className="text-2xl font-bold text-title">13,865</p>
            </div>
          </div>
          <div className="p-2">
            <Tabs defaultValue="portfolio">
              <TabsList className="w-full">
                {[
                  {
                    value: "portfolio",
                    label: "Service Portfolio",
                  },
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
                ))}
              </TabsList>
              <TabsContent value="portfolio">
                <VendorServicesPortfolio />
              </TabsContent>
              <TabsContent value="orders" className="mt-6">
                <VendorOrdersTable vendorId={selectedVendor?.id} />
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <VendorReviews vendorId={selectedVendor?.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
