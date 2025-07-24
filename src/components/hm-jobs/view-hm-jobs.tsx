"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

interface Job {
  _id: string;
  position: string;
  company: string;
  logoUrl: string;
  publishStatus: string;
}

const ViewHMJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobIdToDelete, setJobIdToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setJobIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!jobIdToDelete) return;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/deleteInHousePlacementJob`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
          data: { jobid: jobIdToDelete },
        },
      );

      if (response.data.success) {
        toast.success("Job deleted successfully!");
        setJobs(jobs.filter((job) => job._id !== jobIdToDelete));
      } else {
        toast.error("Failed to delete the job.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting job.");
    } finally {
      setIsDeleteModalOpen(false);
      setJobIdToDelete(null);
    }
  };


  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getAllInHousePlacement`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (response?.data?.InHousePlacements) {
        setJobs(response.data.InHousePlacements);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching InHousePlacement posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/hm-jobs/update/${id}`);
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/changeInHousePlacementStatus`,
        { _id: jobId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Job status updated successfully!");
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, publishStatus: newStatus } : job,
          ),
        );
      } else {
        toast.error("Failed to update job status.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating job status.");
    }
  };


  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    jobId: string,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [jobId]: file }));
    }
  };

  const handleFileUpload = async (jobId: string) => {
    const file = selectedFiles[jobId];
    if (!file) return toast.error("Please select a file first.");

    const formData = new FormData();
    formData.append("jobid", jobId);
    formData.append("applicants", file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/addApplicantsForInHousePlacement`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        toast.success("File uploaded successfully!");
      } else {
        toast.error("Failed to upload file.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error uploading file.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-6 dark:bg-gray-900">
      <Toaster position="top-center" />
      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
        In-House Job Placements
      </h2>

      {jobs.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-200 text-sm uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                <th className="px-6 py-3 text-left">Sr.No.</th>
                <th className="px-6 py-3 text-left">Position</th>
                <th className="px-6 py-3 text-left">Company</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
                <th className="px-6 py-3 text-left">Upload Applicants</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600 dark:text-gray-300">
              {jobs?.map((job, index) => (
                <tr
                  key={job._id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-3">{job.position}</td>
                  <td className="flex items-center gap-2 px-6 py-3">
                    <img
                      src={job.logoUrl}
                      alt="logo"
                      className="h-10 w-10 rounded-full ring-2 ring-green-500"
                    />
                    {job.company}
                  </td>
                  <td className="px-6 py-3">
                    <select
                      value={job.publishStatus}
                      onChange={(e) =>
                        handleStatusChange(job._id, e.target.value)
                      }
                      className={`rounded-full border px-3 py-1 text-center text-xs ${
                        job.publishStatus === "active"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="flex gap-4 px-6 py-3">
                    <FaEdit
                      onClick={() => handleEdit(job._id)}
                      className="cursor-pointer text-yellow-500 hover:text-yellow-600"
                    />
                    <FaTrash
                      onClick={() => handleDelete(job._id)}
                      className="cursor-pointer text-red-500 hover:text-red-600"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept=".xls,.xlsx"
                        onChange={(e) => handleFileChange(e, job._id)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-green-700 hover:file:bg-green-100"
                      />
                      <button
                        onClick={() => handleFileUpload(job._id)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
                      >
                        <FaUpload /> Upload
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
          No jobs found.
        </p>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              Delete Confirmation
            </h2>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this job?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="rounded bg-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setJobIdToDelete(null);
                }}
              >
                No
              </button>
              <button
                className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                onClick={confirmDelete}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewHMJobs;
