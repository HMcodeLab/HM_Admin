"use client";

import React, { useEffect, useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

// Import your subcomponents
import InstructorDetail from "./InstructorDetail";
import CourseInfo from "./CourseInfo";
import QualityOverview from "./QualityOverview";
import PriceAndDiscount from "./PriceAndDiscount";
import ThumbnailAndTeaser from "./ThumbnailAndTeaser";
import FaqLearningOutcomes from "./FaqLearningOutcomes";
import PlacementAverageSalary from "./PlacementAverageSalary";
import CurriculumLiveClasses from "./CurriculumLiveClasses";
import ReviewTestimonials from "./ReviewTestimonials";

// Interfaces for your data structures
interface LiveClass {
  streamKey: string;
  startDate: string;
  endDate: string;
}

interface Lesson {
  lesson_name: string;
  duration: string;
  video: string;
  notes: string;
  notesName: string;
  assignment: string;
  assignmentName: string;
  isLiveClass: boolean;
  liveClass: LiveClass;
}

interface Chapter {
  chapter_name: string;
  lessons: Lesson[];
}

interface Project {
  title: string;
  startDate: string;
  endDate: string;
  projectInfoPdf: string;
  duration: string;
}

interface CurriculumUnit {
  unitName: string;
  chapters: Chapter[];
  project: Project[];
}

interface InternshipData {
  instructor: string;
  internshipId: string;
  bannerImg: string;
  title: string;
  category: string;
  subcategory: string;
  level: string;
  base_price: string;
  discount_percentage: number;
  overview: string;
  registration_price: number;
  featured_image: string;
  featured_video: string;
  courseType: string;
  credits: number;
  duration: number;
  internshipStartDate: string;
  faqs: any[];
  internshipPeriod: string;
  internshipCategory: string;
  curriculum: CurriculumUnit[];
  learningOutcome: any[];
  testimonials: any[];
  reviews: any[];
  companies_hiring: any[];
  placementOpportunities: any[];
}

interface Instructor {
  _id: string;
  name: string;
}

const initialData: InternshipData = {
  instructor: "",
  internshipId: "",
  bannerImg: "",
  title: "",
  category: "",
  subcategory: "",
  level: "",
  base_price: "",
  discount_percentage: 0,
  overview: "",
  registration_price: 0,
  featured_image: "",
  featured_video: "",
  courseType: "",
  credits: 0,
  duration: 45,
  internshipStartDate: "",
  faqs: [],
  internshipPeriod: "",
  internshipCategory: "",
  curriculum: [
    {
      unitName: "",
      chapters: [
        {
          chapter_name: "",
          lessons: [
            {
              lesson_name: "",
              duration: "",
              video: "",
              notes: "",
              notesName: "",
              assignment: "",
              assignmentName: "",
              isLiveClass: false,
              liveClass: {
                streamKey: "",
                startDate: "",
                endDate: "",
              },
            },
          ],
        },
      ],
      project: [
        {
          title: "",
          startDate: "",
          endDate: "",
          projectInfoPdf: "",
          duration: "",
        },
      ],
    },
  ],
  learningOutcome: [],
  testimonials: [],
  reviews: [],
  companies_hiring: [],
  placementOpportunities: [],
};

const AddInternship: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedMedia, setUploadedMedia] = useState<any[]>([]);
  const [submitLoader, setSubmitLoader] = useState<boolean>(false);
  const [allInstructor, setAllInstructor] = useState<Instructor[]>([]);
  const [instructorError, setInstructorError] = useState<string | null>(null);
  const [selectedMediaFromModal, setSelectedMediaFromModal] =
    useState<string>("");
  const [internshipData, setInternshipData] =
    useState<InternshipData>(initialData);

  // Token logic
  const adminToken = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminToken") ?? "";
    }
    return "";
  }, []);

  const validToken = useMemo(() => {
    try {
      return adminToken ? jwtDecode(adminToken) : null;
    } catch {
      return null;
    }
  }, [adminToken]);

  useEffect(() => {
    if (!validToken) {
      localStorage.removeItem("COURSES_USER_TOKEN");
      localStorage.removeItem("adminEmail");
    }
  }, [validToken]);

  // useEffect with inline API functions (avoids dependency warnings)
  useEffect(() => {
    if (!validToken) return;

    const internshipMedia = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getcoursemedia/internship-media`,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          },
        );
        if (response.status === 200) setUploadedMedia(response.data.mediaFiles);
      } catch (error: any) {
        console.error("Error fetching internship media:", error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDataInstructor = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/instructors`,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          },
        );
        if (response?.data?.success) {
          setAllInstructor(response.data.data || []);
          setInstructorError(null);
        } else {
          setInstructorError("Unable to fetch instructors.");
        }
      } catch (error: any) {
        setInstructorError("Error fetching instructors: " + error.message);
      }
    };

    internshipMedia();
    fetchDataInstructor();
  }, [validToken, adminToken]);

  const handleSubmit = async () => {
    setSubmitLoader(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/addInternship`,
        internshipData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );
      if (response.status === 201) {
        toast.success("New Internship course created successfully");
        setInternshipData(initialData);
      } else {
        toast.error("Error in creating new internship course");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error creating internship",
      );
    } finally {
      setSubmitLoader(false);
    }
  };

  return (
    <div className="mx-[5%] my-6 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-[5%] my-6 flex flex-col gap-4">
        <Toaster position="top-center" />
        <InstructorDetail
          InstructorDetails={allInstructor}
          courseDetails={internshipData}
          setCourseDetails={setInternshipData}
        />
        <CourseInfo
          courseDetails={internshipData}
          setCourseDetails={setInternshipData}
        />
        <QualityOverview
          courseDetails={internshipData}
          setCourseDetails={setInternshipData}
        />
        <PriceAndDiscount
          courseDetails={internshipData}
          setCourseDetails={setInternshipData}
        />
        <ThumbnailAndTeaser
          courseDetails={internshipData}
          setCourseDetails={setInternshipData}
          loading={loading}
          uploadedMedia={uploadedMedia}
        />
        <FaqLearningOutcomes
          courseDetails={internshipData}
          setCourseDetails={setInternshipData}
        />
        <PlacementAverageSalary
          courseDetails={internshipData}
          setCourseDetails={setInternshipData}
        />
        <CurriculumLiveClasses
          courseDetails={internshipData}
          setCourseDetails={setInternshipData}
          uploadedMedia={uploadedMedia}
          setSelectedMediaFromModal={setSelectedMediaFromModal}
        />
        <ReviewTestimonials
          courseDetails={internshipData}
          setCourseDetails={setInternshipData}
          uploadedMedia={uploadedMedia}
        />
        <button
          className="group relative mx-auto my-4 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-lg font-bold text-gray-900 transition-all duration-150 ease-in-out hover:from-teal-400 hover:to-lime-400 focus:outline-none focus:ring-4 focus:ring-lime-200 dark:text-white dark:focus:ring-lime-800"
          onClick={handleSubmit}
          disabled={submitLoader}
          title="Create New Internship"
        >
          <span
            className={`relative rounded-md bg-white px-9 py-2 transition-all duration-150 ease-in-out dark:bg-gray-900 ${
              submitLoader ? "opacity-70" : "group-hover:bg-opacity-0"
            }`}
          >
            {submitLoader ? "Submitting..." : "Submit"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default AddInternship;
