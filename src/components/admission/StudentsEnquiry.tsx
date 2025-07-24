"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import * as XLSX from "xlsx";
import Loader from "@/components/Loader";

const StudentsEnquiry = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getAllEnquiry`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setEnquiries(response.data.enquiries || []);
    } catch (error) {
      toast.error("Error fetching enquiries");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${day}-${month}-${year}, ${hours}:${minutes} ${ampm}`;
  };

  // Apply search and date filtering
  const filteredData = enquiries.filter((enquiry) => {
    const search = searchQuery.toLowerCase();
    const matchesQuery =
      enquiry.name?.toLowerCase().includes(search) ||
      enquiry.email?.toLowerCase().includes(search) ||
      enquiry.number?.toString().includes(search);

    if (!enquiry.createdAt) return matchesQuery;

    const enquiryDate = new Date(enquiry.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesDate =
      (!start || enquiryDate >= start) && (!end || enquiryDate <= end);

    return matchesQuery && matchesDate;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const downloadXLSX = () => {
    const data = filteredData.map((enquiry) => ({
      Name: enquiry.name,
      Email: enquiry.email,
      Phone: enquiry.number,
      Message: enquiry.message,
      Date: formatDate(enquiry.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");
    XLSX.writeFile(workbook, "enquiries.xlsx");
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Toaster position="top-center" />
      <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          placeholder="Search by name, email, or number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-xl border border-green-500 px-4 py-2 dark:border-green-400 dark:bg-gray-800 dark:placeholder-green-300"
        />
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-xl border border-green-500 px-4 py-2 dark:border-green-400 dark:bg-gray-800"
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-xl border border-green-500 px-4 py-2 dark:border-green-400 dark:bg-gray-800"
        />
        <button
          onClick={downloadXLSX}
          className="rounded-xl bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
        >
          Download XLSX
        </button>
      </div>

      {/* Items Per Page Selector */}
      <div className="mb-2 flex items-center justify-end gap-2">
        <label className="text-sm font-medium">Items per page:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(parseInt(e.target.value));
            setCurrentPage(1); // Reset to first page
          }}
          className="rounded-md border px-2 py-1 dark:border-gray-600 dark:bg-gray-800"
        >
          {[20, 30, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full bg-white text-sm dark:bg-gray-800">
          <thead className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Mobile No.</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((enquiry, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-green-50 dark:border-gray-700 dark:hover:bg-green-900"
                >
                  <td className="px-4 py-3">{enquiry.name}</td>
                  <td className="px-4 py-3">{enquiry.email}</td>
                  <td className="px-4 py-3">{enquiry.number}</td>
                  <td className="px-4 py-3">{enquiry.message}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatDate(enquiry.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded bg-gray-300 px-3 py-1 disabled:opacity-50 dark:bg-gray-700"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`rounded px-3 py-1 ${
                currentPage === index + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded bg-gray-300 px-3 py-1 disabled:opacity-50 dark:bg-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentsEnquiry;
