"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFetchRiders, Rider } from "@/api/vendor/riders/use_fetch_rider";
import { useAuth } from "@/components/context/auth_provider";
import { useAssignRider } from "@/api/vendor/order/use_assign_rider";
import { Skeleton } from "@/components/ui/skeleton";

type AssignRiderModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
};

export const AssignRiderModal: React.FC<AssignRiderModalProps> = ({
  open,
  onOpenChange,
  orderId,
}) => {
  const { vendor_id } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);

  const { data, isLoading } = useFetchRiders({
    vendor_id: vendor_id!,
    search,
    page,
    size: 10,
    status: "active",
  });

  const { mutateAsync: assignRider, isPending } = useAssignRider();

  const handleAssign = async () => {
    if (!selectedRiderId) return;

    await assignRider({ order_id: orderId, rider_id: selectedRiderId });
    onOpenChange(false);
    setSelectedRiderId(null);
    setSearch("");
    setPage(1);
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedRiderId(null);
    setSearch("");
    setPage(1);
  };

  const riders = data?.data || [];
  const totalPages = Math.ceil((data?.total_count || 0) / 10);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-3xl p-0 rounded-3xl bg-background border border-foreground/10 overflow-hidden"
      >
        <DialogTitle className="sr-only">Rider Assignment</DialogTitle>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground font-manrope">
              Rider Assignment
            </h2>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              onClick={handleClose}
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl p-6 space-y-6">
            <div className="space-y-4">
              {/* Title */}
              <h3 className="text-lg font-bold text-foreground font-manrope">
                Select Motorist to Assign
              </h3>

              {/* Search */}
              <div className="flex justify-end">
                <div className="relative w-36">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-8 border-border bg-white/40"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="max-h-[50vh] overflow-clip">
                <div className="flex flex-col">
                  {/* Table Header */}
                  <div className="grid grid-cols-[24px_1fr_150px_150px] items-center min-h-[40px] border-b border-foreground/20 py-2">
                    <div />
                    <p className="text-sm text-muted-foreground font-normal font-manrope px-3">
                      Rider
                    </p>
                    <p className="text-sm text-muted-foreground font-normal font-manrope px-3">
                      Ongoing Orders
                    </p>
                    <p className="text-sm text-muted-foreground font-normal font-manrope px-3">
                      Vehicle
                    </p>
                  </div>

                  {/* Table Body */}
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[24px_1fr_150px_150px] items-center min-h-[40px] border-b border-foreground/5 py-2"
                      >
                        <Skeleton className="size-4 rounded" />
                        <div className="flex items-center gap-2 px-3">
                          <Skeleton className="size-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-8 px-3" />
                        <Skeleton className="h-4 w-20 px-3" />
                      </div>
                    ))
                  ) : riders.length > 0 ? (
                    riders.map((rider: Rider) => (
                      <div
                        key={rider.id}
                        className={`grid grid-cols-[24px_1fr_150px_150px] items-center min-h-[40px] border-b border-foreground/5 py-2 cursor-pointer hover:bg-primary/5 ${
                          selectedRiderId === rider.id ? "bg-primary/10" : ""
                        }`}
                        onClick={() => setSelectedRiderId(rider.id)}
                      >
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={selectedRiderId === rider.id}
                            onCheckedChange={(checked) => {
                              setSelectedRiderId(checked ? rider.id : null);
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2 px-3">
                          <Avatar className="size-8 border border-accent">
                            <AvatarImage
                              src={rider.user.avatar_url || ""}
                              alt={rider.user.full_name}
                            />
                            <AvatarFallback className="text-xs">
                              {rider.user.full_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-base text-foreground font-normal font-manrope">
                            {rider.user.full_name}
                          </p>
                        </div>
                        <p className="text-base text-foreground font-normal font-manrope px-3">
                          {rider.in_process_orders || 0}
                        </p>
                        <p className="text-base text-foreground font-normal font-manrope px-3 capitalize">
                          {rider.assigned_vehicle || "N/A"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-muted-foreground">No riders found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M12.5 15L7.5 10L12.5 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "ghost"}
                        size="sm"
                        className={`w-7 h-7 p-0 ${
                          page === pageNum ? "bg-foreground/5" : ""
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <Button
              className="bg-primary hover:bg-primary/90 text-foreground rounded-xl px-4 py-2 h-auto"
              onClick={handleAssign}
              disabled={!selectedRiderId || isPending}
              loading={isPending}
            >
              <span className="text-sm font-normal font-manrope">
                Assign Order
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
