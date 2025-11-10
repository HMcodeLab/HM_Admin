"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CiEdit as Edit, CiUser as User } from "react-icons/ci";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import Image from "next/image";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";

interface University {
  _id: string;
  name: string;
  email: string;
  profile?: string;
}

const University: React.FC = () => {
  const [collegeUsers, setCollegeUsers] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingView, setLoadingView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<University | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  // Fetch universities
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/collegeUsers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      // ✅ Sort latest first (by _id or createdAt if available)
      const sortedData = res.data.data.sort((a: any, b: any) => {
        // If createdAt exists in your schema, prefer this:
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Otherwise, sort using ObjectId timestamp
        return b._id.localeCompare(a._id);
      });

      setCollegeUsers(sortedData);
      setFilteredUniversities(sortedData);
    } catch (error) {
      console.error("Failed to fetch universities:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  // Filter universities based on search
  useEffect(() => {
    const result = collegeUsers.filter((uni) =>
      uni?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUniversities(result);
  }, [searchTerm, collegeUsers]);

  // Prefetch detail pages
  useEffect(() => {
    filteredUniversities.forEach((college) => {
      router.prefetch(`/university/${college._id}`);
    });
  }, [filteredUniversities, router]);

  // Edit handler
  const editModeActive = (college: University) => {
    localStorage.setItem("collegeEmail", college.email);
    router.push(`/university/edit?email=${college.email}`);
  };

  // View details handler
  const handleViewDetails = (college: University) => {
    setLoadingView(true);
    localStorage.setItem("universityEmail", college.email);
    router.push(
      `/university/details?email=${encodeURIComponent(
        college.email
      )}&name=${encodeURIComponent(college.name)}`
    );
  };

  // Delete handler — open confirmation modal
  const handleDeleteClick = (college: University) => {
    setSelectedCollege(college);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedCollege) return;
    setDeleting(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/collegeUsers/${selectedCollege._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setCollegeUsers((prev) =>
        prev.filter((college) => college._id !== selectedCollege._id)
      );
      setFilteredUniversities((prev) =>
        prev.filter((college) => college._id !== selectedCollege._id)
      );
      setShowDeleteModal(false);
      setSelectedCollege(null);
    } catch (error) {
      console.error("Failed to delete university:", error);
      alert("Failed to delete university. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // University card component
  const UniversityCard: React.FC<{ college: University }> = ({ college }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="group relative flex transform flex-col items-center space-y-4 rounded-2xl border border-gray-200 p-5 text-center shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="absolute right-3 top-3 flex space-x-2">
          <Edit
            onClick={() => editModeActive(college)}
            className="cursor-pointer text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-300"
            size={22}
          />
          <MdDelete
            onClick={() => handleDeleteClick(college)}
            className="cursor-pointer text-gray-500 transition-colors hover:text-red-600 dark:text-gray-300"
            size={22}
          />
        </div>

        {!imageError && college.profile ? (
          <Image
            src={college.profile}
            width={130}
            height={130}
            alt="University Logo"
            className="rounded-full border-4 border-blue-200 object-cover transition-transform duration-300 group-hover:scale-105 dark:border-gray-600"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-[130px] w-[130px] items-center justify-center rounded-full border-4 border-blue-200 bg-blue-100 dark:border-gray-600 dark:bg-gray-700">
            <HiOutlineAcademicCap
              className="text-blue-600 dark:text-white"
              size={60}
            />
          </div>
        )}

        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {college.name}
          </h3>
          <p className="text-xl text-gray-700 dark:text-gray-400">University</p>
        </div>

        <button
          onClick={() => handleViewDetails(college)}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-blue-700"
        >
          <User size={18} /> View Details
        </button>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10 text-black dark:from-gray-900 dark:to-black dark:text-white">
      {loadingView && <Loader />}

      <div className={loadingView ? "pointer-events-none blur-sm filter" : ""} >
        {/* Search bar */}
        <div className="mb-6 flex justify-end border-b pb-4">
          <motion.input
            initial={{ width: "16rem" }}
            animate={{ width: searchTerm ? "24rem" : "26rem" }}
            transition={{ duration: 0.4 }}
            type="text"
            placeholder="Search University..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        {/* Loader */}
        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredUniversities.map((college) => (
              <UniversityCard key={college._id} college={college} />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Are you sure you want to delete this university?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedCollege.name}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-full border border-gray-400 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={deleting}
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default University;
