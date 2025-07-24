"use client";

import { Instructor } from "@/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";

interface AllInstructorModelProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  InstructorDetails: Instructor[];
  setselectedinstructorFromModal: React.Dispatch<React.SetStateAction<string>>;
}

const AllInstructorModel: React.FC<AllInstructorModelProps> = ({
  isModalOpen,
  setIsModalOpen,
  InstructorDetails,
  setselectedinstructorFromModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInstructors, setFilteredInstructors] = useState<Instructor[]>(
    [],
  );

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInstructors(InstructorDetails);
    } else {
      const filtered = InstructorDetails.filter((instructor) =>
        instructor.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredInstructors(filtered);
    }
  }, [searchTerm, InstructorDetails]);

  if (!isModalOpen) return null;

  const isLoading = InstructorDetails.length === 0 && searchTerm === "";

  return (
    <div
      className="fixed left-0 top-10 z-999 flex h-screen w-full items-start justify-center overflow-auto bg-black bg-opacity-50 p-4 pt-[80px]"
      aria-modal="true"
      role="dialog"
    >
      <div className="animate-slideDown relative mb-5 w-full max-w-6xl transform rounded-xl bg-white p-6 shadow-lg transition-all duration-300 dark:bg-gray-900 dark:text-white">
        {/* Close Button */}
        <button
          aria-label="Close modal"
          onClick={() => setIsModalOpen(false)}
          className="absolute right-4 top-4 text-3xl font-bold text-gray-400 hover:text-red-500 focus:outline-none dark:text-gray-300"
        >
          &times;
        </button>

        {/* Title and Search */}
        <div className="mb-6 mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h2 className="text-center text-2xl font-bold tracking-wide sm:text-left">
            Select Instructor
          </h2>
          <input
            type="text"
            placeholder="Search Instructor..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loader */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader /> {/* ✅ Use your custom loader */}
          </div>
        ) : (
          // Instructor Cards
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filteredInstructors.length > 0 ? (
              filteredInstructors.map((instructor) => (
                <div
                  key={instructor._id}
                  className="group cursor-pointer rounded-xl border border-gray-200 bg-gray-100 p-4 shadow-sm transition duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  onClick={() => {
                    setselectedinstructorFromModal(instructor._id);
                    setIsModalOpen(false);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setselectedinstructorFromModal(instructor._id);
                      setIsModalOpen(false);
                    }
                  }}
                >
                  <div className="flex flex-col items-center">
                    <Image
                      src={
                        instructor.profile?.trim()
                          ? instructor.profile
                          : "/images/instimage.png"
                      }
                      alt={`Profile of ${instructor.name ?? "Instructor"}`}
                      className="h-36 w-36 rounded-lg object-cover shadow-md transition-transform group-hover:scale-105"
                      loading="lazy"
                      width={200}
                      height={200}
                    />
                    <span className="mt-4 text-center text-base font-semibold text-gray-700 dark:text-white">
                      {instructor.name ?? "Unnamed Instructor"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
                No instructors found.
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            transform: translateY(-10%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AllInstructorModel;
