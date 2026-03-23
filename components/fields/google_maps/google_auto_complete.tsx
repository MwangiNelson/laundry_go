import React, { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, X } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
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
}: GoogleMapsAutocompleteProps<T>) => {
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedViaGoogle, setSelectedViaGoogle] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { isMapLoaded, loadError } = useGeo();
  const googleAvailable = isMapLoaded && !loadError;

  const getPlaceDetails = async (
    placeId: string
  ): Promise<LocationData | null> => {
    if (!googleAvailable) return null;

    const placesService = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    return new Promise((resolve) => {
      placesService.getDetails(
        {
          placeId,
          fields: [
            "geometry",
            "formatted_address",
            "name",
            "address_components",
          ],
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            resolve({
              place_id: placeId,
              description: place.formatted_address || null,
              main_text: place.name || "",
              coordinates: place.geometry?.location
                ? {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                }
                : undefined,
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  };

  // Debounced Google predictions
  useEffect(() => {
    if (!inputText || !googleAvailable || selectedViaGoogle) {
      setPredictions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const autocompleteService =
          new google.maps.places.AutocompleteService();
        const results = await autocompleteService.getPlacePredictions({
          input: inputText,
        });
        setPredictions(results?.predictions || []);
      } catch {
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputText, googleAvailable, selectedViaGoogle]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={initialValue}
      render={({ field }) => {
        const displayValue = field.value?.main_text
          ? `${field.value.main_text}${field.value.description ? ` - ${field.value.description}` : ""}`
          : field.value?.description || "";

        return (
          <FormItem className={cn("w-full relative", className)}>
            <FormControl>
              <div ref={wrapperRef} className="relative">
                <div
                  className={cn(
                    "relative rounded-2xl border px-4 py-3 transition-colors",
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
                        value={showDropdown ? inputText : inputText || displayValue}
                        onFocus={() => {
                          if (!inputText && displayValue) {
                            setInputText(displayValue);
                          }
                          setSelectedViaGoogle(false);
                          setShowDropdown(true);
                        }}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInputText(val);
                          setSelectedViaGoogle(false);
                          setShowDropdown(true);

                          // Update field with manual text
                          if (val.trim()) {
                            field.onChange({
                              description: val.trim(),
                              main_text: val.trim(),
                            });
                          } else {
                            field.onChange(null);
                          }
                        }}
                        className={cn(
                          "w-full bg-transparent text-sm text-foreground placeholder:text-placeholder focus:outline-none",
                          inputClassName
                        )}
                      />

                      {Icon && iconPosition === "end" && (
                        <Icon className={cn("text-xl ml-2", iconClassName)} />
                      )}

                      {/* Clear button */}
                      {(field.value || inputText) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            field.onChange(null);
                            setInputText("");
                            setPredictions([]);
                            setShowDropdown(false);
                            setSelectedViaGoogle(false);
                          }}
                          className="ml-auto transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Google suggestions dropdown — only when API is available */}
                {showDropdown &&
                  googleAvailable &&
                  inputText &&
                  !selectedViaGoogle && (
                    <div className="absolute z-50 mt-1 w-full rounded-lg border border-blue-200/30 bg-background shadow-2xl overflow-hidden">
                      {isLoading && (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      )}
                      {!isLoading &&
                        predictions.length === 0 &&
                        inputText.length >= 3 && (
                          <div className="p-3 text-center text-sm text-muted-foreground">
                            No suggestions found
                          </div>
                        )}
                      {predictions.length > 0 && (
                        <ul className="max-h-48 overflow-y-auto py-1">
                          {predictions.map((prediction) => (
                            <li key={prediction.place_id}>
                              <button
                                type="button"
                                className="flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors border-b border-blue-100/20 last:border-b-0"
                                onMouseDown={async (e) => {
                                  e.preventDefault();
                                  const details = await getPlaceDetails(
                                    prediction.place_id
                                  );
                                  if (details) {
                                    field.onChange({
                                      place_id: details.place_id,
                                      description: details.description,
                                      main_text: details.main_text,
                                      secondary_text:
                                        prediction.structured_formatting
                                          .secondary_text,
                                      coordinates: details.coordinates,
                                    });
                                    setInputText(
                                      `${details.main_text}${details.description ? ` - ${details.description}` : ""}`
                                    );
                                  }
                                  setSelectedViaGoogle(true);
                                  setPredictions([]);
                                  setShowDropdown(false);
                                }}
                              >
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-foreground truncate">
                                    {
                                      prediction.structured_formatting
                                        .main_text
                                    }
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
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
