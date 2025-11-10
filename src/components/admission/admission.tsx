"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";


type Student = {
  name?: string;
  phone?: number | string;
  email?: string;
  college?: string;
  purchased_courses?: any[];
  createdAt?: string;
};

const Admision: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentID, setCurrentID] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const router = useRouter();

  // Fetch data
const fetchData = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("No authorization token found");
      setLoading(false);
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getadmindashdata`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("API response:", data);

    // ✅ Sort students so latest entries show on top
    const sortedStudents = (data.data?.users || []).sort((a: any, b: any) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // latest first
      }
      return b._id.localeCompare(a._id); // fallback if createdAt missing
    });

    setStudents(sortedStudents);
  } catch (error: any) {
    console.error("Fetch error:", error);
    toast.error("Failed to fetch students");
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchData();
  }, []);

  // Filter data safely
  const filteredData = students.filter((student) => {
    const name = student.name?.toLowerCase() || "";
    const phone = student.phone ? student.phone.toString() : "";
    const search = searchTerm.toLowerCase();

    // Check search term in name or phone
    const matchesSearch = name.includes(search) || phone.includes(search);

    // Date filter
    const createdDate = student.createdAt ? new Date(student.createdAt) : null;
    const afterStart = startDate
      ? createdDate && createdDate >= new Date(startDate)
      : true;
    const beforeEnd = endDate
      ? createdDate && createdDate <= new Date(endDate)
      : true;

    return matchesSearch && afterStart && beforeEnd;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredData.slice(
    startIndex,
    startIndex + postsPerPage,
  );

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Invalid Date";
    return (
      d.toLocaleDateString() +
      " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Handle page change
  const onPageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  // Handle download all filtered data
  const handleDownload = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      [
        "Name",
        "Phone",
        "Email",
        "College/University",
        "Courses Purchased",
        "Created At",
      ],
      ...filteredData.map((s) => [
        s.name || "",
        s.phone?.toString() || "",
        s.email || "",
        s.college || "",
        s.purchased_courses?.length || 0,
        formatDate(s.createdAt),
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "studentData.xlsx");
  };

  // Navigate to student detail
  const viewStudent = (email?: string) => {
    if (email) router.push(`/admission/${email}`);
  };

  // Toggle delete modal
  const toggleDeleteModal = (email: string | null) => {
    setCurrentID(email);
    setDeleteModal((prev) => !prev);
  };

  // Delete student API call
 const handleDeleteStudent = async () => {
   const token = localStorage.getItem("adminToken");
   if (!currentID) return;
   if (!token) {
     toast.error("No authorization token found");
     return;
   }

   try {
     const res = await fetch(
       `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/deletehmuser`,
       {
         method: "DELETE",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({ email: currentID }),
       },
     );

     if (!res.ok) {
       throw new Error(`Delete failed with status ${res.status}`);
     }

     toast.success("Student Deleted Successfully");
     fetchData();
     setDeleteModal(false);
   } catch (error: any) {
     console.error("Delete error:", error);
     toast.error("Unable to Delete Student");
   }
 };


  if (loading) return <Loader />;

  return (
    <div className="mx-4 my-4 flex min-h-screen flex-col gap-4">
      {/* Search & Filters */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-xl border-2 border-green-500 px-4 py-2 text-green-700 placeholder-green-300 focus:outline-none md:w-1/3"
        />
        <div className="flex w-full gap-2 md:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border-2 border-green-500 px-4 py-2 focus:outline-none"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border-2 border-green-500 px-4 py-2 focus:outline-none"
          />
        </div>
        <select
          value={postsPerPage}
          onChange={(e) => {
            setPostsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="w-24 rounded-xl border-2 border-green-500 px-4 py-2 text-center focus:outline-none"
          aria-label="Select posts per page"
        >
          {[10, 20, 30, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num} / page
            </option>
          ))}
        </select>
        <button
          onClick={handleDownload}
          className="rounded-xl bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
          aria-label="Download filtered data as Excel"
        >
          Download XLSX
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-md dark:bg-gray-900">
        <table className="min-w-full border-collapse text-left text-sm text-gray-900 dark:text-gray-100">
          <thead className="bg-green-100 dark:bg-green-800">
            <tr>
              <th className="border-b border-green-300 px-4 py-3">S.No</th>
              <th className="border-b border-green-300 px-4 py-3">Name</th>
              <th className="border-b border-green-300 px-4 py-3">Phone</th>
              <th className="border-b border-green-300 px-4 py-3">Email</th>
              <th className="border-b border-green-300 px-4 py-3">
                College/University
              </th>
              <th className="border-b border-green-300 px-4 py-3">
                Courses Purchased
              </th>
              <th className="border-b border-green-300 px-4 py-3">
                Created At
              </th>
              <th className="border-b border-green-300 px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No matching students found.
                </td>
              </tr>
            ) : (
              currentPosts.map((student, idx) => (
                <tr
                  key={idx}
                  className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900"
                  onClick={() => viewStudent(student.email)}
                >
                  <td className="border-b border-green-300 px-4 py-3">
                    {(currentPage - 1) * postsPerPage + idx + 1}
                  </td>
                  <td className="border-b border-green-300 px-4 py-3">
                    {student.name || "-"}
                  </td>
                  <td className="border-b border-green-300 px-4 py-3">
                    {student.phone || "-"}
                  </td>
                  <td className="border-b border-green-300 px-4 py-3">
                    {student.email || "-"}
                  </td>
                  <td className="border-b border-green-300 px-4 py-3">
                    {student.college || "-"}
                  </td>
                  <td className="border-b border-green-300 px-4 py-3">
                    {student.purchased_courses?.length ?? 0}
                  </td>
                  <td className="border-b border-green-300 px-4 py-3">
                    {formatDate(student.createdAt)}
                  </td>
                  <td
                    className="border-b border-green-300 px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <RiDeleteBin6Line
                      className="mx-1 text-xl text-red-600 hover:cursor-pointer"
                      onClick={() => toggleDeleteModal(student.email || null)}
                      title="Delete student"
                      aria-label={`Delete ${student.name || "student"}`}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* Pagination & Posts per page */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* Posts per page selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="postsPerPage"
            className="font-semibold text-green-700"
          >
            Posts per page:
          </label>
          <select
            id="postsPerPage"
            value={postsPerPage}
            onChange={(e) => {
              setPostsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-xl border-2 border-green-500 px-3 py-1 text-green-700 focus:outline-none"
            aria-label="Select posts per page"
          >
            {[50, 100, 150, 200].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination controls */}
        <nav
          className="flex items-center gap-3 rounded-lg border border-green-500 bg-green-50 px-4 py-2"
          aria-label="Pagination Navigation"
        >
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`rounded px-3 py-1 font-semibold transition ${
              currentPage === 1
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            aria-label="Previous page"
          >
            Prev
          </button>

          <span className="font-semibold text-green-900">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className={`rounded px-3 py-1 font-semibold transition ${
              currentPage === totalPages || totalPages === 0
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setDeleteModal(false)}
        >
          <div
            className="max-w-md rounded-lg bg-white p-6 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Confirm Delete
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this student? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                onClick={handleDeleteStudent}
              >
                Delete
              </button>
            </div>
          </div>
        </div>  
      )}
    </div>
  );
};

export default Admision;
