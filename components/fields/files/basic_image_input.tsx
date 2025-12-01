import React, { useRef, useState, useEffect } from "react";
import { Upload, X, FileImage, FileText, FileVideo, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";

export interface FileUploadProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  accept?: string;
  maxFiles?: number;
  multiple?: boolean;
  className?: string;
  placeholder?: string;
  description?: string;
}

export const FileUpload = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  accept = "image/*,video/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx",
  maxFiles = 5,
  multiple = true,
  className = "",
  placeholder = "Select file to upload",
  description = "Upload photo, video, or document format",
}: FileUploadProps<TFieldValues>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const imageUrlsRef = useRef<Map<string, string>>(new Map());

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    const currentRef = imageUrlsRef.current;
    return () => {
      currentRef.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <FileImage className="w-4 h-4" />;
    } else if (file.type.startsWith("video/")) {
      return <FileVideo className="w-4 h-4" />;
    } else if (
      file.type.includes("text") ||
      file.type.includes("document") ||
      file.type.includes("pdf") ||
      file.type.includes("word") ||
      file.type.includes("excel") ||
      file.type.includes("powerpoint") ||
      file.name.endsWith(".pdf") ||
      file.name.endsWith(".doc") ||
      file.name.endsWith(".docx") ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".xls") ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".ppt") ||
      file.name.endsWith(".pptx")
    ) {
      return <FileText className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      // Create URL if it doesn't exist
      if (!imageUrlsRef.current.has(file.name)) {
        const url = URL.createObjectURL(file);
        imageUrlsRef.current.set(file.name, url);
      }

      const imageUrl = imageUrlsRef.current.get(file.name);
      if (imageUrl) {
        return (
          <Image
            src={imageUrl}
            alt={file.name}
            width={16}
            height={16}
            className="w-4 h-4 object-cover rounded"
          />
        );
      }
    }
    return getFileIcon(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Clean up URLs for files that are no longer in the list
  const cleanupStaleUrls = (currentFiles: File[]) => {
    const currentFileNames = new Set(
      currentFiles.map((file: File) => file.name)
    );

    imageUrlsRef.current.forEach((url, fileName) => {
      if (!currentFileNames.has(fileName)) {
        URL.revokeObjectURL(url);
        imageUrlsRef.current.delete(fileName);
      }
    });
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Handle both single file and array formats
        const files: File[] = multiple
          ? field.value || []
          : field.value
          ? [field.value]
          : [];

        // Clean up stale URLs
        cleanupStaleUrls(files);

        const handleFileSelect = (selectedFiles: FileList | null) => {
          if (!selectedFiles) return;

          const newFiles: File[] = [];
          const remainingSlots = multiple ? maxFiles - files.length : 1;

          Array.from(selectedFiles).forEach((file) => {
            if (newFiles.length < remainingSlots) {
              newFiles.push(file);
            }
          });

          if (multiple) {
            // Multiple mode: return array
            field.onChange([...(files as File[]), ...newFiles]);
          } else {
            // Single file mode: return single File object (not array)
            field.onChange(newFiles.length > 0 ? newFiles[0] : null);
          }
        };

        const handleFileRemove = (fileToRemove: File) => {
          if (multiple) {
            field.onChange(files.filter((file: File) => file !== fileToRemove));
          } else {
            // Single file mode: set to null
            field.onChange(null);
          }
        };

        const handleDrop = (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFileSelect(e.dataTransfer.files);
        };

        const handleDragOver = (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragOver(true);
        };

        const handleDragLeave = (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragOver(false);
        };

        const handleClick = () => {
          fileInputRef.current?.click();
        };

        return (
          <FormItem className={cn("w-full", className)}>
            {label && (
              <FormLabel className="text-sm text-foreground/80 font-normal">
                {label}
              </FormLabel>
            )}
            <FormControl>
              <div className="space-y-3">
                {/* Upload Area */}
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={handleClick}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    {placeholder}
                  </p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={accept}
                  multiple={multiple && maxFiles > 1}
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file: File, index: number) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getFilePreview(file)}
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-primary font-medium">
                            ✓ Uploaded
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileRemove(file);
                            }}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {multiple && files.length >= maxFiles && (
                      <p className="text-xs text-muted-foreground text-center">
                        Maximum {maxFiles} file{maxFiles > 1 ? "s" : ""} reached
                      </p>
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

export default FileUpload;
