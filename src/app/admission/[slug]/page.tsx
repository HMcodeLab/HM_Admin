"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

// Types
type Instructor = {
  profile?: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  bio: string;
};

type Lesson = {
  id: string;
  title: string;
  duration: number;
};

type CurriculumChapter = {
  title: string;
  lessons: Lesson[];
};

type Course = {
  courseID: string;
  title: string;
  overview: string;
  category: string;
  level: string;
  base_price: number;
  instructor?: Instructor;
  curriculum?: CurriculumChapter[];
};

type PurchasedCourse = {
  course: Course;
  completed_lessons: string[];
};

type StudentDetail = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  address?: string;
  createdAt: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  status?: string;
  academicQualification?: string;
  experience?: string;
  profile?: string;
  purchased_courses?: PurchasedCourse[];
  isCourseOpened?: boolean;
  isCourseCompleted?: boolean;
  isCoursePaid?: boolean;
  degree?: string;
  role?: string;
};

// Constants
const PROFILE_PLACEHOLDER = "/images/default-avatar.avif";
const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30] as const;

export default function StudentDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const [studentDetail, setStudentDetail] = useState<StudentDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"personal" | "course">("personal");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<PurchasedCourse | null>(
    null,
  );

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/user/${slug}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        setStudentDetail(data.userDetails);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch student",
        );
        setStudentDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [slug]);

  // Calculate course progress
  const calculateCourseProgress = (course: PurchasedCourse) => {
    const totalLessons =
      course.course.curriculum?.reduce(
        (sum, chapter) => sum + chapter.lessons.length,
        0,
      ) || 0;

    const completed = course.completed_lessons.length;
    const progress =
      totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

    return { totalLessons, completed, progress };
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!studentDetail?.purchased_courses) {
      return { overallProgress: 0, completedLessons: 0, totalLessons: 0 };
    }

    let totalLessons = 0;
    let completedLessons = 0;

    studentDetail.purchased_courses.forEach((course) => {
      const { totalLessons: courseTotal, completed } =
        calculateCourseProgress(course);
      totalLessons += courseTotal;
      completedLessons += completed;
    });

    const overallProgress =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return { overallProgress, completedLessons, totalLessons };
  };

  // Pagination
  const courses = studentDetail?.purchased_courses || [];
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const paginatedCourses = courses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Modal handlers
  const handleOpenModal = (course: PurchasedCourse) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl font-semibold">Loading student data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  if (!studentDetail) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl font-semibold">Student not found</div>
      </div>
    );
  }

  const { overallProgress, completedLessons, totalLessons } =
    calculateOverallProgress();

  return (
    <div className="min-h-screen bg-white p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Header Section */}
      <header className="mb-10">
        <h1 className="mb-6 text-center text-3xl font-bold md:text-4xl">
          Student Details
        </h1>

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center space-y-3">
            <div className="relative h-32 w-32">
              <Image
                src={studentDetail?.profile || PROFILE_PLACEHOLDER}
                alt="Profile"
                fill
                className="rounded-full border object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PROFILE_PLACEHOLDER;
                }}
              />
            </div>
            <p className="text-2xl font-semibold capitalize">
              {studentDetail.name}
            </p>
          </div>

          <div className="w-full rounded-lg bg-blue-50 p-6 shadow-md dark:bg-blue-900 md:w-72">
            <p className="mb-4 text-xl font-semibold">Overall Progress</p>
            <div className="flex items-end justify-between">
              <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                {overallProgress}%
              </p>
              <p className="text-lg">
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {completedLessons}
                </span>{" "}
                / {totalLessons}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="mx-auto mb-8 max-w-6xl">
        <div className="flex border-b dark:border-gray-700">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "personal"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab("course")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "course"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Course Details
          </button>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="mx-auto max-w-6xl">
        {activeTab === "personal" ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Details Card */}
            <div className="rounded-lg border bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">
                Personal Information
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Full Name", value: studentDetail.name },
                  { label: "Email", value: studentDetail.email },
                  {
                    label: "Phone",
                    value: studentDetail.phone || "Not provided",
                  },
                  {
                    label: "College",
                    value: studentDetail.college || "Not provided",
                  },
                  {
                    label: "Degree",
                    value: studentDetail.degree || "Not provided",
                  },
                  {
                    label: "Address",
                    value: studentDetail.address || "Not provided",
                  },
                  {
                    label: "Registered On",
                    value: new Date(
                      studentDetail.createdAt,
                    ).toLocaleDateString(),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="border-b pb-2 dark:border-gray-700"
                  >
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>
                    <p className="text-lg">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Details Card */}
            <div className="rounded-lg border bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">
                Additional Information
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: "Date of Birth",
                    value: studentDetail.dateOfBirth || "Not provided",
                  },
                  {
                    label: "Gender",
                    value: studentDetail.gender || "Not provided",
                  },
                  {
                    label: "Nationality",
                    value: studentDetail.nationality || "Not provided",
                  },
                  {
                    label: "Status",
                    value: studentDetail.status || "Not provided",
                  },
                  {
                    label: "Academic Qualification",
                    value:
                      studentDetail.academicQualification || "Not provided",
                  },
                  {
                    label: "Experience",
                    value: studentDetail.experience || "Not provided",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="border-b pb-2 dark:border-gray-700"
                  >
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>
                    <p className="text-lg">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Courses Pagination Controls */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div className="flex items-center space-x-2">
                <span>Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-md border px-3 py-1 dark:border-gray-700 dark:bg-gray-800"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span>entries</span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-md border px-3 py-1 disabled:opacity-50 dark:border-gray-700"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="rounded-md border px-3 py-1 disabled:opacity-50 dark:border-gray-700"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedCourses.map((course) => {
                const { progress, totalLessons, completed } =
                  calculateCourseProgress(course);

                return (
                  <div
                    key={course.course.courseID}
                    className="rounded-lg border bg-gray-50 p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                  >
                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
                      {course.course.title}
                    </h3>

                    <div className="mb-3 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Progress: {progress}%</span>
                      <span>
                        {completed}/{totalLessons} lessons
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenModal(course)}
                      className="mt-3 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>

            {paginatedCourses.length === 0 && (
              <div className="rounded-lg border bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                <p className="text-lg">No courses found</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Course Details Modal */}
      {modalOpen && selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-between">
              <h2 className="text-xl font-bold">
                {selectedCourse.course.title}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Course Overview</h3>
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                  {selectedCourse.course.overview}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Course ID
                  </p>
                  <p>{selectedCourse.course.courseID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Category
                  </p>
                  <p>{selectedCourse.course.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Level
                  </p>
                  <p>{selectedCourse.course.level}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Price
                  </p>
                  <p>₹{selectedCourse.course.base_price}</p>
                </div>
              </div>

              {selectedCourse.course.instructor && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="mb-3 text-lg font-semibold">Instructor</h3>
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={
                          selectedCourse.course.instructor.profile ||
                          PROFILE_PLACEHOLDER
                        }
                        alt="Instructor"
                        fill
                        className="rounded-full border object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            PROFILE_PLACEHOLDER;
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium">
                        {selectedCourse.course.instructor.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedCourse.course.instructor.email}
                      </p>
                      <p className="mt-2 text-sm">
                        {selectedCourse.course.instructor.experience}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
