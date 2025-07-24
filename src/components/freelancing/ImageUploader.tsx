"use client";

import React, { useRef, useState, useEffect } from "react";
import { FreelancePost, WorkExperience } from "@/types";

interface ImageUploaderProps {
  freelancePost: FreelancePost;
  setFreelancePost: React.Dispatch<React.SetStateAction<FreelancePost>>;
}



const ImageUploader: React.FC<ImageUploaderProps> = ({
  freelancePost,
  setFreelancePost,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>(
    freelancePost.logoUrl || "",
  );

  // Clean up the created object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (selectedImage && selectedImage.startsWith("blob:")) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFreelancePost((prev) => ({
        ...prev,
        logoUrl: imageUrl,
      }));
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row md:items-center">
      <button
        type="button"
        onClick={handleButtonClick}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition duration-200 hover:bg-blue-700"
      >
        Upload Image
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Logo Preview"
            className="h-16 w-16 rounded border object-cover dark:border-gray-600"
          />
        )}

        <input
          type="text"
          readOnly
          value={freelancePost.logoUrl}
          placeholder="No image selected"
          className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>
    </div>
  );
};

export default ImageUploader;
