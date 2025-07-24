"use client";

import Loader from "@/components/Loader";
import { FeatureVideoCourseModalProps, MediaItem } from "@/types";
import { useEffect, useState } from "react";
import { MdOndemandVideo } from "react-icons/md";

const videoExtensions = [".mp4", ".mov", ".mkv", ".mp3"];

const FeatureVideoCourseModal: React.FC<FeatureVideoCourseModalProps> = ({
  isModalVideoOpen,
  setIsModalVideoOpen,
  courseDetails,
  setCourseDetails,
  type,
  uploadedMedia,
  setSelectedMediaFromModal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    setLoading(true);

    const videoFiles = uploadedMedia.filter((media) =>
      videoExtensions.some(
        (ext) =>
          media.url.toLowerCase().endsWith(ext) &&
          media.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );

    setFilteredMedia(videoFiles);
    setLoading(false);
  }, [uploadedMedia, searchQuery]);

  const handleChangeMedia = (url: string) => {
    if (type === "featured_video") {
      setCourseDetails({ ...courseDetails, featured_video: url });
    } else {
      setSelectedMediaFromModal(url);
    }
    setIsModalVideoOpen(false);
  };

  const getVideoName = (title: string) => {
    try {
      const match = title
        .split("/")
        .pop()
        ?.match(/^\d{13}-(.+?)\.(mp4|mov|mkv|mp3)/i);
      return match?.[1] || title;
    } catch {
      return title;
    }
  };

  if (!isModalVideoOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative top-0 mt-[13vh] h-[80%] w-[90%] overflow-y-auto rounded-md bg-white p-4 shadow-lg dark:bg-gray-900 md:w-[70%]">
        {/* Header */}
        <div className="relative sticky top-0 z-10 flex flex-col items-center justify-between gap-3 rounded-md bg-white p-4 shadow-md dark:bg-gray-900 md:flex-row">
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            Select a Video
          </p>
          <button
            onClick={() => setIsModalVideoOpen(false)}
            className="absolute right-0 top-0 text-2xl font-bold text-gray-400 hover:text-red-500"
            aria-label="Close modal"
          >
            &times;
          </button>
          <div className="flex w-full items-center gap-3 md:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white md:w-[20rem]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="mt-10 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMedia.map((media, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-md bg-gray-100 p-4 shadow transition hover:shadow-lg dark:bg-gray-800"
                onClick={() => handleChangeMedia(media.url)}
              >
                <div className="flex flex-col items-center justify-center">
                  <MdOndemandVideo className="mb-2 text-6xl text-red-500" />
                  <span className="break-words text-center text-sm font-medium text-gray-700 dark:text-white">
                    {getVideoName(media.title)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureVideoCourseModal;
