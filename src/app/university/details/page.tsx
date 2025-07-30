"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import { RiCoinsFill } from "react-icons/ri";
import { GiBookshelf } from "react-icons/gi";
import Loader from "@/components/Loader";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaDownload } from "react-icons/fa";

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
  name?: string;
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

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main className="min-h-screen bg-gray-50 p-4 transition-colors duration-500 dark:bg-gray-900 md:p-8">
          <h1 className="mb-8 text-center text-4xl font-extrabold text-gray-800 underline dark:text-gray-200 md:text-5xl">
            {university.name ?? "University Name"}
          </h1>

          <section className="mb-8 flex flex-col justify-center gap-8 md:flex-row">
            <div
              className="flex w-full cursor-pointer items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:scale-[1.03] dark:border-gray-700 dark:bg-gray-800 md:w-1/3"
              title="Coins Used / Total Coins"
            >
              <RiCoinsFill className="text-7xl text-yellow-400" />
              <div>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {university.used_coins ?? 0} / {university.coins ?? 0}
                </p>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  Coins
                </p>
              </div>
            </div>

            <div
              onClick={() => setCourseOpened(true)}
              className="flex w-full cursor-pointer items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:scale-[1.03] dark:border-gray-700 dark:bg-gray-800 md:w-1/3"
              title="Total Courses Allotted"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setCourseOpened(true)}
            >
              <GiBookshelf className="text-7xl text-blue-500" />
              <div>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {university.coursesAllotted?.length ?? 0}
                </p>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  Courses
                </p>
              </div>
            </div>
          </section>

          {/* Filter + Search + Export */}
          <section className="mx-auto mb-6 flex max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:w-1/3">
             
              <select
                id="courseFilter"
                value={filteredOpen === null ? "" : String(filteredOpen)}
                onChange={(e) =>
                  setFilteredOpen(
                    e.target.value === "" ? null : e.target.value === "true",
                  )
                }
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 transition focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">All Students</option>
                <option value="true">Course Opened</option>
                <option value="false">Course Not Opened</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Search by name, email, phone, or college"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[60%] rounded-md border border-gray-300 px-2 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white md:w-1/2"
            />

            <button
              onClick={exportToExcel}
              className="rounded-md bg-green-600 px-6 py-2 text-white shadow transition hover:bg-green-700"
            >
              <FaDownload />
            </button>
          </section>

          {/* Table */}
          <section className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse rounded-lg border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
              <thead className="bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  {[
                    "SNO.",
                    "Name",
                    "Phone",
                    "Email",
                    "College/University",
                    "Courses Purchased",
                    "Created At",
                    "Course Opened",
                  ].map((header) => (
                    <th
                      key={header}
                      className="border-b border-gray-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider dark:border-gray-600"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedUsers && paginatedUsers.length > 0 ? (
                  paginatedUsers.map((student, i) => (
                    <tr
                      key={`${student.email ?? i}-${i}`}
                      className="transition hover:bg-green-50 dark:hover:bg-green-900"
                    >
                      <td className="border-b border-gray-300 px-4 py-3 dark:border-gray-600">
                        {(currentPage - 1) * itemsPerPage + i + 1}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 dark:border-gray-600">
                        {student.name ?? "N/A"}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 dark:border-gray-600">
                        {student.phone ?? "N/A"}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 dark:border-gray-600">
                        {student.email ?? "N/A"}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 dark:border-gray-600">
                        {student.college ?? "N/A"}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 text-center dark:border-gray-600">
                        {student.purchased_courses?.length ?? 0}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 dark:border-gray-600">
                        {student.createdAt
                          ? new Date(student.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 text-center dark:border-gray-600">
                        {student.isCourseOpened ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-gray-600 dark:text-gray-400"
                    >
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`rounded border px-4 py-2 text-sm ${
                      pageNum === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 dark:bg-gray-700 dark:text-white"
                    } transition hover:bg-blue-500 hover:text-white`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}

          {/* Modal */}
          {courseOpened && (
            <div
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
              onClick={() => setCourseOpened(false)}
            >
              <div
                className="max-h-[70vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-gray-800"
                onClick={(e) => e.stopPropagation()}
              >
                <header className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Courses Allotted
                  </h2>
                  <button
                    aria-label="Close modal"
                    onClick={() => setCourseOpened(false)}
                    className="text-2xl font-bold text-gray-600 transition hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    &times;
                  </button>
                </header>

                <div className="space-y-4 p-4">
                  {university.coursesAllotted &&
                  university.coursesAllotted.length > 0 ? (
                    university.coursesAllotted.map((course, idx) => (
                      <div
                        key={idx}
                        className="rounded-md border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                      >
                        <p>
                          <span className="font-semibold">Course Name:</span>{" "}
                          {course.title}
                        </p>
                        <p>
                          <span className="font-semibold">Price:</span>{" "}
                          {course.base_price}
                        </p>
                        <p>
                          <span className="font-semibold">Category:</span>{" "}
                          {course.category}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400">
                      No courses allotted.
                    </p>
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
