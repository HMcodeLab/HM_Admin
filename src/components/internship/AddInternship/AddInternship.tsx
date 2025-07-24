
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
// import other components as needed

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
  // add other instructor fields here
}

const AddInternship: React.FC = () => {
  // State to track loading status for media fetch
  const [loading, setLoading] = useState<boolean>(false);

  // State to hold uploaded media files fetched from API
  const [uploadedMedia, setUploadedMedia] = useState<any[]>([]);

  // State to track if form submit is in progress
  const [submitLoader, setSubmitLoader] = useState<boolean>(false);

  // State to store list of instructors fetched from API
  const [allInstructor, setAllInstructor] = useState<Instructor[]>([]);

  // State to store errors related to fetching instructors
  const [instructorError, setInstructorError] = useState<string | null>(null);
  const [selectedMediaFromModal, setSelectedMediaFromModal] =
    useState<string>("");


  // Initial empty/default internship data structure
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

  // State to hold the current internship form data
  const [internshipData, setInternshipData] =
    useState<InternshipData>(initialData);

  // Get adminToken from localStorage (only if window is defined)
  // Using useMemo so token is read only once on component mount
  const adminToken = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminToken") ?? "";
    }
    return "";
  }, []);

  // Decode the adminToken safely using useMemo for stability
  const validToken = useMemo(() => {
    try {
      if (adminToken) {
        return jwtDecode(adminToken);
      }
      return null;
    } catch (e) {
      return null;
    }
  }, [adminToken]);

  // Clear certain localStorage items if token is invalid
  useEffect(() => {
    if (!validToken) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("COURSES_USER_TOKEN");
        localStorage.removeItem("adminEmail");
      }
    }
  }, [validToken]);

  // Fetch internship media files from API
  const internshipMedia = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getcoursemedia/internship-media`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (response.status === 200) {
        setUploadedMedia(response.data.mediaFiles);
      } else {
        console.error("Error fetching internship media");
      }
    } catch (error: any) {
      console.error("Error fetching internship media: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch list of instructors from API
  const fetchDataInstructor = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/instructors`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (response?.data?.success && Array.isArray(response.data.data)) {
        setAllInstructor(response.data.data);
        setInstructorError(null); // Clear error on success
      } else {
        if (allInstructor.length === 0) {
          setInstructorError("Unable to fetch instructors.");
        }
      }
    } catch (error: any) {
      if (allInstructor.length === 0) {
        setInstructorError("Error fetching instructors: " + error.message);
      }
    }
  };

  // Run these two API calls once after component mounts and token is valid
  useEffect(() => {
    if (validToken) {
      internshipMedia();
      fetchDataInstructor();
    }
    // validToken is memoized, so this runs only once unless token changes
  }, [validToken]);

  // Handle form submit for adding new internship
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
        setInternshipData(initialData); // Reset form data
      } else {
        toast.error("Error in creating new internship course");
      }
    } catch (error: any) {
      toast.error("Error in creating new internship course: " + error.message);
    } finally {
      setSubmitLoader(false);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 mx-[5%] my-6 flex flex-col gap-4 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900">
      <div className="mx-[5%] my-6 flex flex-col gap-4">
        {/* Toast notifications container */}
        <Toaster position="top-center" />
        {/* Instructor selection component */}
        <InstructorDetail
          InstructorDetails={allInstructor}
          courseDetails={internshipData}
          setCourseDetails={setInternshipData}
        />
        {/* Basic course info component */}
        <CourseInfo
          courseDetails={internshipData}
          setCourseDetails={setInternshipData}
        />
        {/* Quality overview component */}
        <QualityOverview
          courseDetails={internshipData}
          setCourseDetails={setInternshipData}
        />
        {/* Price and discount details component */}
        <PriceAndDiscount
          courseDetails={internshipData}
          setCourseDetails={setInternshipData}
        />
        {/* Thumbnail and teaser media component */}
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
        {/* Submit button to create internship */}
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
