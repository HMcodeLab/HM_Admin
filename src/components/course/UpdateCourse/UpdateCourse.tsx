"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

import Loader from "@/components/Loader";
import InstructorDetail from "../addcourse/InstructorDetail";
import CourseInfo from "../addcourse/CourseInfo";
import QualityOverview from "../addcourse/QualityOverview";
import PriceAndDiscount from "../addcourse/PriceAndDiscount";
import ThumbnailAndTeaser from "../addcourse/ThumbnailAndTeaser";
import CurriculumLiveClasses from "../addcourse/CurriculumLiveClasses";

import { CourseType, Instructor, MediaItem } from "@/types";
import ConfirmUpdate from "@/utils/ConfirmUpdate";

const UpdateCourse: React.FC<{ slug?: string }> = ({ slug }) => {
  const searchParams = useSearchParams();
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingBatches, setUpdatingBatches] = useState(false);
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);

  const [course, setCourse] = useState<CourseType>({
    instructor: "",
    courseID: "",
    bannerImg: "",
    title: "",
    category: "",
    subcategory: "",
    level: "",
    base_price: "",
    discount_percentage: "",
    overview: "",
    featured_image: "",
    featured_video: "",
    courseType: "",
    credits: 0,
    duration: 0,
    courseStartDate: "",
    faqs: [],
    curriculum: [
      {
        chapter_name: "",
        lessons: [
          {
            lesson_name: "",
            duration: "30",
            video: "",
            notes: "",
            notesName: "",
            assignment: "",
            assignmentName: "",
            transcript: "",
            isLiveClass: false,
            liveClass: { startDate: "", endDate: "", meetingLink: "" },
          },
        ],
        project: [],
      },
    ],
    whatWillILearn: [],
    liveClasses: [],
    testimonials: [],
    reviews: [],
    companies: [],
    placementOpportunities: [],
    discounted_price: 0,
    thumbnailImg: "",
    teaserLink: "",
    certificate: "",
    learning_outcome: "",
    skill: [],
    tools: [],
    language: "",
    mode: "",
    live_session: false,
    status: "",
    assessments: [],
  });

  const getAdminToken = () => localStorage.getItem("adminToken") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAdminToken();
        if (!token) {
          toast.error("Admin token not found");
          setLoading(false);
          return;
        }

        const [mediaRes, instructorsRes, courseRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getfilesfromaws`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/instructors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/course/${slug || searchParams.get("coursename")}`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        ]);

        if (mediaRes.data.success) setUploadedMedia(mediaRes.data.data);
        if (instructorsRes.data.success)
          setInstructors(instructorsRes.data.data);
        if (courseRes.data?.course) setCourse(courseRes.data.course);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load initial data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, searchParams]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = getAdminToken();
      if (!token) throw new Error("Admin token not found");

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/updatecourse`,
        course,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) toast.success("Course updated successfully!");
      else throw new Error(res.data.message || "Failed to update course");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error updating course",
      );
    } finally {
      setSubmitting(false);
    }
  };

  

  const updateAllBatches = async () => {
    setUpdatingBatches(true);
    try {
      const token = getAdminToken();
      if (!token) throw new Error("Admin token not found");
      if (!course.courseID) throw new Error("Course ID not found");

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/setCourseCurriculumForAllBatches`,
        { courseId: course.courseID },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        toast.success("All batches updated successfully!");
        setShowBatchConfirm(false);
      } else throw new Error(res.data.message || "Failed to update batches");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update batches",
      );
    } finally {
      setUpdatingBatches(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4">
      <Toaster position="top-right" />

      {/* Instructor & Info */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-6 shadow-lg transition-shadow hover:shadow-xl">
          <InstructorDetail
            InstructorDetails={instructors}
            courseDetails={course}
            setCourseDetails={setCourse}
          />
        </div>
        <div className="rounded-xl border border-gray-200 p-6 shadow-lg transition-shadow hover:shadow-xl">
          <CourseInfo courseDetails={course} setCourseDetails={setCourse} />
        </div>
      </div>

      {/* Other Sections */}
      <QualityOverview courseDetails={course} setCourseDetails={setCourse} />
      <PriceAndDiscount courseDetails={course} setCourseDetails={setCourse} />
      <ThumbnailAndTeaser
        courseDetails={course}
        setCourseDetails={setCourse}
        uploadedMedia={uploadedMedia}
        loading={loading}
      />

      <CurriculumLiveClasses
        courseDetails={course}
        setCourseDetails={setCourse}
        uploadedMedia={uploadedMedia}
        setUploadedMedia={setUploadedMedia}
        needToUpdate={false}
      />

      {/* Action Buttons */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="transform rounded-lg bg-gradient-to-r from-teal-400 to-green-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Updating..." : "Update Course"}
        </button>
        <button
          onClick={() => setShowBatchConfirm(true)}
          disabled={updatingBatches}
          className="transform rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {updatingBatches ? "Processing..." : "Update All Batches"}
        </button>
      </div>

      {/* ConfirmUpdate Modal */}
      {showBatchConfirm && (
        <ConfirmUpdate
          modalClose={() => setShowBatchConfirm(false)}
          handler={updateAllBatches}
          // message="This will update the curriculum for all batches of this course. Continue?"
        />
      )}
    </div>
  );
};

export default UpdateCourse;
