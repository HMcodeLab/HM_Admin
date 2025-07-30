"use client";

import React, { useState, ChangeEvent } from "react";
import { IoCloudUploadSharp } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import ImageCoursesModal from "@/utils/ImageCoursesModal";
import FeatureVideoCourseModal from "@/utils/FeatureVideoCourseModal";
import Loader from "@/components/Loader";
import Image from "next/image"; // ✅ Import Next.js Image
import { ThumbnailAndTeaserProps } from "@/types";

const ThumbnailAndTeaser: React.FC<ThumbnailAndTeaserProps> = ({
  courseDetails,
  setCourseDetails,
  loading,
  uploadedMedia,
}) => {
  const [selectedMediaFromModal, setSelectedMediaFromModal] = useState("");
  const [isModalImageOpen, setIsModalImageOpen] = useState(false);
  const [isModalVideoOpen, setIsModalVideoOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadClick = async (key: string, isVideo: boolean) => {
    if (loading) return;

    setSelectedModal(key);
    setModalLoading(true);

    // simulate async operation — replace with actual data check if needed
    setTimeout(() => {
      setModalLoading(false);
      isVideo ? setIsModalVideoOpen(true) : setIsModalImageOpen(true);
    }, 300); // adjust delay if needed
  };

  const mediaBlocks = [
    {
      label: "Thumbnail",
      key: "featured_image",
      isVideo: false,
      value: courseDetails.featured_image,
    },
    {
      label: "Banner",
      key: "bannerImg",
      isVideo: false,
      value: courseDetails.bannerImg,
    },
    {
      label: "Teaser",
      key: "featured_video",
      isVideo: true,
      value: courseDetails.featured_video,
    },
  ];

  return (
    <div className="w-full">
      {/* Modals */}
      {(isModalImageOpen || isModalVideoOpen || modalLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {modalLoading ? (
            <Loader />
          ) : isModalImageOpen ? (
            <ImageCoursesModal
              isModalImageOpen={isModalImageOpen}
              setIsModalImageOpen={setIsModalImageOpen}
              courseDetails={courseDetails}
              setCourseDetails={setCourseDetails}
              type={selectedModal}
              uploadedMedia={uploadedMedia.map((url) => ({
                url,
                title: url.split("/").pop() || url,
              }))}
              setSelectedMediaFromModal={setSelectedMediaFromModal}
            />
          ) : (
            <FeatureVideoCourseModal
              isModalVideoOpen={isModalVideoOpen}
              setIsModalVideoOpen={setIsModalVideoOpen}
              courseDetails={courseDetails}
              setCourseDetails={setCourseDetails}
              type={selectedModal}
              uploadedMedia={uploadedMedia.map((url) => ({
                url,
                title: url.split("/").pop() || url,
              }))}
              setSelectedMediaFromModal={setSelectedMediaFromModal}
            />
          )}
        </div>
      )}

      <fieldset className="flex w-full flex-col gap-6">
        <h1 className="font-Montserrat text-3xl font-semibold text-green-600 dark:text-green-300">
          Internship Media
        </h1>

        <div className="grid grid-cols-1 gap-6 rounded-md bg-white p-6 shadow-lg dark:bg-gray-800 md:grid-cols-2 xl:grid-cols-3">
          {mediaBlocks.map(({ label, key, isVideo, value }) => (
            <div
              key={key}
              className="flex flex-col items-center gap-3 rounded-lg bg-white p-4 shadow-md transition-all dark:bg-gray-900"
            >
              <p className="font-Montserrat text-lg font-semibold text-gray-800 dark:text-gray-100">
                {label}
              </p>

              {value &&
                (isVideo ? (
                  <video
                    controls
                    className="h-40 w-full rounded-md object-cover"
                  >
                    <source src={value} type="video/mp4" />
                  </video>
                ) : (
                  <div className="relative h-40 w-full">
                    <Image
                      src={value}
                      alt={label}
                      fill
                      sizes="100vw"
                      className="rounded-md object-cover"
                      priority
                    />
                  </div>
                ))}

              <div className="flex w-full items-center gap-2">
                <input
                  type="url"
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  placeholder={`https://example.com/${isVideo ? "video.mp4" : "image.jpg"}`}
                  className="flex-1 rounded-md bg-gray-50 p-2 text-sm text-gray-800 shadow-sm outline-none dark:bg-gray-800 dark:text-gray-100"
                />
                {value && (
                  <ImCross
                    className="cursor-pointer text-xl text-red-500 hover:text-red-600"
                    onClick={() =>
                      setCourseDetails((prev) => ({ ...prev, [key]: "" }))
                    }
                  />
                )}
                <IoCloudUploadSharp
                  className="cursor-pointer text-2xl text-green-600 hover:text-green-800 dark:text-green-300 dark:hover:text-green-100"
                  onClick={() => handleUploadClick(key, isVideo)}
                />
              </div>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default ThumbnailAndTeaser;
