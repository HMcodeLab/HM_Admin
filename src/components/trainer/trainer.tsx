"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { CiEdit as Edit } from "react-icons/ci";
import { FaRegUser as User } from "react-icons/fa6";
import { MdDeleteForever as DeleteIcon } from "react-icons/md";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/Loader";
import Image from "next/image";

interface Instructor {
  _id: string;
  name: string;
  email: string;
  profile?: string;
}

const Trainer: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // For fetching list
  const [actionLoading, setActionLoading] = useState<boolean>(false); // For edit/delete/profile actions
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState<
    string | null
  >(null);
  const [search, setSearch] = useState<string>("");

  const router = useRouter();
  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  // Wrap fetchData in useCallback so it can be a stable dependency in useEffect
const fetchData = useCallback(
  async (name: string = "") => {
    setLoading(true);
    try {
      const endpoint = name
        ? `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/searchinstructor?name=${encodeURIComponent(name)}`
        : `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/instructors`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      // ✅ Sort latest instructors first
      const sortedInstructors = (response.data.data || []).sort((a: any, b: any) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // latest first
        }
        return b._id.localeCompare(a._id); // fallback if createdAt missing
      });

      setInstructors(sortedInstructors);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch instructors");
    } finally {
      setLoading(false);
    }
  },
  [adminToken],
);


  // Fetch instructors on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch instructors on search with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(search);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, fetchData]);

  const handleDeleteInstructor = async () => {
    if (!selectedInstructorId) return;
    setActionLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/deleteinstructor/${selectedInstructorId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );
      toast.success("Instructor Deleted Successfully");
      fetchData(search); // Refresh list
      toggleDeleteModal(null);
    } catch (error) {
      toast.error("Unable to delete instructor");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleDeleteModal = (id: string | null) => {
    setDeleteModal(!deleteModal);
    setSelectedInstructorId(id);
  };

  const editModeActive = (instructor: Instructor) => {
    setActionLoading(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("instructorEmail", instructor.email);
      localStorage.setItem("instructorId", instructor._id);
    }
    router.push(`/trainer/edit/${instructor._id}`);
  };

  const handleViewProfile = (email: string) => {
    setActionLoading(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("instructorEmail", email);
    }
    router.push("/trainer/profile");
  };

  if (loading || actionLoading) return <Loader />;

  return (
    <div className="px-4 py-6">
      <Toaster position="top-center" />

      {/* Header and Search */}
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Instructors
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60 rounded-full border border-gray-300 bg-white px-4 py-2 pl-10 text-gray-700 shadow-md 
            transition-all duration-300 focus:w-72 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <svg
            className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>
        </div>
      </div>

      {/* Instructor Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {instructors?.map((instructor) => (
          <div
            key={instructor._id}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/80 shadow-xl backdrop-blur-sm transition hover:scale-105 dark:border-gray-700 dark:bg-gray-800/80"
          >
            <Image
              src={instructor.profile || "/images/default-avatar.avif"}
              onError={(e) =>
                (e.currentTarget.src = "/images/default-avatar.avif")
              }
              alt="Instructor"
              className="h-64 w-full object-cover transition-all duration-300 group-hover:scale-105"
              width={300}
              height={300}
            />

            <div className="absolute right-2 top-2 z-10 flex gap-2 rounded-full bg-white p-2 shadow-md dark:bg-gray-900">
              <Edit
                className="text-2xl text-gray-600 hover:cursor-pointer hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                onClick={() => editModeActive(instructor)}
              />
              <DeleteIcon
                className="text-2xl text-gray-600 hover:cursor-pointer hover:text-red-600 dark:text-gray-300"
                onClick={() => toggleDeleteModal(instructor._id)}
              />
            </div>

            <div className="flex flex-col items-center justify-center px-4 py-5">
              <p className="text-center text-lg font-semibold text-gray-800 dark:text-white">
                {instructor.name}
              </p>

              <button
                onClick={() => handleViewProfile(instructor.email)}
                className="mt-4 flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2 text-white transition hover:scale-105 dark:from-emerald-700 dark:to-emerald-800"
              >
                <User className="text-xl" />
                Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-[90%] max-w-md rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:border-gray-600 dark:bg-gray-900">
            <h3 className="text-xl font-semibold dark:text-white">
              Delete Instructor
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this instructor?
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={handleDeleteInstructor}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => toggleDeleteModal(null)}
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trainer;
