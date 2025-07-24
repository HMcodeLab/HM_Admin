"use client";

import { MediaItem, VideoCourseModalProps } from "@/types";
import { useEffect, useState } from "react";
import { MdOndemandVideo } from "react-icons/md";

const videoExtensions = [".mp4", ".mov", ".mkv", ".mp3"];

const VideoCourseModal: React.FC<VideoCourseModalProps> = ({
  isModalVideoOpen,
  setIsModalVideoOpen,
  courseDetails,
  setCourseDetails,
  type,
  uploadedMedia,
  setSelectedMediaFromModal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    const videoFiles = uploadedMedia.filter(
      (media) =>
        videoExtensions.some((ext) => media.url.toLowerCase().endsWith(ext)) &&
        media.title.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const extractTitle = (title: string) => {
    const match = title
      .split("/")
      .pop()
      ?.match(/^\d{13}-(.+?)\.(mp4|mov|mkv|mp3)/i);
    return match ? match[1] : title;
  };

  if (!isModalVideoOpen) return null;

  return ( 
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 mt-[12vh]">
      <div className="relative flex h-[85%] w-[90%] flex-col overflow-hidden rounded-lg bg-white text-black shadow-lg dark:bg-gray-900 dark:text-white md:w-[80%] lg:w-[70%]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex flex-col items-center justify-between bg-white p-4 shadow-md dark:bg-gray-800 md:flex-row">
          <h2 className="mb-2 text-lg font-semibold md:mb-0">Select a Video</h2>
          <div className="flex w-full items-center gap-4 md:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white md:w-[20rem]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setIsModalVideoOpen(false)}
              className="text-3xl font-bold text-gray-500 transition hover:text-red-500"
              aria-label="Close Modal"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredMedia.map((media, index) => (
                <div
                  key={index}
                  className="cursor-pointer rounded-lg border p-4 text-center transition hover:shadow-lg dark:border-gray-600"
                  onClick={() => handleChangeMedia(media.url)}
                >
                  <MdOndemandVideo className="mx-auto text-[6rem] text-red-500 sm:text-[8rem]" />
                  <p className="mt-2 break-words">
                    {extractTitle(media.title)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCourseModal;
