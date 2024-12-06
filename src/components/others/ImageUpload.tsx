import React, { useState, useCallback, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { t } from "i18next";

interface ImageUploadProps {
  onImageChange: (file: File) => void;
  initialImage?: string | null; // Optional initial image to display on load
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageChange,
  initialImage,
}) => {
  const [preview, setPreview] = useState<string | null>(initialImage || null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          alert("Please upload a valid image file.");
          return;
        }
        setPreview(URL.createObjectURL(file)); // Preview the selected image
        onImageChange(file); // Pass the file to parent component
      }
    },
    [onImageChange]
  );

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false, // Single file upload only
  });

  // Remove image functionality
  const removeImage = () => {
    setPreview(null);
  };

  // Cleanup when preview changes or component is unmounted
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview); // Free up memory
      }
    };
  }, [preview]);

  return (
    <div className="w-full flex flex-col mb-5 items-center border py-5 rounded-lg">
      <div
        {...getRootProps()}
        className={`relative cursor-pointer transition-all duration-300 ease-in-out
          ${isDragActive ? "border-primary" : "border-input"}
          border-2 border-dashed rounded-full size-20 mx-auto
          hover:border-primary hover:bg-accent hover:bg-opacity-10`}
      >
        <input {...getInputProps()} />

        <Avatar className="w-full h-full">
          <AvatarImage
            src={preview || "/placeholder.svg?height=160&width=160"}
            alt="Profile Picture"
          />
          <AvatarFallback>
            <Camera className="size-8 text-white" />
          </AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 flex items-center justify-center bg-background bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Camera className="size-10 text-primary" />
        </div>
      </div>

      {preview && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full md:w-52"
          onClick={removeImage}
        >
          <X className="w-4 h-4 mr-2" />
          {t("remove-img")}
        </Button>
      )}

      {!preview && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          {t("upload-image-msg")}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
