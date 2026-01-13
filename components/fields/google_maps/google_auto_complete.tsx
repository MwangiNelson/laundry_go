import React, { useEffect, useState, useCallback } from "react";
import { Check, ChevronsUpDown, Loader2, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path, useWatch } from "react-hook-form";
import { CommandList } from "cmdk";
import { cn } from "@/lib/utils";
import { TIcon } from "@/types/ui.types";
import { useGeo } from "@/components/context/geo_provider";

interface LocationData {
  place_id?: string;
  description: string | null;
  main_text?: string;
  secondary_text?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface GoogleMapsAutocompleteProps<T extends FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  control: Control<T>;
  name: Path<T>;
  initialValue?: T[Path<T>];
  label?: string;
  placeholder?: string;
  icon?: TIcon;
  iconPosition?: "start" | "end";
  iconClassName?: string;
  inputClassName?: string;
  groupClassName?: string;
  className?: string;
}

export const GoogleMapsAutocomplete = <T extends FieldValues>({
  control,
  name,
  initialValue,
  label,
  placeholder = "Search for a location...",
  icon: Icon,
  iconPosition = "start",
  iconClassName,
  inputClassName,
  groupClassName,
  className,
  ...props
}: GoogleMapsAutocompleteProps<T>) => {
  const [open, setOpen] = useState(false);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { isMapLoaded: isLoaded, loadError } = useGeo();

  const getPlaceDetails = async (
    placeId: string
  ): Promise<LocationData | null> => {
    if (!isLoaded) return null;

    const placesService = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    return new Promise((resolve) => {
      placesService.getDetails(
        {
          placeId: placeId,
          fields: [
            "geometry",
            "formatted_address",
            "name",
            "address_components",
          ],
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const locationData: LocationData = {
              place_id: placeId,
              description: place.formatted_address || null,
              main_text: place.name || "",
              coordinates: place.geometry?.location
                ? {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  }
                : undefined,
            };
            resolve(locationData);
          } else {
            resolve(null);
          }
        }
      );
    });
  };

  // Debounced search function
  useEffect(() => {
    if (!searchValue || !isLoaded) {
      setPredictions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      const autocompleteService = new google.maps.places.AutocompleteService();
      try {
        const results = await autocompleteService.getPlacePredictions({
          input: searchValue,
        });
        setPredictions(results?.predictions || []);
      } catch (error) {
        console.error("Error fetching predictions:", error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchValue, isLoaded]);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={initialValue}
      render={({ field }) => (
        <FormItem className={cn("w-full relative", className)}>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger className="p-0 w-full" asChild>
                <div
                  className={cn(
                    "relative rounded-2xl border px-4 py-3 transition-colors cursor-pointer",
                    "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
                    groupClassName
                  )}
                >
                  <div className="flex flex-col gap-1">
                    {label && (
                      <label className="text-xs font-medium tracking-wide text-label">
                        {label}
                      </label>
                    )}
                    <div className="relative flex items-center">
                      {Icon && iconPosition === "start" && (
                        <Icon className={cn("text-xl mr-2", iconClassName)} />
                      )}

                      <input
                        type="text"
                        placeholder={placeholder}
                        value={
                          field.value?.main_text
                            ? `${field.value.main_text}${
                                field.value.description
                                  ? ` - ${field.value.description}`
                                  : ""
                              }`
                            : ""
                        }
                        readOnly
                        className={cn(
                          "w-full bg-transparent text-sm text-foreground placeholder:text-placeholder focus:outline-none cursor-pointer",
                          inputClassName
                        )}
                      />

                      {Icon && iconPosition === "end" && (
                        <Icon className={cn("text-xl ml-2", iconClassName)} />
                      )}

                      {/* Clear button - only show when location is selected */}
                      {field.value && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            field.onChange(null);
                            setSearchValue("");
                          }}
                          className="ml-auto transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      {/* Dropdown arrow */}
                      <button type="button" className="ml-2 transition-colors">
                        <ChevronsUpDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className={cn(
                  "w-[var(--radix-popover-trigger-width)] bg-background backdrop-blur-md border border-blue-200/30 shadow-2xl rounded-lg p-0",
                  "max-h-60 overflow-hidden"
                )}
                align="start"
              >
                <Command shouldFilter={false} className="bg-transparent">
                  <CommandInput
                    placeholder="Search for a location..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                    className="border-0 bg-transparent font-manrope text-lg "
                  />
                  {isLoading && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin " />
                    </div>
                  )}
                  {!isLoading && predictions.length === 0 && searchValue && (
                    <div className="p-4 text-center">
                      <p className="text-sm text-muted-foreground font-manrope">
                        No locations found
                      </p>
                    </div>
                  )}
                  {!searchValue && (
                    <div className="p-4 text-center">
                      <p className="text-sm text-muted-foreground font-manrope">
                        Start typing to search for a location
                      </p>
                    </div>
                  )}
                  <CommandGroup>
                    <CommandList className="max-h-48 overflow-y-auto">
                      {predictions.map((prediction) => (
                        <CommandItem
                          key={prediction.place_id}
                          value={prediction.description}
                          onSelect={async () => {
                            const details = await getPlaceDetails(
                              prediction.place_id
                            );
                            if (details) {
                              console.log("Location selected:", details);
                              field.onChange({
                                place_id: details.place_id,
                                description: details.description,
                                main_text: details.main_text,
                                secondary_text:
                                  prediction.structured_formatting
                                    .secondary_text,
                                coordinates: details.coordinates,
                              });
                              setSearchValue("");
                              setOpen(false);
                            }
                          }}
                          className="hover:bg-blue-100/20 focus:bg-blue-100/20 cursor-pointer transition-colors border-b border-blue-100/20 last:border-b-0"
                        >
                          <div className="flex items-start gap-3 w-full">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-manrope text-sm text-foreground truncate">
                                {prediction.structured_formatting.main_text}
                              </p>
                              {prediction.structured_formatting
                                .secondary_text && (
                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                  {
                                    prediction.structured_formatting
                                      .secondary_text
                                  }
                                </p>
                              )}
                            </div>
                            {field.value?.place_id === prediction.place_id && (
                              <Check className="ml-auto h-4 w-4 flex-shrink-0" />
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
