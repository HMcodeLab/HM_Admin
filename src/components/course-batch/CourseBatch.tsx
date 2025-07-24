"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import { FaTrash, FaEdit, FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import { Batch } from "@/types";

import StudentInBatches from "./StudentInBatches";
import AddStudentModal from "./AddStudentModal";
import EditBatchModal from "./EditBatchModal";

interface Course {
  _id: string;
  title: string;
  display: boolean;
}



export default function CourseBatch() {
  const [allCourseDetails, setAllCourseDetails] = useState<
    { courseId: string; title: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [batchData, setBatchData] = useState<Batch[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [studentView, setStudentView] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/coursesforadmin`,
      );
      if (response?.data) {
        const filteredCourses = response.data
          .filter((course: Course) => course.display !== false)
          .map((course: Course) => ({
            courseId: course._id,
            title: course.title,
          }));
        setAllCourseDetails(filteredCourses);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getAllBatchesForCourse/${selectedCourse}`,
      );
      if (response?.data) {
        setBatchData(response.data);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (batch: Batch) => {
    setSelectedBatch(batch);
    setStudentModalOpen(false);
    setStudentView(false);
    setEditModalOpen(true);
  };

  const handleEditBatch = () => {
    fetchBatches();
    setEditModalOpen(false);
  };

  const handleViewStudent = (batch: Batch) => {
    setSelectedBatch(batch);
    setEditModalOpen(false);
    setStudentModalOpen(false);
    setStudentView(true);
  };

  const handleAddStudent = (batch: Batch) => {
    setSelectedBatch(batch);
    setEditModalOpen(false);
    setStudentView(false);
    setStudentModalOpen(true);
  };

  const handleStudentAdded = () => {
    fetchBatches();
    setStudentModalOpen(false);
  };

  const handleViewStudentInBatch = () => {
    fetchBatches();
    setStudentView(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen p-4 dark:bg-gray-900 sm:p-6">
      {loading && <Loader />}

      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="rounded-md border p-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">-- Select a Course --</option>
            {allCourseDetails.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              fetchBatches();
              setStudentView(false);
            }}
            disabled={!selectedCourse}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            Fetch Batches
          </button>
        </div>

        {batchData?.length > 0 ? (
          <div className="mt-6 w-full overflow-auto">
            <table className="w-full border border-gray-300 text-sm dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="border p-2 dark:border-gray-700">Batch ID</th>
                  <th className="border p-2 dark:border-gray-700">
                    Start Date
                  </th>
                  <th className="border p-2 dark:border-gray-700">End Date</th>
                  <th className="border p-2 dark:border-gray-700">Users</th>
                  <th className="border p-2 dark:border-gray-700">
                    Batch Limit
                  </th>
                  <th className="border p-2 dark:border-gray-700">Actions</th>
                  <th className="border p-2 dark:border-gray-700">Students</th>
                </tr>
              </thead>
              <tbody>
                {batchData.map((batch, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="border p-2 dark:border-gray-700">
                      {batch.batchId}
                    </td>
                    <td className="border p-2 dark:border-gray-700">
                      {formatDate(batch.startDate)}
                    </td>
                    <td className="border p-2 dark:border-gray-700">
                      {formatDate(batch.endDate)}
                    </td>
                    <td className="border p-2 text-center dark:border-gray-700">
                      {batch.users?.length || 0}
                    </td>
                    <td className="border p-2 text-center dark:border-gray-700">
                      {batch.batchlimit}
                    </td>
                    <td className="border p-2 text-center dark:border-gray-700">
                      <FaEdit
                        className="inline cursor-pointer text-yellow-500"
                        onClick={() => handleEdit(batch)}
                      />
                    </td>
                    <td className="flex items-center justify-center gap-2 border p-2 text-center dark:border-gray-700">
                      <FaUserPlus
                        className="cursor-pointer text-green-600"
                        onClick={() => handleAddStudent(batch)}
                      />
                      {batch.users?.length > 0 ? (
                        studentView && selectedBatch?._id === batch._id ? (
                          <FaEye
                            className="cursor-pointer text-blue-600"
                            onClick={() => setStudentView(false)}
                          />
                        ) : (
                          <FaEyeSlash
                            className="cursor-pointer text-blue-600"
                            onClick={() => handleViewStudent(batch)}
                          />
                        )
                      ) : (
                        <FaEyeSlash className="text-gray-400" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : batchData && batchData.length === 0 ? (
          <p className="mt-6 text-lg font-medium dark:text-gray-300">
            Select a course to view batches.
          </p>
        ) : null}

        {editModalOpen && selectedBatch && (
          <EditBatchModal
            batchId={selectedBatch._id}
            handleToggleOpen={() => setEditModalOpen(false)}
            onHandleEditBatch={handleEditBatch}
          />
        )}

        {studentView && selectedBatch && (
          <StudentInBatches
            batch={{
              ...selectedBatch,
              batchName: selectedBatch?.batchName || "",
              course: selectedBatch?.course || {},
            }}
            onStudentView={handleViewStudentInBatch}
          />
        )}

        {studentModalOpen && selectedBatch && (
          <AddStudentModal
            BatchId={selectedBatch._id}
            courseId={selectedCourse}
            handleToggleOpen={() => setStudentModalOpen(false)}
            onStudentAdded={handleStudentAdded}
          />
        )}
      </div>
    </div>
  );
}
