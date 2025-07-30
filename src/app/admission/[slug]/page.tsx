"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

type Instructor = {
  profile?: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  bio: string;
};

type CurriculumChapter = {
  lessons: any[];
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
  completed_lessons: any[]; // specify if you have lesson type
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
  role?: string; // optional, if you want to include user role
};

interface PageProps {
  params: {
    slug: string;
  };
}

const profilePlaceholder = "/assets/person.png"; // public folder mein rakho image ya external URL

export default function Page({ params }: PageProps) {
  const { slug } = params;

  const [studentDetail, setStudentDetail] = useState<StudentDetail | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"personal" | "course">("personal");

  // Pagination state (for courses list)
  const [itemsPerPage, setItemsPerPage] = useState<number>(30);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch student data on slug change
  useEffect(() => {
    async function fetchStudent() {
      setLoading(true);
      try {
        // Adjust your API endpoint as needed
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/user/${slug}`,
        );

        if (!res.ok) throw new Error("Failed to fetch student");

        const data = await res.json();
        console.log("Fetched student data:", data);
        setStudentDetail(data.userDetails);
      } catch (error) {
        console.error("Error fetching student:", error);
        setStudentDetail(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [slug]);

  // Calculate overall progress
  function calculateOverallProgress() {
    if (!studentDetail?.purchased_courses)
      return { overallProgress: 0, completedLessons: 0, totalLessons: 0 };

    let totalLessons = 0;
    let completedLessons = 0;

    studentDetail.purchased_courses.forEach((course) => {
      const lessonsCount = course.course.curriculum
        ? course.course.curriculum.reduce(
            (acc, ch) => acc + ch.lessons.length,
            0,
          )
        : 0;
      totalLessons += lessonsCount;
      completedLessons += course.completed_lessons.length;
    });

    const overallProgress = totalLessons
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    return { overallProgress, completedLessons, totalLessons };
  }

  // Pagination logic for courses
  const courses = studentDetail?.purchased_courses || [];
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const paginatedCourses = courses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Modal state and selected course (if needed)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<PurchasedCourse | null>(
    null,
  );

  const openModal = (course: PurchasedCourse) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };

  if (loading)
    return <div className="p-4 text-center dark:text-white">Loading...</div>;

  if (!studentDetail)
    return (
      <div className="p-4 text-center dark:text-white">Student not found</div>
    );

  const { overallProgress, completedLessons, totalLessons } =
    calculateOverallProgress();

  return (
    <div className="min-h-screen bg-white p-6 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="mb-6 text-center text-4xl font-bold underline">
        Student Details
      </h1>

      {/* Header */}
      <div className="mx-auto mb-10 flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-col items-center space-y-3">
          <Image
            src={studentDetail.profile || profilePlaceholder}
            alt="Profile image"
            className="h-32 w-32 rounded-full border object-cover"
            width={128}
            height={128}
          />
          <p className="text-2xl font-semibold capitalize">
            {studentDetail.name}
          </p>
        </div>

        {/* Overall Progress Card */}
        <div className="w-72 rounded-md bg-pink-100 p-6 text-center shadow-lg dark:bg-pink-900">
          <p className="mb-4 text-2xl font-semibold">Overall Progress</p>
          <p className="text-6xl font-bold text-pink-600 dark:text-pink-400">
            {overallProgress}%
          </p>
          <p className="text-xl">
            <span className="font-semibold text-green-500">
              {completedLessons}
            </span>{" "}
            / {totalLessons} lessons
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto mb-6 flex max-w-6xl justify-center space-x-4 border-b-4 border-gray-300 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("personal")}
          className={`border-b-4 px-6 py-2 font-semibold ${
            activeTab === "personal"
              ? "border-green-500 text-green-600 dark:text-green-400"
              : "border-transparent text-gray-600 dark:text-gray-400"
          } transition-colors`}
        >
          Personal Details
        </button>
        <button
          onClick={() => setActiveTab("course")}
          className={`border-b-4 px-6 py-2 font-semibold ${
            activeTab === "course"
              ? "border-green-500 text-green-600 dark:text-green-400"
              : "border-transparent text-gray-600 dark:text-gray-400"
          } transition-colors`}
        >
          Course Details
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "personal" && (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          {/* Personal Info */}
          <div className="mx-auto max-w-xl rounded-md bg-gray-100 p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-6 border-b pb-2 text-2xl font-semibold dark:text-white">
              Personal Details
            </h2>
            <table className="w-full border-collapse text-left">
              <tbody>
                {[
                  { label: "Full Name", value: studentDetail?.name },
                  { label: "Email", value: studentDetail?.email },
                  { label: "Phone", value: studentDetail?.phone || "-" },
                  { label: "College", value: studentDetail?.college || "-" },
                  { label: "Degree", value: studentDetail?.degree || "-" },
                  { label: "Address", value: studentDetail?.address || "-" },
                  {
                    label: "Is Course Opened",
                    value: studentDetail?.isCourseOpened ? "YES" : "NO",
                  },
                  {
                    label: "Is Course Completed",
                    value: studentDetail?.isCourseCompleted ? "YES" : "NO",
                  },
                  {
                    label: "Is Course Paid",
                    value: studentDetail?.isCoursePaid ? "YES" : "NO",
                  },
                  {
                    label: "Registered On",
                    value: studentDetail?.createdAt
                      ? new Date(studentDetail.createdAt).toLocaleDateString()
                      : "-",
                  },
                ].map(({ label, value }) => (
                  <tr
                    key={label}
                    className="border-b border-gray-300 dark:border-gray-700"
                  >
                    <th className="w-1/3 px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                      {label}
                    </th>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Additional Info */}
          <div className="mx-auto max-w-xl rounded-md bg-gray-100 p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-6 border-b pb-2 text-2xl font-semibold dark:text-white">
              Additional Details
            </h2>
            <table className="w-full border-collapse text-left">
              <tbody>
                {[
                  { label: "Role", value: studentDetail?.role || "-" },
                  {
                    label: "Date of Birth",
                    value: studentDetail?.dateOfBirth || "-",
                  },
                  { label: "Gender", value: studentDetail?.gender || "-" },
                  {
                    label: "Nationality",
                    value: studentDetail?.nationality || "-",
                  },
                  { label: "Status", value: studentDetail?.status || "-" },
                  {
                    label: "Academic Qualification",
                    value: studentDetail?.academicQualification || "-",
                  },
                  {
                    label: "Experience",
                    value: studentDetail?.experience || "-",
                  },
                ].map(({ label, value }) => (
                  <tr
                    key={label}
                    className="border-b border-gray-300 dark:border-gray-700"
                  >
                    <th className="w-1/3 px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                      {label}
                    </th>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "course" && (
        <div className="mx-auto max-w-6xl">
          {/* Pagination controls */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              Show{" "}
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value, 10));
                  setCurrentPage(1); // reset page on change
                }}
                className="rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
              >
                {[30, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>{" "}
              entries
            </div>

            <div>
              Page{" "}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="mr-2 rounded border border-gray-300 px-2 py-1 disabled:opacity-50 dark:border-gray-700"
              >
                Prev
              </button>
              <span>
                {currentPage} / {totalPages || 1}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="ml-2 rounded border border-gray-300 px-2 py-1 disabled:opacity-50 dark:border-gray-700"
              >
                Next
              </button>
            </div>
          </div>

          {/* Course cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedCourses.map((course, idx) => {
              const totalLessonsCount = course.course.curriculum
                ? course.course.curriculum.reduce(
                    (acc, ch) => acc + ch.lessons.length,
                    0,
                  )
                : 0;
              const completed = course.completed_lessons.length;
              const progressPercent = totalLessonsCount
                ? Math.round((completed / totalLessonsCount) * 100)
                : 0;

              return (
                <div
                  key={course.course.courseID}
                  className="flex flex-col justify-between rounded-md border bg-gray-50 p-4 shadow-md dark:bg-gray-800"
                >
                  <h3 className="mb-2 text-lg font-semibold">
                    {course.course.title}
                  </h3>
                  <p>Total Lessons: {totalLessonsCount}</p>
                  <p>Completed Lessons: {completed}</p>
                  <p>Progress: {progressPercent}%</p>
                  <button
                    className="mt-3 self-start text-blue-600 underline dark:text-blue-400"
                    onClick={() => openModal(course)}
                  >
                    View More
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={closeModal}
        >
          <div
            className="max-h-[80vh] max-w-4xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-center text-xl font-semibold underline">
              Course Details
            </h2>
            <p>
              <strong>Course Name:</strong> {selectedCourse.course.title}
            </p>
            <p className="mb-2">
              <strong>Overview:</strong>{" "}
              <span className="whitespace-pre-line">
                {selectedCourse.course.overview.replace(/•/g, "\n•")}
              </span>
            </p>
            <p>
              <strong>Course Code:</strong> {selectedCourse.course.courseID}
            </p>
            <p>
              <strong>Category:</strong> {selectedCourse.course.category}
            </p>
            <p>
              <strong>Level:</strong> {selectedCourse.course.level}
            </p>
            <p>
              <strong>Cost:</strong> ₹ {selectedCourse.course.base_price}
            </p>

            {selectedCourse.course.instructor ? (
              <div className="mt-6 border-t pt-4">
                <h3 className="mb-2 text-lg font-semibold underline">
                  Instructor Details
                </h3>
                <div className="flex items-center gap-4">
                  <Image
                    src={
                      selectedCourse.course.instructor.profile ||
                      profilePlaceholder
                    }
                    alt="Instructor"
                    className="h-24 w-24 rounded-full border object-cover"
                  />
                  <div className="text-sm">
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedCourse.course.instructor.name}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedCourse.course.instructor.email}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedCourse.course.instructor.phone}
                    </p>
                    <p>
                      <strong>Experience:</strong>{" "}
                      {selectedCourse.course.instructor.experience}
                    </p>
                  </div>
                </div>
                <p className="mt-2">{selectedCourse.course.instructor.bio}</p>
              </div>
            ) : (
              <p className="mt-6 text-center font-semibold">
                No Instructor Details Found
              </p>
            )}

            <button
              onClick={closeModal}
              className="mt-6 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
