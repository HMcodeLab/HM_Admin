// app/components/AssessmentModal.tsx
"use client";

import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";

interface AssessmentForm {
  courseID: string;
  assessmentName: string;
  questions: File | string | null;
  startDate: string;
  lastDate: string;
  timelimit: string;
  isProtected: boolean | string;
}


interface AssessmentModalProps {
  courseId: string;
  handleToggleOpen: () => void;
  fetchCourseDetails: () => void;
}

const AssessmentModal: React.FC<AssessmentModalProps> = ({
  courseId,
  handleToggleOpen,
  fetchCourseDetails,
}) => {
  const [forms, setForms] = useState<AssessmentForm[]>([
    {
      courseID: courseId,
      assessmentName: "",
      questions: null,
      startDate: "",
      lastDate: "",
      timelimit: "",
      isProtected: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { theme } = useTheme();

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const values = [...forms];
    if (event.target.name === "questions" && event.target.files) {
      values[index][event.target.name] = event.target.files[0];
      toast.success("File uploaded successfully");
    } else {
      values[index][event.target.name as keyof AssessmentForm] =
        event.target.value;
    }
    setForms(values);
  };

  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : "";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    for (const form of forms) {
      if (
        !form.courseID ||
        !form.assessmentName ||
        !form.questions ||
        !form.startDate ||
        !form.lastDate ||
        !form.timelimit
      ) {
        toast.error("Please fill out all required fields and upload a file.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("courseID", form.courseID);
      formData.append("assessmentName", form.assessmentName);
      formData.append("questions", form.questions);
      formData.append("startDate", form.startDate);
      formData.append("lastDate", form.lastDate);
      formData.append("isProtected", String(form.isProtected));
      formData.append("timelimit", form.timelimit);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/createcourseassessment`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${adminToken}`,
            },
          },
        );

        if (response.status === 201) {
          toast.success("Assessment submitted successfully!");
          fetchCourseDetails();
          handleToggleOpen();
        }
      } catch (error) {
        toast.error("Error submitting assessment. Please try again.");
        console.error("Error submitting assessment:", error);
        handleToggleOpen();
      }
    }
    setLoading(false);
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/CourseAssessment.xlsx";
    link.download = "courseAssessmentTemplate.xlsx";
    link.click();
  };

  const handleConfirmation = () => setShowConfirmation(true);
  const handleConfirmClose = () => {
    setShowConfirmation(false);
    handleToggleOpen();
  };
  const handleCancelClose = () => setShowConfirmation(false);

  const handleIsProtectedChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newForms = [...forms];
    newForms[index].isProtected = event.target.value === "true";
    setForms(newForms);
  };

  return (
    <div className="fixed inset-0 z-50 top-[16vh] py-10 flex items-center justify-center overflow-x-auto overflow-y-auto">
      <Toaster />
      <div className="fixed inset-0 bg-black opacity-50" />
      <form
        onSubmit={handleSubmit}
        className={`relative mt-10 max-h-screen w-full max-w-xl overflow-y-auto rounded-lg border border-gray-300 bg-white p-4 text-black shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white`}
      >
        <button
          type="button"
          className="absolute right-2 top-2 font-bold text-red-500"
          onClick={handleConfirmation}
        >
          X
        </button>
        <h1 className="my-2 text-center text-lg font-bold underline">
          Assessment
        </h1>
        {forms.map((form, index) => (
          <div key={index} className="form-group mb-4 flex flex-col gap-2">
            <label className="font-semibold">Course ID</label>
            <input
              type="text"
              name="courseID"
              disabled
              value={form.courseID}
              onChange={(e) => handleInputChange(index, e)}
              className="rounded-md bg-gray-100 px-3 py-2 shadow-sm dark:bg-gray-800"
            />
            <label className="font-semibold">Assessment Name</label>
            <input
              type="text"
              name="assessmentName"
              value={form.assessmentName}
              onChange={(e) => handleInputChange(index, e)}
              required
              className="rounded-md bg-gray-100 px-3 py-2 shadow-sm dark:bg-gray-800"
            />
            <label className="font-semibold">Starting Date</label>
            <input
              type="datetime-local"
              name="startDate"
              value={form.startDate}
              onChange={(e) => handleInputChange(index, e)}
              required
              className="rounded-md bg-gray-100 px-3 py-2 shadow-sm dark:bg-gray-800"
            />
            <label className="font-semibold">Ending Date</label>
            <input
              type="datetime-local"
              name="lastDate"
              value={form.lastDate}
              onChange={(e) => handleInputChange(index, e)}
              required
              className="rounded-md bg-gray-100 px-3 py-2 shadow-sm dark:bg-gray-800"
            />
            <label className="font-semibold">Duration (minutes)</label>
            <input
              type="number"
              name="timelimit"
              value={form.timelimit}
              onChange={(e) => handleInputChange(index, e)}
              required
              className="rounded-md bg-gray-100 px-3 py-2 shadow-sm dark:bg-gray-800"
            />
            <label className="font-semibold">Questions (.xlsx)</label>
            <input
              type="file"
              name="questions"
              accept=".xlsx,.xls"
              onChange={(e) => handleInputChange(index, e)}
              required
              className="mt-1"
            />
            <div className="mt-2 flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="true"
                  checked={form.isProtected === true}
                  onChange={(e) => handleIsProtectedChange(index, e)}
                />
                <span>Protected</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="false"
                  checked={form.isProtected === false}
                  onChange={(e) => handleIsProtectedChange(index, e)}
                />
                <span>Unprotected</span>
              </label>
            </div>
          </div>
        ))}
        <div className="mt-4 flex justify-between">
          <button
            type="submit"
            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Download Template
          </button>
        </div>
      </form>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
            <p>Are you sure you want to close without saving?</p>
            <div className="mt-4 flex justify-around">
              <button
                className="rounded-md bg-red-600 px-4 py-2 text-white"
                onClick={handleConfirmClose}
              >
                Yes
              </button>
              <button
                className="rounded-md bg-gray-600 px-4 py-2 text-white"
                onClick={handleCancelClose}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentModal;
