"use client";

import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {jwtDecode} from "jwt-decode";
import Loader from "@/components/Loader";

interface AddStudentModalProps {
  BatchId: string;
  courseId: string;
  handleToggleOpen: () => void;
  onStudentAdded: () => void;
}

interface Student {
  _id: string;
  name: string;
  email: string;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  BatchId,
  courseId,
  handleToggleOpen,
  onStudentAdded,
}) => {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");

  const adminToken =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") || ""
      : "";

  useEffect(() => {
    const fetchStudents = async () => {
      setStudentLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getAllCourseUsers/${courseId}`,
        );
        setAllStudents(response.data.users);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students.");
      } finally {
        setStudentLoading(false);
      }
    };

    if (courseId) fetchStudents();
  }, [courseId]);

  const handleStudentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStudent(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const decoded = jwtDecode<{ id: string }>(adminToken);

      if (decoded) {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/addUserToBatch`,
          {
            userID: selectedStudent,
            courseId,
            BatchId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${adminToken}`,
            },
          },
        );

        if (res.status === 200) {
          toast.success("Student added to Batch successfully!");
          onStudentAdded();
          handleToggleOpen();
        }
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Error adding student to Batch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (studentLoading) return <Loader />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 px-4">
      <Toaster position="top-center" />
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <button
            type="button"
            className="absolute right-3 top-2 text-lg font-bold text-red-500"
            onClick={() => setShowConfirmation(true)}
          >
            ×
          </button>
          <h2 className="text-center text-xl font-semibold text-gray-800 underline dark:text-white">
            Add Student to Batch
          </h2>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Batch ID
            </label>
            <input
              type="text"
              value={BatchId}
              disabled
              className="w-full rounded-md border bg-gray-100 px-3 py-2 focus:outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Course ID
            </label>
            <input
              type="text"
              value={courseId}
              disabled
              className="w-full rounded-md border bg-gray-100 px-3 py-2 focus:outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Student
            </label>
            <select
              value={selectedStudent}
              onChange={handleStudentChange}
              required
              className="w-full rounded-md border bg-white px-3 py-2 focus:outline-none dark:bg-gray-800 dark:text-white"
            >
              <option value="" disabled>
                Select a student
              </option>
              {allStudents.map((student) => (
                <option key={student._id} value={student._id}>
                  {`${student.name}, ${student.email}`}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {showConfirmation && (
        <div className="z-60 fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <p className="mb-4 text-gray-800 dark:text-gray-100">
              Are you sure you want to close without saving?
            </p>
            <div className="flex justify-around">
              <button
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={() => {
                  setShowConfirmation(false);
                  handleToggleOpen();
                }}
              >
                Yes
              </button>
              <button
                className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                onClick={() => setShowConfirmation(false)}
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

export default AddStudentModal;
