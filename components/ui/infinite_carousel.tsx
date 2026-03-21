"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InfiniteCarouselProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
  options?: Parameters<typeof useEmblaCarousel>[0];
  viewportClassName?: string;
  trackClassName?: string;
  slideClassName?: string;
  controlsClassName?: string;
  showControls?: boolean;
};

export function InfiniteCarousel({
  children,
  className,
  options,
  viewportClassName,
  trackClassName,
  slideClassName,
  controlsClassName,
  showControls = true,
  ...props
}: InfiniteCarouselProps) {
  const items = React.Children.toArray(children);
  const [viewportRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    ...options,
  });
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) {
      return;
    }

    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) {
      return;
    }

    onSelect();
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("w-full", className)} {...props}>
      <div
        ref={viewportRef}
        className={cn("overflow-hidden", viewportClassName)}
      >
        <div
          className={cn("flex touch-pan-y touch-pinch-zoom", trackClassName)}
        >
          {items.map((child, index) => (
            <div
              key={index}
              className={cn(
                "min-w-0 shrink-0 grow-0 basis-full",
                slideClassName
              )}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {showControls && items.length > 1 ? (
        <div className={cn("mt-5 flex items-center gap-3", controlsClassName)}>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="rounded-full border-landing-accent/35 bg-white text-title hover:bg-landing-accent/10 disabled:opacity-45"
          >
            <ArrowLeft className="size-4" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className="rounded-full border-landing-accent/35 bg-white text-title hover:bg-landing-accent/10 disabled:opacity-45"
          >
            <ArrowRight className="size-4" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
