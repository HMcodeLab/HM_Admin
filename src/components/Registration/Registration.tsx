"use client";

import React, { useEffect, useState } from "react";
import { GrDocumentCsv, GrDownload } from "react-icons/gr";
import * as XLSX from "xlsx";
import { jwtDecode } from "jwt-decode";

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country?: string;
  state?: string;
  zip?: string;
  createdAt?: string;
}

const Registration: React.FC = () => {
  const [data, setData] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const headers = [
    { label: "S No.", key: "serialNumber" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Country", key: "country" },
    { label: "State", key: "state" },
    { label: "ZIP", key: "zip" },
    { label: "Registration Date", key: "createdAt" },
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
            `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getAllUsers`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (!response.ok) throw new Error("Failed to fetch data");

          const result = await response.json();
          console.log("checkign data", result);
          setData(result || []);
        } catch (error) {
          console.error("Failed to fetch users:", error);
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

  // Filter by search
  const filteredData = data.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );

  // Excel Download
  const handleDownload = () => {
    const worksheetData = filteredData.map((user, index) => ({
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
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
      header: headers.map((h) => h.key),
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, "registrations.xlsx");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-white p-4 transition-all dark:bg-gray-900">
      <div className="mb-6 flex flex-col space-y-4 border-b pb-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
          Registrations Details
        </h1>

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
          <button
            onClick={handleDownload}
            className="flex items-center justify-center space-x-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <GrDocumentCsv className="text-xl" />
            <GrDownload className="text-xl" />
          </button>
        </div>
      </div>

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
                    <td className="px-4 py-2">{user.country || "N/A"}</td>
                    <td className="px-4 py-2">{user.state || "N/A"}</td>
                    <td className="px-4 py-2">{user.zip || "N/A"}</td>
                    <td className="px-4 py-2">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
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

      {/* Pagination */}
      <div className="mt-6 flex flex-col items-center justify-between md:flex-row">
        <div className="space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded bg-gray-200 px-3 py-1 text-gray-800 disabled:opacity-50 dark:bg-gray-800 dark:text-white"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= filteredData.length}
            className="rounded bg-gray-200 px-3 py-1 text-gray-800 disabled:opacity-50 dark:bg-gray-800 dark:text-white"
          >
            Next
          </button>
        </div>
        <div className="mt-6 flex flex-col items-center space-y-3 rounded-lg bg-white p-5 shadow-md dark:bg-gray-800 md:flex-row md:justify-center md:space-x-8 md:space-y-0">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Total Registrations:{" "}
            <span className="text-blue-600">{filteredData.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
