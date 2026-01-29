"use client";
import React from "react";
import { useFetchCustomerReviews } from "@/api/admin/customers/use_customers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerReviewProps {
  customerId?: string;
}

export const CustomerReview = ({ customerId }: CustomerReviewProps) => {
  const { data: reviews, isLoading } = useFetchCustomerReviews(
    customerId || null
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-subtitle">Loading reviews...</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return <div className="text-center py-8 text-subtitle">No reviews yet</div>;
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= rating
                ? "fill-yellow-500 text-yellow-500"
                : "fill-gray-300 text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-title">Recent reviews</h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b pb-4 last:border-b-0 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={review.vendor?.logo_url || ""}
                    alt={review.vendor?.business_name || "Vendor"}
                  />
                  <AvatarFallback>
                    {review.vendor?.business_name?.charAt(0) || "V"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-title">
                  {review.vendor?.business_name || "Unknown Vendor"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-title">
                  {review.rating}
                </span>
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="text-sm text-subtitle pl-[52px]">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
