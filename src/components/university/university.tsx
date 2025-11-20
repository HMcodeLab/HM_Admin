"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CiEdit as Edit, CiUser as User } from "react-icons/ci";
import { HiOutlineAcademicCap, HiOutlineBuildingLibrary } from "react-icons/hi2";
import { FaCoins, FaMobileAlt, FaBook } from "react-icons/fa";
import Image from "next/image";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";

interface University {
  _id: string;
  name: string;
  email: string;
  profile?: string;
  collegeName?: string;
  mobile?: string;
  coins?: number;
  used_coins?: number;
  coursesAllotted?: any[];
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();

  // Show toast notification
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

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

        const sortedData = res.data.data.sort((a: any, b: any) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return b._id.localeCompare(a._id);
        });

        console.log("sortedData sortedData :", sortedData);
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
    const result = collegeUsers.filter(
      (uni) =>
        uni?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni?.collegeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni?.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/deletecollegeUserAdmin/${selectedCollege._id}`,
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
      showToastMessage("University deleted successfully!");
    } catch (error) {
      console.error("Failed to delete university:", error);
      showToastMessage("Failed to delete university. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // University card component
  const UniversityCard: React.FC<{ college: University }> = ({ college }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative flex h-full transform flex-col rounded-2xl border border-gray-200 bg-white text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
      >
        {/* Action Buttons - Top Right */}
        <div className="absolute right-4 top-4 z-10 flex space-x-2">
          <button
            onClick={() => editModeActive(college)}
            className="flex items-center justify-center rounded-full bg-blue-100 p-2 text-blue-600 transition-all duration-200 hover:scale-110 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
            title="Edit University"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteClick(college)}
            className="flex items-center justify-center rounded-full bg-red-100 p-2 text-red-600 transition-all duration-200 hover:scale-110 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
            title="Delete University"
          >
            <MdDelete size={18} />
          </button>
        </div>

        {/* Card Content - Fixed height sections */}
        <div className="flex flex-1 flex-col p-6">
          {/* Profile Image - Fixed Size */}
          <div className="mb-4 flex justify-center">
            <div className="relative h-24 w-24">
              {!imageError && college.profile ? (
                <Image
                  src={college.profile}
                  fill
                  alt="University Logo"
                  className="rounded-full object-cover border-4 border-blue-100 shadow-md dark:border-gray-600"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md dark:border-gray-600 dark:from-gray-700 dark:to-gray-800">
                  <HiOutlineAcademicCap
                    className="text-blue-500 dark:text-blue-400"
                    size={40}
                  />
                </div>
              )}
            </div>
          </div>

          {/* University and College Info - Fixed height */}
          <div className="mb-4 flex-1 space-y-3">
            {/* University Name */}
            <div className="flex items-center justify-center gap-2">
              <HiOutlineBuildingLibrary className="text-blue-500 flex-shrink-0" size={18} />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-1">
                {college.name}
              </h3>
            </div>

            {/* College Name */}
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                COLLEGE
              </p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
                {college.collegeName || "Not specified"}
              </p>
            </div>

            {/* Stats Grid - Fixed height */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {/* Coins */}
              <div className="flex items-center justify-center gap-1 rounded-lg bg-amber-50 px-2 py-2 dark:bg-amber-900/20">
                <FaCoins className="text-amber-500 flex-shrink-0" size={12} />
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  {college.coins || 0}
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-300 hidden sm:inline">
                  Coins
                </span>
              </div>

              {/* Courses */}
              <div className="flex items-center justify-center gap-1 rounded-lg bg-green-50 px-2 py-2 dark:bg-green-900/20">
                <FaBook className="text-green-500 flex-shrink-0" size={12} />
                <span className="font-semibold text-green-700 dark:text-green-400">
                  {college.coursesAllotted?.length || 0}
                </span>
                <span className="text-xs text-green-600 dark:text-green-300 hidden sm:inline">
                  Courses
                </span>
              </div>
            </div>

            {/* Contact Info - Fixed height */}
            <div className="space-y-2 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <div className="flex items-center justify-start gap-2">
                <FaMobileAlt className="text-blue-500 flex-shrink-0" size={12} />
                <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                  {college.mobile || "No mobile"}
                </span>
              </div>
              <div className="flex items-center justify-start gap-2">
                <svg 
                  className="h-3 w-3 flex-shrink-0 text-blue-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                  {college.email}
                </span>
              </div>
            </div>
          </div>

          {/* View Details Button - Always at bottom */}
          <div className="mt-auto pt-4">
            <button
              onClick={() => handleViewDetails(college)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95"
            >
              <User size={16} /> View Full Details
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10 text-black dark:from-gray-900 dark:to-black dark:text-white">
      {loadingView && <Loader />}

      <div className={loadingView ? "pointer-events-none blur-sm filter" : ""}>
        {/* Header and Search */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                University Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage university accounts and their associated colleges
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0"
            >
              <input
                type="text"
                placeholder="Search universities or colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-sm shadow-md transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:w-80"
              />
            </motion.div>
          </div>
        </div>

        {/* Loader or Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredUniversities.length} of {collegeUsers.length} universities
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <HiOutlineBuildingLibrary size={14} />
                  <span>University</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiOutlineAcademicCap size={14} />
                  <span>College</span>
                </div>
              </div>
            </div>

            {/* Universities Grid */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredUniversities.map((college) => (
                <UniversityCard key={college._id} college={college} />
              ))}
            </div>

            {/* Empty State */}
            {filteredUniversities.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <HiOutlineAcademicCap
                  className="mb-4 text-gray-400"
                  size={64}
                />
                <h3 className="mb-2 text-xl font-semibold text-gray-600 dark:text-gray-400">
                  No universities found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "No universities have been added yet"}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-[90%] max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-gray-800"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <MdDelete className="text-red-600 dark:text-red-400" size={24} />
            </div>

            <h2 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">
              Delete University?
            </h2>
            <p className="mb-2 text-gray-600 dark:text-gray-400">
              Are you sure you want to delete <strong>{selectedCollege.name}</strong>?
            </p>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-500">
              College: {selectedCollege.collegeName || "Not specified"}
            </p>
            <p className="mb-6 text-xs text-gray-500 dark:text-gray-500">
              This action cannot be undone and all associated data will be permanently removed.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-full border border-gray-400 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-full bg-red-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          className="fixed bottom-4 right-4 z-50 rounded-xl bg-green-500 px-6 py-4 text-white shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">{toastMessage}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default University;