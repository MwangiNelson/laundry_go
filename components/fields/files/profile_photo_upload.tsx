"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

interface ProfilePhotoUploadProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  defaultImage?: string;
  maxSize?: number; // in bytes, default 5MB
  label?: string;
  description?: string;
  shape?: "circle" | "square" | "rounded";
  size?: "sm" | "md" | "lg";
  showRemoveButton?: boolean;
  acceptedFormats?: string[];
  onUploadStart?: () => void;
  onUploadComplete?: (file: File | string) => void;
  onUploadError?: (error: string) => void;
  onRemove?: () => void;
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-24 h-24",
};

const shapeClasses = {
  circle: "rounded-full",
  square: "rounded-none",
  rounded: "rounded-lg",
};

export const ProfilePhotoUpload = <TFieldValues extends FieldValues>({
  name,
  control,
  defaultImage,
  maxSize = 5 * 1024 * 1024,
  label = "Upload Profile Photo",
  description = "Recommended jpg or png format (max size 5mb)",
  shape = "circle",
  size = "md",
  showRemoveButton = true,
  acceptedFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  onUploadStart,
  onUploadComplete,
  onUploadError,
  onRemove,
}: ProfilePhotoUploadProps<TFieldValues>) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { field } = useController({ name, control });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    if (typeof field.value === "string" && field.value.startsWith("http")) {
      setPreview(field.value);
    } else if (defaultImage) {
      setPreview(defaultImage);
    }
  }, []);

  const validateAndProcessFile = (file: File | null) => {
    setError(null);

    if (!file) {
      setPreview(null);
      field.onChange(null);
      return;
    }

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      const errorMsg = `Invalid file type. Accepted formats: ${acceptedFormats.join(
        ", "
      )}`;
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      const errorMsg = `File size exceeds ${maxSize / 1024 / 1024}MB limit`;
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    setIsLoading(true);
    onUploadStart?.();

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setIsLoading(false);
      field.onChange(file);
      onUploadComplete?.(file);
    };
    reader.onerror = () => {
      setIsLoading(false);
      const errorMsg = "Failed to read file";
      setError(errorMsg);
      onUploadError?.(errorMsg);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const value = field.value as unknown;
    if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else if (typeof value === "string" && value.startsWith("http")) {
      setPreview(value);
    } else if (!value && defaultImage) {
      setPreview(defaultImage);
    } else {
      setPreview(null);
    }
  }, [field.value, defaultImage]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    field.onChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className="w-full">
          <FormLabel
            className="cursor-pointer"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <motion.div
              className={`flex items-center gap-4 rounded-lg  transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5 p-2 rounded-sm"
                  : " hover:border-primary/50"
              } ${error ? "border-destructive" : ""}`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`${sizeClasses[size]} ${shapeClasses[shape]} bg-foreground/5 flex items-center justify-center`}
                    >
                      <Loader2
                        className="animate-spin text-primary"
                        size={20}
                      />
                    </motion.div>
                  ) : preview ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative"
                    >
                      <img
                        src={preview}
                        alt="Profile"
                        className={`${sizeClasses[size]} ${shapeClasses[shape]} object-cover border `}
                      />
                      {showRemoveButton && (
                        <motion.button
                          type="button"
                          onClick={handleRemove}
                          className="absolute -top-2 -right-2 p-1 bg-destructive/80 rounded-full shadow-md hover:bg-destructive transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X size={12} className="text-background" />
                        </motion.button>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`${sizeClasses[size]} ${shapeClasses[shape]} bg-foreground/5 flex items-center justify-center`}
                    >
                      <User size={24} className="text-muted-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {!preview && !isLoading && (
                  <motion.div
                    className="absolute right-0 bottom-0 p-1.5 bg-background rounded-full shadow border border-border"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Upload size={16} className="text-primary" />
                  </motion.div>
                )}
              </div>

              <div className="flex flex-col flex-1">
                <span className="font-medium text-sm">{label}</span>
                <span className="text-xs text-muted-foreground">
                  {description}
                </span>
                {isDragging && (
                  <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-primary font-medium mt-1"
                  >
                    Drop your file here
                  </motion.span>
                )}
              </div>
            </motion.div>
          </FormLabel>

          <FormControl>
            <Input
              ref={fileInputRef}
              type="file"
              id={name}
              accept={acceptedFormats.join(",")}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                validateAndProcessFile(file);
              }}
              className="hidden"
            />
          </FormControl>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1"
            >
              {error}
            </motion.p>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
