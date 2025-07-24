"use client";

// components/InstructorDetail.tsx

import React, { useEffect, useState, ChangeEvent } from "react";
import AllInstructorModel from "@/components/trainer/AllInstrucrorModal";
import { Instructor, InternshipData } from "@/types";


interface CourseDetailsType {
  instructor: string; // storing instructor _id
  // Add other course detail fields if needed
}

// interface InstructorDetailProps {
//   InstructorDetails: Instructor[];
//   courseDetails: CourseDetailsType;
//   setCourseDetails: React.Dispatch<React.SetStateAction<CourseDetailsType>>;
// }

interface InstructorDetailProps {
  InstructorDetails: Instructor[];
  courseDetails: InternshipData; // accept full InternshipData
  setCourseDetails: React.Dispatch<React.SetStateAction<InternshipData>>;
}



const InstructorDetail: React.FC<InstructorDetailProps> = ({
  InstructorDetails,
  courseDetails,
  setCourseDetails,
}) => {
  const [selectedInstructorFromModal, setSelectedInstructorFromModal] =
    useState<string>(courseDetails?.instructor || "");
  const [selectedModal, setSelectedModal] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value);
    // Update courseDetails state
    setCourseDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Close modal if needed (not typical for input change, but kept your logic)
    setIsModalOpen(false);
  };

  useEffect(() => {
    setCourseDetails((prev) => ({
      ...prev,
      instructor: selectedInstructorFromModal,
    }));
  }, [selectedInstructorFromModal, setCourseDetails]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      {isModalOpen && (
        <AllInstructorModel
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          InstructorDetails={InstructorDetails}
          setselectedinstructorFromModal={setSelectedInstructorFromModal}
          // type={selectedModal}
        />
      )}

      <fieldset className="mx-[5%] flex flex-col gap-4">
        <div className="from-greenColor flex flex-col gap-2 rounded-md bg-gradient-to-r to-green-300 px-5 py-6 shadow-md shadow-green-500/5">
          <p className="font-Montserrat text-[16px] font-semibold text-green-100">
            Instructor Id
          </p>
          <div className="flex w-full gap-6">
            <input
              type="text"
              name="instructor"
              value={selectedInstructorFromModal}
              onChange={handleInputChange}
              placeholder="Enter Id"
              className="w-full rounded-md px-2 py-1 text-green-400 shadow-md outline-none"
            />
            <button
              type="button"
              className="rounded-md border-2 border-green-500 px-4 py-2 font-semibold text-green-600 hover:bg-green-500 hover:text-white"
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
