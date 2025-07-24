"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CiEdit as Edit, CiUser as User } from "react-icons/ci";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import Image from "next/image";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";

interface University {
  _id: string;
  name: string;
  email: string;
  profile?: string;
}

const University: React.FC = () => {
  const [collegeUsers, setCollegeUsers] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<
    University[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadingView, setLoadingView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
          },
        );
        setCollegeUsers(res.data.data);
        setFilteredUniversities(res.data.data);
      } catch (error) {
        console.error("Failed to fetch universities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter on search
  useEffect(() => {
    const result = collegeUsers.filter((uni) =>
      uni?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredUniversities(result);
  }, [searchTerm, collegeUsers]);

  // Prefetch detail pages for faster navigation
  useEffect(() => {
    filteredUniversities.forEach((college) => {
      router.prefetch(`/university/${college._id}`);
    });
  }, [filteredUniversities, router]);

  // Edit button handler
  const editModeActive = (college: University) => {
    localStorage.setItem("collegeEmail", college.email);
    router.push(`/university/edit?email=${college.email}`);
  };

  // View details button handler with loader and blur background
const handleViewDetails = (college: University) => {
  setLoadingView(true);
  // store email before navigating
  localStorage.setItem("universityEmail", college.email);
  router.push(
    `/university/details?email=${encodeURIComponent(college.email)}&name=${encodeURIComponent(college.name)}`,
  );
};


  // University card component
  const UniversityCard: React.FC<{ college: University }> = ({ college }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="group relative flex transform flex-col items-center space-y-4 rounded-2xl border border-gray-200 p-5 text-center shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="absolute right-3 top-3">
          <Edit
            onClick={() => editModeActive(college)}
            className="cursor-pointer text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-300"
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
      {/* Loader overlay */}
      {loadingView && (
        <div >
          <Loader />
        </div>
      )}

      {/* Content container with blur & disable pointer events when loader active */}
      <div className={loadingView ? "pointer-events-none blur-sm filter" : ""}>
        {/* Search input */}
        <div className="mb-6 flex justify-end">
          <motion.input
            initial={{ width: "8rem" }}
            animate={{ width: searchTerm ? "16rem" : "12rem" }}
            transition={{ duration: 0.4 }}
            type="text"
            placeholder="Search University..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        {/* Loader while fetching list */}
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
    </div>
  );
};

export default University;
