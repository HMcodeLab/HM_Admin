"use client";

import React, { useEffect, useState } from "react";
import { GrDocumentCsv, GrDownload } from "react-icons/gr";
import * as XLSX from "xlsx";
import { jwtDecode } from "jwt-decode";

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  state?: string;
  zip?: string;
  createdAt?: string;
  purchased_courses?: string[];
  stream?: string;
  yearofpass?: string;
  blocked_courses?: string;
  college?: string;
}

const Registration: React.FC = () => {
  const [data, setData] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "all">(50);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [purchasedFilter, setPurchasedFilter] = useState<
    "all" | "with" | "without"
  >("all");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  // Updated headers
  const headers = [
    { label: "S No.", key: "serialNumber" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Stream", key: "stream" },
    { label: "Year of Pass", key: "yearofpass" },
    { label: "Blocked Courses", key: "blocked_courses" },
    { label: "College", key: "college" },
    { label: "Registration Date", key: "createdAt" },
    { label: "Purchased Courses Count", key: "purchasedCount" },
  ];

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const validToken = jwtDecode(token);
      if (!validToken) {
        setLoading(false);
        return;
      }

      const fetchData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getadmindashdata`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (!response.ok) throw new Error("Failed to fetch data");

          const result = await response.json();
          console.log("API Result:", result);

          const usersData =
            Array.isArray(result?.data?.users) && result?.success
              ? result.data.users
              : [];

          setData(usersData);
        } catch (error) {
          console.error("Failed to fetch users:", error);
          setData([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } catch (err) {
      console.error("Invalid token:", err);
      setLoading(false);
    }
  }, [token]);

  // ✅ Filter by search term
  const searchedData = data.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );

  // ✅ Filter by purchased courses
  const filteredData = searchedData.filter((user) => {
    if (purchasedFilter === "with") {
      return (
        Array.isArray(user.purchased_courses) &&
        user.purchased_courses.length > 0
      );
    } else if (purchasedFilter === "without") {
      return !user.purchased_courses || user.purchased_courses.length === 0;
    }
    return true; // all
  });

  // ✅ Summary
  const totalRegistrations = data.length;
  const withCourses = searchedData.filter(
    (u) => Array.isArray(u.purchased_courses) && u.purchased_courses.length > 0,
  ).length;
  const withoutCourses = searchedData.length - withCourses;

  // ✅ Excel Download
  const handleDownload = () => {
    const worksheetData = filteredData?.map((user, index) => ({
      serialNumber: index + 1,
      name: user.name || "N/A",
      email: user.email || "N/A",
      phone: user.phone || "N/A",
      country: user.country || "N/A",
      state: user.state || "N/A",
      zip: user.zip || "N/A",
      createdAt: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "N/A",
      purchasedCount: user.purchased_courses?.length || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
      header: headers.map((h) => h.key),
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, "registrations.xlsx");
  };

  // ✅ Pagination
  const indexOfLastItem =
    itemsPerPage === "all" ? filteredData.length : currentPage * itemsPerPage;
  const indexOfFirstItem =
    itemsPerPage === "all" ? 0 : indexOfLastItem - itemsPerPage;
  const currentItems =
    itemsPerPage === "all"
      ? filteredData
      : filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages =
    itemsPerPage === "all" ? 1 : Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-white p-4 transition-all dark:bg-gray-900">
      {/* Header Section */}
      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
          Registrations Details
        </h1>

        {/* Top Controls: Search, Filter, Pagination, Download */}
        <div className="flex w-full flex-col space-y-2 md:w-auto md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* Purchased Filter */}
          <select
            value={purchasedFilter}
            onChange={(e) => {
              setPurchasedFilter(e.target.value as "all" | "with" | "without");
              setCurrentPage(1);
            }}
            className="rounded border border-gray-300 bg-white px-2 py-2 text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All</option>
            <option value="with">With Purchased</option>
            <option value="without">Without Purchased</option>
          </select>

          {/* Rows per page */}
          <select
            value={itemsPerPage}
            onChange={(e) => {
              const value =
                e.target.value === "all" ? "all" : parseInt(e.target.value, 10);
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
            className="rounded border border-gray-300 bg-white px-2 py-2 text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="150">150</option>
            <option value="200">200</option>
            <option value="all">All</option>
          </select>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex items-center justify-center space-x-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <GrDocumentCsv className="text-xl" />
            <GrDownload className="text-xl" />
          </button>
        </div>
      </div>

      {/* Top Summary */}
      <div className="mb-6 flex flex-col space-y-3 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 md:flex-row md:justify-around md:space-y-0">
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Total Registrations:{" "}
          <span className="text-blue-600">{totalRegistrations}</span>
        </div>
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Users with Purchased Courses:{" "}
          <span className="text-green-600">{withCourses}</span>
        </div>
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Users without Purchased Courses:{" "}
          <span className="text-red-600">{withoutCourses}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <tr>
                {headers.map((header) => (
                  <th key={header.key} className="px-4 py-2 text-left">
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {currentItems.length > 0 ? (
                currentItems.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-2">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-4 py-2">{user.name || "N/A"}</td>
                    <td className="px-4 py-2">{user.email || "N/A"}</td>
                    <td className="px-4 py-2">{user.phone || "N/A"}</td>
                    <td className="px-4 py-2">{user.stream || "N/A"}</td>
                    <td className="px-4 py-2">{user.yearofpass || "N/A"}</td>
                    <td className="px-4 py-2">
                      {user.blocked_courses || "N/A"}
                    </td>
                    <td className="px-4 py-2">{user.college || "N/A"}</td>
                    <td className="px-4 py-2">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {user.purchased_courses?.length || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <div className="space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1 || itemsPerPage === "all"}
            className="rounded bg-gray-200 px-3 py-1 text-gray-800 disabled:opacity-50 dark:bg-gray-800 dark:text-white"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || itemsPerPage === "all"}
            className="rounded bg-gray-200 px-3 py-1 text-gray-800 disabled:opacity-50 dark:bg-gray-800 dark:text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
