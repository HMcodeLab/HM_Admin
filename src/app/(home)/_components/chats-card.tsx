"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchCoursesForAdmin } from "@/api/api";

const ITEMS_PER_PAGE = 10;

interface Instructor {
  name?: string;
}

interface Course {
  _id: string;
  title: string;
  category: string;
  instructor?: Instructor;
  level: string;
  courseType: string;
  courseStartDate: string;
  base_price: number;
  display: boolean;
}

export function ChatsCard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourseCount, setActiveCourseCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          toast.error("No authorization token found");
          setIsLoading(false);
          return;
        }

        const courseData: Course[] = await fetchCoursesForAdmin(token);
        const activeCourses = courseData.filter(
          (course) => course.display === true,
        );
        setCourses(activeCourses);
        setActiveCourseCount(activeCourses.length);
      } catch (error) {
        toast.error("Error loading course data");
        console.error("ChatsCard error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const paginatedCourses = courses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="animate-fadeIn col-span-12 mt-12 rounded-lg bg-white py-6 shadow-lg dark:bg-gray-900 dark:shadow-xl">
      <div className="mb-5 flex flex-col items-center justify-between gap-3 px-6 sm:flex-row sm:px-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Now Showing: Top Courses on Our Portal
        </h2>
        <button
          onClick={() => (window.location.href = "/course/viewcourse")}
          className="font-medium text-primary transition-transform duration-300 ease-in-out hover:scale-105 hover:underline focus:outline-none focus:ring-2 focus:ring-primary"
        >
          See All
        </button>
      </div>

      <p className="mb-4 px-6 text-sm text-gray-600 dark:text-gray-400 sm:px-10">
        Active Courses:{" "}
        <span className="font-semibold text-primary">{activeCourseCount}</span>
      </p>

      <div className="overflow-x-auto px-6 sm:px-10">
        <table className="w-full min-w-[900px] text-left text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              {[
                "#",
                "Title",
                "Category",
                "Instructor",
                "Level",
                "Type",
                "Start Date",
                "Price",
                "Display",
              ].map((heading) => (
                <th
                  key={heading}
                  className="sticky top-0 z-10 bg-gray-50 px-4 py-3 dark:bg-gray-800"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedCourses.map((course, index) => (
              <tr
                key={course._id}
                className="cursor-pointer border-b bg-white transition-colors duration-300 hover:bg-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-primary/20"
               
              >
                <td className="px-4 py-2">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="px-4 py-2 font-semibold">{course.title}</td>
                <td className="px-4 py-2">{course.category}</td>
                <td className="px-4 py-2">{course.instructor?.name}</td>
                <td className="px-4 py-2">{course.level}</td>
                <td className="px-4 py-2 capitalize">{course.courseType}</td>
                <td className="px-4 py-2">
                  {new Date(course.courseStartDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 font-medium">₹{course.base_price}</td>
                <td className="px-4 py-2 font-medium text-green-600">Yes</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center px-6 sm:px-10">
        <nav
          className="inline-flex rounded-md shadow-sm"
          aria-label="Pagination"
        >
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={`border px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out ${
                currentPage === index + 1
                  ? "scale-110 border-primary bg-primary text-white shadow-lg"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              }`}
              aria-current={currentPage === index + 1 ? "page" : undefined}
            >
              {index + 1}
            </button>
          ))}
        </nav>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
}
