"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaTrashAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

interface Instructor {
  name: string;
}

interface Course {
  _id: string;
  instructor?: Instructor;
  slug?: string;
  title: string;
  category: string;
  subcategory: string;
  base_price: number | string;
  courseType: string;
  display: boolean;
}

interface CourseStatus {
  [key: string]: boolean;
}

const ViewCourse: React.FC = () => {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<string[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [uniquePrices, setUniquePrices] = useState<(number | string)[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentID, setCurrentID] = useState<string>("");
  const [courseStatus, setCourseStatus] = useState<CourseStatus>({});
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    id: string | null;
    action: "enable" | "disable" | null;
  }>({ show: false, id: null, action: null });

  const adminToken =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") || ""
      : "";

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Course[]>(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/coursesforadmin`,
      );
      setCourses(response.data);

      const status: CourseStatus = {};
      response.data.forEach((course) => {
        status[course._id] = course.display;
      });
      setCourseStatus(status);

      const uniqueInstructorsSet = new Set(
        response.data.map((course) => course.instructor?.name ?? ""),
      );
      setInstructors([...uniqueInstructorsSet].filter(Boolean));

      const uniquePricesSet = new Set(
        response.data.map((course) => course.base_price),
      );
      setUniquePrices([...uniquePricesSet]);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // Filtering logic
  const filteredData = courses
    .filter((course) => {
      const courseSlug = course.slug?.toLowerCase() ?? "";
      const instructorName = course.instructor?.name.toLowerCase() ?? "";
      return (
        courseSlug.includes(searchTerm.toLowerCase()) ||
        instructorName.includes(searchTerm.toLowerCase())
      );
    })
    .filter(
      (course) => !priceFilter || course.base_price.toString() === priceFilter,
    )
    .filter(
      (course) =>
        !selectedInstructor || course.instructor?.name === selectedInstructor,
    );

  const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredData.length / postsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handlePriceFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPriceFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleUpdate = (id: string) => {
    router.push(`/courses-update?coursename=${id}`);
  };

  const toggleDelete = (id: string) => {
    setCurrentID(id);
    setDeleteModal(true);
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/deletecourse`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          data: { _id: id },
        },
      );
      toast.success("Course Deleted Successfully");
      setDeleteModal(false);
      setCourses((prev) => prev.filter((course) => course._id !== id));
    } catch (error) {
      toast.error("Unable to Delete Course");
    }
  };

  const handleConfirmEnableDisable = (
    id: string,
    action: "enable" | "disable",
  ) => {
    setConfirmModal({ show: true, id, action });
  };

  const handleEnableDisable = async () => {
    const { id, action } = confirmModal;
    if (!id || !action) return;

    try {
      const updatedCourse = {
        _id: id,
        display: action === "enable",
      };
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/updatecourse`,
        updatedCourse,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      setCourseStatus((prev) => ({ ...prev, [id]: action === "enable" }));
      toast.success(
        `Course ${action === "enable" ? "enabled" : "disabled"} successfully`,
      );
    } catch (error) {
      toast.error(`Failed to ${action} the course`);
      console.error("Error updating course status:", error);
    }
    setConfirmModal({ show: false, id: null, action: null });
  };

  if (loading) return <Loader />;

  // Custom Pagination Component
  const CustomPagination: React.FC<{
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  }> = ({ totalPages, currentPage, onPageChange }) => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav
        aria-label="Pagination"
        className="mt-6 flex select-none justify-center space-x-2"
      >
        <button
          className="rounded-md px-3 py-1 text-gray-600 hover:bg-gray-300 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous Page"
        >
          &laquo;
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`rounded-md px-3 py-1 transition ${
              currentPage === number
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
            aria-current={currentPage === number ? "page" : undefined}
          >
            {number}
          </button>
        ))}
        <button
          className="rounded-md px-3 py-1 text-gray-600 hover:bg-gray-300 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
        >
          &raquo;
        </button>
      </nav>
    );
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-white p-4 transition-colors duration-300 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Search Courses Here"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 md:w-1/3"
            />

            <select
              value={selectedInstructor}
              onChange={(e) => {
                setSelectedInstructor(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full cursor-pointer rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 md:w-1/4"
            >
              <option value="">Filter By Instructor</option>
              {instructors.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>

            <select
              value={priceFilter}
              onChange={handlePriceFilterChange}
              className="w-full cursor-pointer rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 md:w-1/4"
            >
              <option value="">Filter By Price</option>
              {uniquePrices.map((price) => (
                <option key={price?.toString()} value={price?.toString()}>
                  {price}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
            <table className="w-full table-auto text-left text-sm text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-center">Sr. No.</th>
                  <th className="px-4 py-3 text-center">Instructor Name</th>
                  <th className="px-4 py-3 text-center">Title</th>
                  <th className="px-4 py-3 text-center">Category</th>
                  <th className="px-4 py-3 text-center">Subcategory</th>
                  <th className="px-4 py-3 text-center">Base Price</th>
                  <th className="px-4 py-3 text-center">Course Type</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                  <th className="px-4 py-3 text-center">Enable/Disable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentPosts.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No courses found.
                    </td>
                  </tr>
                )}
                {currentPosts.map((course, idx) => {
                  const serialNumber =
                    idx + 1 + (currentPage - 1) * postsPerPage;
                  return (
                    <tr
                      key={course._id}
                      className="cursor-default hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-3 text-center">{serialNumber}</td>
                      <td className="px-4 py-3 text-center">
                        {course.instructor?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-center">{course.title}</td>
                      <td className="px-4 py-3 text-center">
                        {course.category}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {course.subcategory}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {course.base_price}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {course.courseType}
                      </td>
                      <td className="space-x-2 px-4 py-3 text-center">
                        <button
                          onClick={() => toggleDelete(course._id)}
                          aria-label="Delete Course"
                          title="Delete Course"
                          className="text-red-600 transition hover:text-red-800"
                        >
                          <FaTrashAlt size={20} />
                        </button>
                        {/* <button
                          onClick={() => handleUpdate(course._id)}
                          aria-label="Update Course"
                          title="Update Course"
                          className="text-blue-600 transition hover:text-blue-800"
                        >
                          Edit
                        </button> */}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {courseStatus[course._id] ? (
                          <button
                            aria-label="Disable Course"
                            title="Disable Course"
                            className="text-green-500 hover:text-green-700"
                            onClick={() =>
                              handleConfirmEnableDisable(course._id, "disable")
                            }
                          >
                            <FaToggleOn size={25} />
                          </button>
                        ) : (
                          <button
                            aria-label="Enable Course"
                            title="Enable Course"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() =>
                              handleConfirmEnableDisable(course._id, "enable")
                            }
                          >
                            <FaToggleOff size={25} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Custom Pagination */}
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={paginate}
          />
        </div>

        {/* Confirm Enable/Disable Modal */}
        {confirmModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-xs rounded-lg bg-white p-6 text-center shadow-lg dark:bg-gray-800">
              <p className="mb-4 text-gray-900 dark:text-gray-100">
                Are you sure you want to{" "}
                <span className="font-semibold">
                  {confirmModal.action === "enable" ? "enable" : "disable"}
                </span>{" "}
                this course?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                  onClick={() =>
                    setConfirmModal({ show: false, id: null, action: null })
                  }
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                  onClick={handleEnableDisable}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-xs rounded-lg bg-white p-6 text-center shadow-lg dark:bg-gray-800">
              <p className="mb-4 text-gray-900 dark:text-gray-100">
                Are you sure you want to delete this course?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="rounded-md bg-gray-400 px-4 py-2 text-white transition hover:bg-gray-500"
                  onClick={() => setDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                  onClick={() => handleDeleteCourse(currentID)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewCourse;
