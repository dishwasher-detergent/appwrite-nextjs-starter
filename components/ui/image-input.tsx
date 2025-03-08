import { LucideX } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ENDPOINT, PROJECT_ID } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ImageInputProps = {
  className?: string;
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  bucketId: string;
} & Omit<React.ComponentProps<"input">, "type" | "value" | "onChange">;

function ImageInput({
  className,
  value,
  onChange,
  bucketId,
  ...props
}: ImageInputProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);
      setFileName(value.name);

      // Clean up the URL when component unmounts or value changes
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (value && typeof value === "string") {
      setPreviewUrl(
        `${ENDPOINT}/storage/buckets/${bucketId}/files/${value}/view?project=${PROJECT_ID}`
      );
    }

    // Handle null value
    if (!value) {
      setPreviewUrl(null);
    }
  }, [value, bucketId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (onChange) {
      onChange(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setFileName(null);

    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className="relative w-full">
      <Input
        type="file"
        accept="image/*"
        data-slot="input"
        ref={inputRef}
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        onChange={handleChange}
        {...props}
      />

      {previewUrl && (
        <div className="mt-3 relative">
          <div className="relative rounded-md border overflow-hidden size-20 bg-primary">
            <button
              type="button"
              onClick={handleClear}
              className="ml-2 text-sm bg-destructive rounded-full absolute p-0.5 right-1 top-1"
              aria-label="Clear selected image"
            >
              <LucideX className="size-4 text-white" />
            </button>
            <Image
              src={previewUrl}
              alt="Preview"
              className="object-cover size-full aspect-square"
              width={32}
              height={32}
              quality={100}
            />
          </div>
          {fileName && <Badge className="truncate">{fileName}</Badge>}
        </div>
      )}
    </div>
  );
}

ImageInput.displayName = "ImageInput";

export { ImageInput };
