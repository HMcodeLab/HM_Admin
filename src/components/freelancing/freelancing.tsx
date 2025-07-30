"use client";
// pages/freelancing-jobs.tsx
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import * as XLSX from "xlsx";
import Image from "next/image";

interface FreelancePost {
  _id: string;
  title: string;
  budget?: number;
  deadline?: string;
  logoUrl?: string;
  position?: string;
  company?: string;
  skills?: string[]; // assuming it's an array of strings
  location?: string;
  salary?: number;
  experience?: number;
  description?: string;
}

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];

const Freelancing = () => {
  const [freelancePosts, setFreelancePosts] = useState<FreelancePost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Get adminToken from localStorage safely (client-side)
  const adminToken =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") || ""
      : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getAllFreelanceOpenings`,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          },
        );
        if (response?.data?.freelanceOpenings) {
          setFreelancePosts(response.data.freelanceOpenings);
        }
      } catch (error: any) {
        toast.error(
          `Error fetching freelance posts: ${error?.message || "Unknown error"}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminToken]);

  // Filter posts by search term (case insensitive)
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return freelancePosts;
    const lowerSearch = searchTerm.toLowerCase();

    return freelancePosts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(lowerSearch);
      const descMatch =
        post.description?.toLowerCase().includes(lowerSearch) ?? false;
      return titleMatch || descMatch;
    });
  }, [searchTerm, freelancePosts]);

  // Pagination: calculate posts for current page
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredPosts.slice(startIdx, startIdx + pageSize);
  }, [currentPage, pageSize, filteredPosts]);

  // When pageSize or filteredPosts change, reset page to 1 if currentPage > totalPages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Download all freelance posts as Excel
  const handleDownloadExcel = () => {
    if (freelancePosts.length === 0) {
      toast.error("No freelance posts to download.");
      return;
    }

    // Map posts to flat object for Excel
    const dataForExcel = freelancePosts.map(
      ({ _id, title, description, budget, deadline }) => ({
        ID: _id,
        Title: title,
        Description: description,
        Budget: budget ?? "N/A",
        Deadline: deadline ? new Date(deadline).toLocaleDateString() : "N/A",
      }),
    );

    // Create worksheet & workbook
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FreelanceJobs");

    // Export to file
    XLSX.writeFile(workbook, "freelance_jobs.xlsx");
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-dashed border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 transition-colors duration-300 dark:bg-gray-900">
      <Toaster position="top-center" />
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Freelance Jobs
        </h1>

        {/* Search and controls container */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box with fade-in animation */}
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-48 rounded border border-gray-300 px-3 py-2 text-gray-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            style={{ animation: "fadeIn 0.5s ease" }}
          />

          {/* Page size selector */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / page
              </option>
            ))}
          </select>

          {/* Download button */}
          <button
            onClick={handleDownloadExcel}
            className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            aria-label="Download all freelance jobs as Excel"
          >
            Download Excel
          </button>
        </div>
      </header>

      {filteredPosts.length === 0 ? (
        <p className="mt-10 text-center text-gray-500 dark:text-gray-400">
          No freelance jobs available currently.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse overflow-hidden rounded-md border border-gray-200 shadow-md dark:border-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  <th className="p-2 text-left">Logo</th>
                  <th className="p-2 text-left">Position</th>
                  <th className="p-2 text-left">Company</th>
                  <th className="p-2 text-left">Skills</th>
                  <th className="p-2 text-left">Location</th>
                  <th className="p-2 text-left">Salary</th>
                  <th className="p-2 text-left">Experience</th>
                  <th className="p-2 text-left">Job Description</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900">
                {paginatedPosts.map((post) => (
                  <tr
                    key={post._id}
                    className="transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {/* Logo */}
                    <td className="border-b border-gray-200 p-3 dark:border-gray-700">
                      <Image
                        src={post.logoUrl || "/default-logo.png"}
                        alt="logo"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </td>

                    {/* Position */}
                    <td className="border-b border-gray-200 p-3 text-gray-900 dark:border-gray-700 dark:text-gray-100">
                      {post.position || "N/A"}
                    </td>

                    {/* Company */}
                    <td className="border-b border-gray-200 p-3 text-gray-900 dark:border-gray-700 dark:text-gray-100">
                      {post.company || "N/A"}
                    </td>

                    {/* Skills */}
                    <td className="border-b border-gray-200 p-3 text-gray-900 dark:border-gray-700 dark:text-gray-100">
                      {post.skills && post.skills.length > 0
                        ? post.skills.join(", ")
                        : "N/A"}
                    </td>

                    {/* Location */}
                    <td className="border-b border-gray-200 p-3 text-gray-900 dark:border-gray-700 dark:text-gray-100">
                      {post.location || "N/A"}
                    </td>

                    {/* Salary */}
                    <td className="border-b border-gray-200 p-3 text-gray-900 dark:border-gray-700 dark:text-gray-100">
                      {post.salary ? `₹${post.salary}` : "N/A"}
                    </td>

                    {/* Experience */}
                    <td className="border-b border-gray-200 p-3 text-gray-900 dark:border-gray-700 dark:text-gray-100">
                      {post.experience ? `${post.experience} years` : "N/A"}
                    </td>

                    {/* Job Description */}
                    <td className="max-w-xs truncate border-b border-gray-200 p-3 text-gray-700 dark:border-gray-700 dark:text-gray-300">
                      {post.description || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-gray-700 dark:text-gray-300">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`rounded px-3 py-1 transition ${
                currentPage === 1
                  ? "cursor-not-allowed bg-gray-300 dark:bg-gray-700"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              }`}
              aria-label="Previous page"
            >
              Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded px-3 py-1 transition ${
                  page === currentPage
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "hover:bg-blue-200 dark:hover:bg-gray-700"
                }`}
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`rounded px-3 py-1 transition ${
                currentPage === totalPages
                  ? "cursor-not-allowed bg-gray-300 dark:bg-gray-700"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              }`}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Fade-in animation style */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Freelancing;
