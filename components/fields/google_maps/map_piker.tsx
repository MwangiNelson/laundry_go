"use client";
import React, { useState, useCallback } from "react";
import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";
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

interface MapPickerProps {
  value: LocationData | null;
  onChange: (coordinates: { lat: number; lng: number } | null) => void;
}

export const MapPicker = ({ value, onChange }: MapPickerProps) => {
  const [showMap, setShowMap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { isMapLoaded: geoLoaded, loadError } = useGeo();

  // Show/hide map based on location availability
  React.useEffect(() => {
    setShowMap(!!value?.coordinates);
    if (value?.coordinates) {
      setMarkerPosition(value.coordinates);
    }
  }, [value?.coordinates]);

  // Handle marker drag
  const handleMarkerDrag = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const newPosition = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        setMarkerPosition(newPosition);
        onChange(newPosition);
      }
    },
    [onChange]
  );

  // Enhanced marker icon - larger and more prominent
  const markerIcon = {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
      <svg width="50" height="60" viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Shadow -->
        <ellipse cx="25" cy="58" rx="8" ry="2" fill="#000000" opacity="0.3"/>
        <!-- Outer ring -->
        <circle cx="25" cy="25" r="22" fill="#ffffff" stroke="#021707" stroke-width="4"/>
        <!-- Inner circle -->
        <circle cx="25" cy="25" r="16" fill="#021707"/>
        <!-- Pin shape -->
        <path d="M25 8C18.4 8 13 13.4 13 20C13 30 25 45 25 45C25 45 37 30 37 20C37 13.4 31.6 8 25 8Z" fill="#ffffff"/>
        <!-- Inner dot -->
        <circle cx="25" cy="20" r="6" fill="#021707"/>
        <!-- Center dot -->
        <circle cx="25" cy="20" r="2" fill="#ffffff"/>
      </svg>
    `),
    scaledSize: new google.maps.Size(50, 60),
    anchor: new google.maps.Point(25, 60),
  };

  // Simple, reliable map styles using only well-supported feature types
  const mapStyles = [
    {
      featureType: "all",
      elementType: "geometry.fill",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#e6f3ff" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [{ color: "#ffffff" }],
    },
    // Roads with clear visibility
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#e0e0e0" }],
    },
    // Road labels - make them very clear
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#222222" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ffffff" }],
    },
    // POI styling - keep it simple
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#666666" }],
    },
    // Hide POI icons to reduce clutter
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    // Administrative labels for area context
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [{ color: "#444444" }],
    },
  ];

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <MapPin className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="text-red-600 font-manrope">
          Error loading Google Maps: {loadError.message}
        </p>
      </div>
    );
  }

  if (!showMap) {
    return (
      <div className="bg-foreground/5 border border-border rounded-lg p-6 text-center">
        <MapPin className="w-8 h-8 text-foreground/60 mx-auto mb-3" />
        <p className="text-foreground/80 font-manrope">
          Search for a location above to see the interactive map
        </p>
        <p className="text-sm text-foreground/60 mt-2">
          Google Maps Status: {geoLoaded ? "Loaded" : "Loading..."}
        </p>
      </div>
    );
  }

  if (!markerPosition) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div
          className={cn(
            "w-full h-[400px] rounded-lg border border-border overflow-hidden bg-foreground/5",
            "relative" // Ensure proper positioning context
          )}
          style={{
            imageRendering: "crisp-edges", // Improve text clarity
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          {geoLoaded && (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={markerPosition}
              zoom={16}
              options={{
                styles: mapStyles,
                disableDefaultUI: true, // Disable all default UI controls
                zoomControl: true, // Keep only zoom control
                gestureHandling: "greedy", // Allow normal zoom/pan
                clickableIcons: false, // Disable clickable POI icons
                keyboardShortcuts: false, // Disable keyboard shortcuts
                mapTypeControl: false, // Hide map type selector
                streetViewControl: false, // Hide street view
                fullscreenControl: false, // Hide fullscreen button
                scrollwheel: true, // Enable scroll wheel zoom
              }}
            >
              <Marker
                position={markerPosition}
                draggable={true}
                onDragEnd={handleMarkerDrag}
                icon={markerIcon}
                animation={google.maps.Animation.DROP}
                title="School Location - Drag to adjust"
              />
            </GoogleMap>
          )}
        </div>

        <div className="flex items-center gap-2 text-foreground font-manrope font-medium absolute top-1 left-1 bg-card backdrop-blur-md border rounded-lg p-1">
          <Navigation className="w-5 h-5" />
          <span>Drag the marker to fine-tune your location</span>
        </div>
        <div className="absolute top-4 right-4 bg-card backdrop-blur-md border rounded-lg px-3 py-2 ">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin className="w-4 h-4 text-foreground" />
            <span className="font-manrope">
              {value?.main_text || "School Location"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
