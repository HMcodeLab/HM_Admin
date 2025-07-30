"use client";

import React, { useState, ChangeEvent } from "react";
import { IoCloudUploadSharp } from "react-icons/io5";
import { ImCross } from "react-icons/im";

import { CourseType } from "@/types";
import ImageCoursesModal from "@/utils/ImageCoursesModal";
import FeatureVideoCourseModal from "@/utils/FeatureVideoCourseModal";
import Image from "next/image";

interface ThumbnailAndTeaserProps {
  courseDetails: CourseType;
  setCourseDetails: React.Dispatch<React.SetStateAction<CourseType>>;
  loading: boolean;
  uploadedMedia: any[];
}

const ThumbnailAndTeaser: React.FC<ThumbnailAndTeaserProps> = ({
  courseDetails,
  setCourseDetails,
  loading,
  uploadedMedia,
}) => {
  const [selectedMediaFromModal, setSelectedMediaFromModal] = useState("");
  const [isModalImageOpen, setIsModalImageOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState("");
  const [isModalVideoOpen, setIsModalVideoOpen] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCourseDetails({
      ...courseDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full px-4 py-6 md:px-6 xl:px-10">
      {isModalImageOpen && (
        <ImageCoursesModal
          isModalImageOpen={isModalImageOpen}
          setIsModalImageOpen={setIsModalImageOpen}
          courseDetails={courseDetails}
          setCourseDetails={setCourseDetails}
          type={selectedModal}
          uploadedMedia={uploadedMedia}
          setSelectedMediaFromModal={setSelectedMediaFromModal}
        />
      )}

      {isModalVideoOpen && (
        <FeatureVideoCourseModal
          isModalVideoOpen={isModalVideoOpen}
          setIsModalVideoOpen={setIsModalVideoOpen}
          courseDetails={courseDetails}
          setCourseDetails={setCourseDetails}
          type={selectedModal}
          uploadedMedia={uploadedMedia}
          setSelectedMediaFromModal={setSelectedMediaFromModal}
        />
      )}

      <h1 className="font-Montserrat mb-6 text-2xl font-semibold text-green-600 md:text-3xl">
        Course Media
      </h1>

      <div className="flex flex-col gap-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 xl:flex-row">
        {/* Thumbnail */}
        <div className="flex w-full flex-col items-center gap-2 xl:w-1/3">
          <p className="font-Montserrat text-lg font-medium text-gray-800 dark:text-gray-200">
            Thumbnail
          </p>
          {courseDetails.featured_image && (
            <Image
              src={courseDetails.featured_image}
              alt="Thumbnail"
              className="h-40 w-full rounded-lg object-cover"
              width={200}
              height={200}
            />
          )}
          <div className="flex w-full items-center gap-2">
            <input
              type="url"
              name="featured_image"
              value={courseDetails.featured_image}
              onChange={handleInputChange}
              placeholder="https://example.com/photo.jpg"
              className="flex-grow rounded-md px-3 py-2 text-black shadow outline-none dark:bg-gray-700 dark:text-white"
            />
            <ImCross
              className={`cursor-pointer text-xl text-red-500 ${
                courseDetails.featured_image ? "visible" : "invisible"
              }`}
              onClick={() =>
                setCourseDetails({ ...courseDetails, featured_image: "" })
              }
            />
            <IoCloudUploadSharp
              className="cursor-pointer text-2xl text-gray-700 dark:text-gray-300"
              onClick={() => {
                if (!loading) {
                  setSelectedModal("featured_image");
                  setIsModalImageOpen(true);
                }
              }}
            />
          </div>
        </div>

        {/* Banner */}
        <div className="flex w-full flex-col items-center gap-2 xl:w-1/3">
          <p className="font-Montserrat text-lg font-medium text-gray-800 dark:text-gray-200">
            Banner
          </p>
          {courseDetails.bannerImg && (
            <Image
              src={courseDetails.bannerImg}
              alt="Banner"
              className="h-40 w-full rounded-lg object-cover"
              width={200}
              height={200}
            />
          )}
          <div className="flex w-full items-center gap-2">
            <input
              type="url"
              name="bannerImg"
              value={courseDetails.bannerImg}
              onChange={handleInputChange}
              placeholder="https://example.com/photo.jpg"
              className="flex-grow rounded-md px-3 py-2 text-black shadow outline-none dark:bg-gray-700 dark:text-white"
            />
            <ImCross
              className={`cursor-pointer text-xl text-red-500 ${
                courseDetails.bannerImg ? "visible" : "invisible"
              }`}
              onClick={() =>
                setCourseDetails({ ...courseDetails, bannerImg: "" })
              }
            />
            <IoCloudUploadSharp
              className="cursor-pointer text-2xl text-gray-700 dark:text-gray-300"
              onClick={() => {
                if (!loading) {
                  setSelectedModal("bannerImg");
                  setIsModalImageOpen(true);
                }
              }}
            />
          </div>
        </div>

        {/* Teaser Video */}
        <div className="flex w-full flex-col items-center gap-2 xl:w-1/3">
          <p className="font-Montserrat text-lg font-medium text-gray-800 dark:text-gray-200">
            Teaser Video
          </p>
          {courseDetails.featured_video && (
            <video
              controls
              className="h-40 w-full rounded-lg border border-gray-300 object-cover dark:border-gray-600"
            >
              <source src={courseDetails.featured_video} type="video/mp4" />
            </video>
          )}
          <div className="flex w-full items-center gap-2">
            <input
              type="url"
              name="featured_video"
              value={courseDetails.featured_video}
              onChange={handleInputChange}
              placeholder="https://example.com/video.mp4"
              className="flex-grow rounded-md px-3 py-2 text-black shadow outline-none dark:bg-gray-700 dark:text-white"
            />
            <ImCross
              className={`cursor-pointer text-xl text-red-500 ${
                courseDetails.featured_video ? "visible" : "invisible"
              }`}
              onClick={() =>
                setCourseDetails({ ...courseDetails, featured_video: "" })
              }
            />
            <IoCloudUploadSharp
              className="cursor-pointer text-2xl text-gray-700 dark:text-gray-300"
              onClick={() => {
                if (!loading) {
                  setSelectedModal("featured_video");
                  setIsModalVideoOpen(true);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailAndTeaser;
