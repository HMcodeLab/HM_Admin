"use client";

import AllInstructorModel from "@/components/trainer/AllInstrucrorModal";
import React, { useEffect, useState } from "react";

interface Props {
  InstructorDetails: any[];
  courseDetails: any;
  setCourseDetails: (data: any) => void;
}

const InstructorDetail: React.FC<Props> = ({
  InstructorDetails,
  courseDetails,
  setCourseDetails,
}) => {
  const [selectedinstructorFromModal, setselectedinstructorFromModal] =
    useState(courseDetails?.instructor?._id || "");
  const [selectedModal, setSelectedModal] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setselectedinstructorFromModal(e.target.value);
  };

  // ✅ Fixed useEffect to avoid infinite loop
  useEffect(() => {
    setCourseDetails((prevCourseDetails: any) => ({
      ...prevCourseDetails,
      instructor: selectedinstructorFromModal,
    }));
  }, [selectedinstructorFromModal, setCourseDetails]);

  const openModal = () => setIsModalOpen(true);

  return (
    <div>
      {isModalOpen && (
        <AllInstructorModel
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          InstructorDetails={InstructorDetails}
          setselectedinstructorFromModal={setselectedinstructorFromModal}
        />
      )}

      <fieldset className="mx-[5%] flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-xl bg-white px-5 py-6 shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800">
          <p className="text-[16px] font-semibold text-gray-800 dark:text-white">
            Instructor ID
          </p>
          <div className="flex w-full items-center gap-4">
            <input
              type="text"
              name="instructor"
              value={selectedinstructorFromModal}
              onChange={handleInputChange}
              placeholder="Enter Instructor ID"
              className="w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-gray-800 shadow-inner outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-600 dark:bg-black dark:text-white"
            />
            <button
              className="rounded-md border-2 border-blue-600 px-5 py-2 font-medium text-blue-700 transition-all duration-200 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-white dark:hover:bg-blue-400"
              onClick={() => {
                openModal();
                setSelectedModal("instructor");
              }}
            >
              Choose
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default InstructorDetail;
