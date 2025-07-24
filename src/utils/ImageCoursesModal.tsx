"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader";
import { ImageCoursesModalProps, MediaItem } from "@/types";

const ImageCoursesModal = <T extends object>({
  isModalImageOpen,
  setIsModalImageOpen,
  courseDetails,
  setCourseDetails,
  type,
  uploadedMedia,
  setSelectedMediaFromModal,
  darkMode = false,
}: ImageCoursesModalProps<T>) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);



    console.log("courseDetails in modal", courseDetails);
    console.log("type in modal", type);
    console.log("uploadedMedia in modal", uploadedMedia);
    console.log("selectedMediaFromModal in modal", setSelectedMediaFromModal);

  // Dynamically update items per page based on screen width
  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    if (width >= 1280) setItemsPerPage(12);
    else if (width >= 1024) setItemsPerPage(9);
    else if (width >= 768) setItemsPerPage(6);
    else setItemsPerPage(4);
  };

  useEffect(() => {
    setLoading(true);
    const imageFiles = uploadedMedia.filter(
      (media) =>
        /\.(jpg|jpeg|png|webp)$/i.test(media.url) &&
        media.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredMedia(imageFiles);
    setLoading(false);
  }, [uploadedMedia, searchQuery]);

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const handleChangeMedia = (url: string) => {
    if (type === "featured_image") {
      setCourseDetails({ ...courseDetails, featured_image: url });
    } else if (type === "bannerImg") {
      setCourseDetails({ ...courseDetails, bannerImg: url });
    } else {
      setSelectedMediaFromModal(url);
    }
    setIsModalImageOpen(false);
  };

  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
  const paginatedMedia = filteredMedia.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const extractFilename = (title: string): string => {
    const match = title
      .split("/")
      .pop()
      ?.match(/^\d{13}-(.+?)\.(jpg|jpeg|png|webp)/i);
    return match ? match[1] : title;
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };

    return (
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`rounded-md px-3 py-1 font-medium ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 dark:bg-gray-700"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          }`}
        >
          {"<<"}
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`rounded-md px-3 py-1 font-medium ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 dark:bg-gray-700"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          }`}
        >
          {"<"}
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`rounded-md px-3 py-1 font-medium ${
              currentPage === page
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`rounded-md px-3 py-1 font-medium ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 dark:bg-gray-700"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          }`}
        >
          {">"}
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`rounded-md px-3 py-1 font-medium ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 dark:bg-gray-700"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          }`}
        >
          {">>"}
        </button>
      </div>
    );
  };

  return (
    
    <AnimatePresence>
      {isModalImageOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative h-[80vh] top-10 w-[90vw] max-w-6xl overflow-y-auto rounded-md bg-white p-6 shadow-lg dark:bg-gray-900"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex flex-col items-center justify-between gap-3 bg-white p-4 shadow-md dark:bg-gray-900 sm:flex-row">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Select an Image
              </p>
              <div className="flex w-full items-center gap-4 sm:w-auto">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-2xl border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:w-80"
                  value={searchQuery}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <button
                  onClick={() => setIsModalImageOpen(false)}
                  className="text-2xl text-gray-500 hover:text-red-600 dark:text-gray-300"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Body */}
            {loading ? (
              <div className="mt-20 flex justify-center">
                <Loader />
              </div>
            ) : paginatedMedia.length === 0 ? (
              <div className="mt-10 text-center text-gray-600 dark:text-gray-400">
                No images found.
              </div>
            ) : (
              <>
                <div className="my-6 grid grid-cols-2 gap-6 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
                  {paginatedMedia.map((media, index) => (
                    <button
                      key={media.url + index}
                      onClick={() => handleChangeMedia(media.url)}
                      className="flex flex-col items-center rounded-md transition hover:scale-105"
                    >
                      <img
                        src={media.url}
                        alt={extractFilename(media.title)}
                        className="mb-2 h-36 w-full max-w-[180px] rounded-md bg-gray-50 object-contain dark:bg-gray-800"
                      />
                      <span className="w-full truncate text-center text-sm text-gray-700 dark:text-gray-300">
                        {extractFilename(media.title)}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                  <Pagination />
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageCoursesModal;
