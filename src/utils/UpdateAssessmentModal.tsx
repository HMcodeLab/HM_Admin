"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

import {
  Assessment,
  UpdateAssessmentModalProps as Props,
  AssessmentFormState as FormState,
} from "@/types"; // Update path based on your project structure

const UpdateAssessmentModal: React.FC<Props> = ({
  assessment,
  assessmentID,
  handleToggleOpen,
  fetchCourseDetails,
}) => {
  const [form, setForm] = useState<FormState>({
    assessment_id: "",
    assessmentName: "",
    lastDate: "",
    timelimit: 0,
    isProtected: false,
  });

  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (assessment && assessmentID) {
      setForm({
        assessment_id: assessmentID,
        assessmentName: assessment.assessmentName || "",
        lastDate: assessment.lastDate || "",
        timelimit: assessment.timelimit || 0,
        isProtected: assessment.isProtected,
      });
    }
  }, [assessment, assessmentID]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "timelimit" ? parseInt(value, 10) : value,
    }));
  };

  const handleIsProtectedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      isProtected: e.target.value === "true",
    }));
  };

  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!adminToken) throw new Error("No token found");

      const decoded = jwtDecode(adminToken);
      if (!decoded) throw new Error("Invalid token");

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/updateassessment`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (response.status === 200) {
        toast.success("Assessment updated successfully!");
        fetchCourseDetails();
        handleToggleOpen();
      }
    } catch (error) {
      toast.error("Failed to update assessment. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmation(false);
    handleToggleOpen();
  };

  const handleCancelClose = () => {
    setShowConfirmation(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Toaster />
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>

      <form
        onSubmit={handleSubmit}
        className="relative max-h-screen w-[90%] overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 text-gray-900 shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:text-white sm:w-[500px]"
      >
        <button
          type="button"
          className="absolute right-3 top-2 text-lg font-bold text-red-600 hover:text-red-800"
          onClick={() => setShowConfirmation(true)}
        >
          ✕
        </button>

        <h2 className="mb-4 text-center text-2xl font-bold">
          Update Assessment
        </h2>

        <div className="flex flex-col gap-4">
          <label>
            <span className="font-semibold">Assessment ID</span>
            <input
              type="text"
              name="assessment_id"
              value={form.assessment_id}
              disabled
              className="mt-1 w-full rounded-md bg-gray-100 px-3 py-2 shadow focus:outline-none dark:bg-gray-800"
            />
          </label>

          <label>
            <span className="font-semibold">Assessment Name</span>
            <input
              type="text"
              name="assessmentName"
              value={form.assessmentName}
              onChange={handleInputChange}
              required
              className="mt-1 w-full rounded-md bg-gray-100 px-3 py-2 shadow focus:outline-none dark:bg-gray-800"
            />
          </label>

          <label>
            <span className="font-semibold">Ending Date</span>
            <input
              type="datetime-local"
              name="lastDate"
              value={formatDate(form.lastDate)}
              onChange={handleInputChange}
              required
              className="mt-1 w-full rounded-md bg-gray-100 px-3 py-2 shadow focus:outline-none dark:bg-gray-800"
            />
          </label>

          <label>
            <span className="font-semibold">Duration (minutes)</span>
            <input
              type="number"
              name="timelimit"
              value={form.timelimit}
              onChange={handleInputChange}
              min={0}
              required
              className="mt-1 w-full rounded-md bg-gray-100 px-3 py-2 shadow focus:outline-none dark:bg-gray-800"
            />
          </label>

          <div className="flex items-center gap-4">
            <span className="font-semibold">Is Protected</span>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="isProtected"
                value="true"
                checked={form.isProtected === true}
                onChange={handleIsProtectedChange}
              />
              <span>True</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="isProtected"
                value="false"
                checked={form.isProtected === false}
                onChange={handleIsProtectedChange}
              />
              <span>False</span>
            </label>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[90%] rounded-lg bg-white p-6 text-gray-900 shadow-lg dark:bg-gray-900 dark:text-white sm:w-[400px]">
            <p className="text-center text-lg font-semibold">
              Are you sure you want to close without saving?
            </p>
            <div className="mt-6 flex justify-center gap-6">
              <button
                onClick={handleConfirmClose}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={handleCancelClose}
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
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

export default UpdateAssessmentModal;
