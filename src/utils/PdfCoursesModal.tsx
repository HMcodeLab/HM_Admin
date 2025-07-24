"use client";

import { MediaItem, PdfCoursesModalProps } from "@/types";
import { useEffect, useState } from "react";

const PdfCoursesModal = <T,>({
  isModalPdfOpen,
  setIsModalPdfOpen,
  courseDetails,
  setCourseDetails,
  type,
  uploadedMedia,
  setSelectedMediaFromModal,
}: PdfCoursesModalProps<T>) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  const updateItemsPerPage = () => {
    if (window.matchMedia("(min-width: 1280px)").matches) {
      setItemsPerPage(12);
    } else if (window.matchMedia("(min-width: 1024px)").matches) {
      setItemsPerPage(9);
    } else if (window.matchMedia("(min-width: 768px)").matches) {
      setItemsPerPage(6);
    } else {
      setItemsPerPage(4);
    }
  };

  useEffect(() => {
    const pdfFiles = uploadedMedia.filter(
      (media) =>
        media.url.toLowerCase().endsWith(".pdf") &&
        media.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredMedia(pdfFiles);
  }, [uploadedMedia, searchQuery]);

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const handleChangeMedia = (url: string) => {
    setSelectedMediaFromModal(url);
    setIsModalPdfOpen(false);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMedia = filteredMedia.slice(startIndex, endIndex);

  return isModalPdfOpen ? (
    <div className="fixed left-0 top-0 z-50 mt-[5vh] flex h-full w-full justify-center bg-black bg-opacity-50">
      <div className="my-auto h-[80%] w-[90%] overflow-y-auto rounded-md bg-white px-4 text-black shadow-md dark:bg-gray-900 dark:text-white lg:w-[80%]">
        {/* Header */}
        <div className="sticky top-0 z-10 mt-2 flex w-full flex-col items-center justify-between gap-3 rounded-md bg-white p-4 px-5 shadow-md dark:bg-gray-800 sm:flex-row">
          <p className="text-center font-semibold">Select a PDF</p>
          <div className="flex w-full items-center gap-4 sm:w-fit">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-gray-600 shadow-md focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:w-[25rem]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="text-3xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setIsModalPdfOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>

        {/* PDF Grid */}
        <div className="mb-8 mt-4 grid gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedMedia.map((media, index) => (
            <div
              key={index}
              className="relative mx-auto h-40 w-72 cursor-pointer px-4 font-semibold"
              onClick={() => handleChangeMedia(media.url)}
            >
              <div className="card relative h-full w-full overflow-hidden rounded-md border shadow-sm dark:border-gray-700">
                <iframe
                  src={media.url}
                  title={`PDF Preview ${index}`}
                  className="h-full w-full"
                />
                <span className="absolute bottom-0 left-0 right-0 truncate bg-white py-1 text-center text-sm dark:bg-gray-800">
                  {media.title}
                </span>
                <div className="absolute inset-0 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="rounded border px-3 py-1 hover:bg-gray-200"
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from(
            { length: Math.ceil(filteredMedia.length / itemsPerPage) },
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`rounded border px-3 py-1 ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ),
          )}

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredMedia.length / itemsPerPage),
                ),
              )
            }
            className="rounded border px-3 py-1 hover:bg-gray-200"
            disabled={
              currentPage === Math.ceil(filteredMedia.length / itemsPerPage)
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default PdfCoursesModal;
