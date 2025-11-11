"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiCoinsFill, RiUserSettingsLine } from "react-icons/ri";
import { GiBookshelf } from "react-icons/gi";
import { FaDownload, FaUsers, FaChartLine, FaUniversity } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import Loader from "@/components/Loader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SERVER_DOMAIN = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "";

interface Course {
  title: string;
  base_price: number | string;
  category: string;
}

interface Student {
  name?: string;
  phone?: string;
  email?: string;
  college?: string;
  purchased_courses?: Course[];
  createdAt?: string;
  isCourseOpened?: boolean;
}

interface University {
  _id?: string;
  email?: string;
  mobile?: number;
  name?: string;
  profile?: string;
  college?: string;
  used_coins?: number;
  coins?: number;
  coursesAllotted?: Course[];
  users?: Student[];
}

const Page: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [university, setUniversity] = useState<University>({});
  const [filteredOpen, setFilteredOpen] = useState<boolean | null>(null);
  const [courseOpened, setCourseOpened] = useState<boolean>(false);

  // Pagination and Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  async function fetchUniversity() {
    setLoading(true);
    try {
      const email = localStorage.getItem("universityEmail");
      const adminToken = localStorage.getItem("adminToken") ?? "";

      if (!email || !adminToken) {
        throw new Error("Missing credentials");
      }

      const response = await axios.get<{ data: University }>(
        `${SERVER_DOMAIN}/collegeUser?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (response.status === 200) {
        setUniversity(response.data.data);
      }
    } catch (error) {
      console.error("Error in fetching university details", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUniversity();
  }, []);

  // Filter users by course opened status
  const filteredUsers = university.users?.filter((student) => {
    if (filteredOpen === null) return true;
    return filteredOpen === student.isCourseOpened;
  });

  // Apply search filter (name, email, phone, college)
  const searchedUsers = filteredUsers?.filter((student) => {
    const term = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      (student.phone ?? "").toString().includes(term) ||
      student.college?.toLowerCase().includes(term)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil((searchedUsers?.length || 0) / itemsPerPage);
  const paginatedUsers = searchedUsers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // When filters/search changes, reset to page 1
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredOpen, searchTerm]);

  // Excel Export function
  const exportToExcel = () => {
    if (!filteredUsers || filteredUsers.length === 0) return;

    const data = filteredUsers.map((student, index) => ({
      "S.No": index + 1,
      Name: student.name,
      Phone: student.phone,
      Email: student.email,
      College: student.college,
      "Courses Purchased": student.purchased_courses?.length ?? 0,
      "Created At": student.createdAt
        ? new Date(student.createdAt).toLocaleDateString()
        : "N/A",
      "Course Opened": student.isCourseOpened ? "Yes" : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "students.xlsx");
  };

  // Stats calculations
  const totalStudents = university.users?.length || 0;
  const coursesOpened = university.users?.filter(user => user.isCourseOpened).length || 0;
  const coursesNotOpened = totalStudents - coursesOpened;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-500 md:p-8">
          {/* Header Section */}
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {university.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {university?.name || "University Dashboard"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Training & Placement Office Management System
                    </p>
                  </div>
                </div>
                
                {/* TPO Details Card */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white shadow-lg w-full lg:w-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <RiUserSettingsLine className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">TPO Details</h3>
                      <p className="text-sm opacity-90">{university.name || "TPO Name"}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <MdEmail className="opacity-80" />
                        <span>{university.email || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <MdPhone className="opacity-80" />
                        <span>{university.mobile || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Coins</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {university.coins ?? 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Used: {university.used_coins ?? 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <RiCoinsFill className="text-2xl text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Courses Allotted</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {university.coursesAllotted?.length ?? 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <GiBookshelf className="text-2xl text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {totalStudents}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <FaUsers className="text-xl text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Course Engagement</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {coursesOpened}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Not opened: {coursesNotOpened}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <FaChartLine className="text-xl text-purple-600" />
                  </div>
                </div>
              </div>
            </section>

            {/* Controls Section */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <select
                    value={filteredOpen === null ? "" : String(filteredOpen)}
                    onChange={(e) =>
                      setFilteredOpen(
                        e.target.value === "" ? null : e.target.value === "true",
                      )
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Students</option>
                    <option value="true">Course Opened</option>
                    <option value="false">Course Not Opened</option>
                  </select>

                  <div className="relative flex-1 min-w-[250px]">
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FaDownload className="text-sm" />
                  Export Excel
                </button>
              </div>
            </section>

            {/* Students Table */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      {[
                        "S.No",
                        "Student Name",
                        "Contact",
                        "Email",
                        "College",
                        "Courses",
                        "Joined",
                        "Status",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {paginatedUsers && paginatedUsers.length > 0 ? (
                      paginatedUsers.map((student, i) => (
                        <tr
                          key={`${student.email ?? i}-${i}`}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {(currentPage - 1) * itemsPerPage + i + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {student.name ?? "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {student.phone ?? "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {student.email ?? "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {student.college ?? "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {student.purchased_courses?.length ?? 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {student.createdAt
                              ? new Date(student.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                student.isCourseOpened
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {student.isCourseOpened ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <FaUsers className="text-4xl mb-3 opacity-50" />
                            <p className="text-lg font-medium">No students found</p>
                            <p className="text-sm mt-1">
                              {searchTerm || filteredOpen !== null
                                ? "Try adjusting your search or filters"
                                : "No students registered yet"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, searchedUsers?.length || 0)}
                      </span>{" "}
                      of <span className="font-medium">{searchedUsers?.length || 0}</span>{" "}
                      results
                    </p>
                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                              pageNum === currentPage
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Courses Modal */}
          {courseOpened && (
            <div
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm"
              onClick={() => setCourseOpened(false)}
            >
              <div
                className="max-h-[80vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
                  <h2 className="text-2xl font-bold">Courses Allotted</h2>
                  <button
                    aria-label="Close modal"
                    onClick={() => setCourseOpened(false)}
                    className="text-2xl font-bold text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    &times;
                  </button>
                </header>

                <div className="p-6 space-y-4">
                  {university.coursesAllotted && university.coursesAllotted.length > 0 ? (
                    university.coursesAllotted.map((course, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {course.title}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Price:</span>
                                <span className="text-green-600 dark:text-green-400 font-semibold">
                                  ₹{course.base_price}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Category:</span>
                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                                  {course.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <GiBookshelf className="text-4xl text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No courses allotted yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </>
  );
};

export default Page;