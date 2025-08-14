"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { GrEdit } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { ImSpinner9 } from "react-icons/im";
import { MdRebaseEdit } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";
import Loader from "@/components/Loader";

interface Course {
  _id: string;
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  base_price: number;
  courseType: string;
  instructor: {
    name: string;
  };
}

const AllCourses = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<string[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [uniquePrices, setUniquePrices] = useState<number[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Course[]>(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/coursesforadmin`,
      );
      setCourses(response.data);

      const uniqueInstructors = [
        ...new Set(response.data.map((course) => course?.instructor?.name)),
      ].filter(Boolean) as string[];
      setInstructors(uniqueInstructors);

      const uniquePrices = [
        ...new Set(response.data.map((course) => course?.base_price)),
      ].filter(Boolean) as number[];
      setUniquePrices(uniquePrices);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter courses based on search and filters
  const filteredData = courses
    .filter((course) => {
      const search = searchTerm.toLowerCase();
      return (
        course.slug?.toLowerCase().includes(search) ||
        course.instructor?.name?.toLowerCase().includes(search) ||
        course.title?.toLowerCase().includes(search)
      );
    })
    .filter(
      (course) => !priceFilter || course.base_price?.toString() === priceFilter,
    )
    .filter(
      (course) =>
        !selectedInstructor || course.instructor?.name === selectedInstructor,
    );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / postsPerPage);
  const currentPosts = filteredData.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  const handleUpdate = (slug: string) => {
    router.push(`/update-course/${slug}`);
  };
  const handleUpdateByBatch = async (id: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getAllBatchesForCourse/${id}`,
      );
      if (res.data?.length > 0) {
        router.push(`/batch-curriculum?coursename=${id}`);
      } else {
        toast.error("No Batches Available");
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error("Failed to check batches");
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <div
        className={`rounded-lg p-6 shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
          Course Management
        </h1>

        {/* Filters Section */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Search Input */}
          <div className="col-span-1 md:col-span-2">
            <input
              type="text"
              placeholder="Search courses..."
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                theme === "dark"
                  ? "border-gray-600 bg-gray-700 text-white focus:ring-blue-500"
                  : "border-gray-300 bg-white text-gray-800 focus:ring-blue-400"
              }`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Instructor Filter */}
          <select
            value={selectedInstructor}
            onChange={(e) => {
              setSelectedInstructor(e.target.value);
              setCurrentPage(1);
            }}
            className={`rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "border-gray-600 bg-gray-700 text-white focus:ring-blue-500"
                : "border-gray-300 bg-white text-gray-800 focus:ring-blue-400"
            }`}
          >
            <option value="">All Instructors</option>
            {instructors.map((instructor) => (
              <option key={instructor} value={instructor}>
                {instructor}
              </option>
            ))}
          </select>

          {/* Price Filter */}
          <select
            value={priceFilter}
            onChange={(e) => {
              setPriceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "border-gray-600 bg-gray-700 text-white focus:ring-blue-500"
                : "border-gray-300 bg-white text-gray-800 focus:ring-blue-400"
            }`}
          >
            <option value="">All Prices</option>
            {uniquePrices.map((price) => (
              <option key={price} value={price.toString()}>
                ₹{price}
              </option>
            ))}
          </select>
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <Loader />
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead
                  className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
                >
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Subcategory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={theme === "dark" ? "bg-gray-800" : "bg-white"}
                >
                  {currentPosts.length > 0 ? (
                    currentPosts.map((course, index) => (
                      <tr
                        key={course._id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {(currentPage - 1) * postsPerPage + index + 1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {course.instructor?.name || "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          {course.title}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {course.category}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {course.subcategory}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          ₹{course.base_price}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {course.courseType}
                        </td>
                        <td className="flex space-x-2 whitespace-nowrap px-6 py-4 text-sm">
                          <button
                            onClick={() => handleUpdate(course.slug)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Update course"
                          >
                            <GrEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleUpdateByBatch(course._id)}
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                            title="Update batches"
                          >
                            <MdRebaseEdit size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-sm">
                        No courses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Custom Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`rounded px-4 py-2 ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`rounded px-4 py-2 ${currentPage === page ? "bg-blue-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`rounded px-4 py-2 ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCourses;
