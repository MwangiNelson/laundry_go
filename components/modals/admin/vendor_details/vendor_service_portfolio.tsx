import {
  useFetchVendorMainServices,
  useFetchVendorServicePrices,
} from "@/api/admin/vendors/use_fetch_vendors";
import { useVendorModal } from "@/components/context/admin/vendors_context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {};

export const VendorServicesPortfolio = (props: Props) => {
  const { isOpen, closeModal, selectedVendor } = useVendorModal();

  const { data: services, isLoading } = useFetchVendorMainServices(
    selectedVendor?.id ?? ""
  );

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );

  // Set the first service as selected when services load
  useEffect(() => {
    if (services && services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].main_service_id);
    }
  }, [services, selectedServiceId]);

  const { data: servicePrices, isLoading: isLoadingPrices } =
    useFetchVendorServicePrices(
      selectedVendor?.id ?? "",
      selectedServiceId ?? 0
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No services found</p>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue={services[0]?.main_service_id.toString() ?? ""}
      onValueChange={(value) => setSelectedServiceId(Number(value))}
    >
      <TabsList className="w-full">
        {services.map((value) => (
          <TabsTrigger
            key={value.main_service_id}
            value={value.main_service_id.toString()}
            className="px-4 py-2 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-secondary data-[state=active]:text-secondary hover:text-secondary text-foreground"
          >
            {value.main_service_name}
          </TabsTrigger>
        ))}
      </TabsList>
      {services.map((service) => (
        <TabsContent
          key={service.main_service_id}
          value={service.main_service_id.toString()}
          className="mt-4"
        >
          {isLoadingPrices ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead className="text-right">Price (Kes)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicePrices && servicePrices.length > 0 ? (
                  servicePrices.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.service_name}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.price.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8">
                      <p className="text-muted-foreground">
                        No pricing information available
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};
