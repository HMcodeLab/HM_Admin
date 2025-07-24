"use client";

import { CourseDetailsType } from "@/types";
import AssessmentModal from "@/utils/AssessmentModal";
import UpdateAssessmentModal from "@/utils/UpdateAssessmentModal";
import React, { useState } from "react";

interface AllAssessmentsProps {
  courseDetails: CourseDetailsType;
  fetchCourseDetails: () => void;
}

const AllAssessments: React.FC<AllAssessmentsProps> = ({
  courseDetails,
  fetchCourseDetails,
}) => {
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState<string | null>(null);

  const handleAssessmentModal = () => {
    setAssessmentModalOpen(!assessmentModalOpen);
  };

  const handleAssessmentUpdateModalOpen = (assessmentId: string) => {
    setOpenUpdateModal((prevId) =>
      prevId === assessmentId ? null : assessmentId,
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-Montserrat mb-8 text-center text-3xl font-bold tracking-wide text-green-700">
        Course Assessments
      </h1>

      <div className="rounded-lg p-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Assessment List */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold tracking-tight text-green-800">
              All Assessments
            </h2>
            {courseDetails.assessments?.length === 0 && (
              <p className="italic text-gray-500">No assessments available.</p>
            )}
            {courseDetails.assessments?.map((assessment, index) => (
              <div
                key={`assessment-${index}`}
                className="flex cursor-pointer items-center justify-between rounded-md border border-green-300 p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col">
                  <p className="font-semibold text-green-900">
                    {assessment.assessmentName}
                  </p>
                  <p className="text-sm text-green-700 opacity-80">
                    Questions: {assessment.questions}
                  </p>
                </div>
                <button
                  className="rounded-md border border-green-700 px-3 py-1 text-green-700 transition hover:bg-green-700 hover:text-white"
                  onClick={() =>
                    handleAssessmentUpdateModalOpen(assessment._id)
                  }
                >
                  Update
                </button>
                {openUpdateModal === assessment._id && (
                  <UpdateAssessmentModal
                    fetchCourseDetails={fetchCourseDetails}
                    handleToggleOpen={() =>
                      handleAssessmentUpdateModalOpen(assessment._id)
                    }
                    assessment={assessment}
                    assessmentID={assessment._id}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Upload Assessment */}
          <div className="flex flex-col items-start justify-center gap-6">
            <h2 className="text-2xl font-semibold tracking-tight text-green-800">
              Upload Assessment
            </h2>
            <button
              className="rounded-md border border-green-700 px-8 py-3 font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
              onClick={handleAssessmentModal}
            >
              Upload Assessment
            </button>
            {assessmentModalOpen && (
              <AssessmentModal
                fetchCourseDetails={fetchCourseDetails}
                courseId={courseDetails.courseID}
                handleToggleOpen={handleAssessmentModal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAssessments;
