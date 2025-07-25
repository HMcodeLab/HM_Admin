// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import InstructorDetail from "./InstructorDetail";

// // import CourseInfo from "./components/CourseInfo";
// // import QualityOverview from "./components/QualityOverview";
// // import PriceAndDiscount from "./components/PriceAndDiscount";
// // import ThumbnailAndTeaser from "./components/ThumbnailAndTeaser";
// // import CurriculumLiveClasses from "./components/CurriculumLiveClasses";
// // import FaqLearningOutcomes from "./components/FaqLearningOutcomes";
// // import PlacementAverageSalary from "./components/PlacementAverageSalary";
// // import ReviewTestimonials from "./components/ReviewTestimonials";
// // import AllAssessments from "./components/Assessments";

// interface CourseType {
//   instructor: string;
//   courseID: string;
//   bannerImg: string;
//   title: string;
//   category: string;
//   subcategory: string;
//   level: string;
//   base_price: string;
//   discount_percentage: string;
//   overview: string;
//   featured_image: string;
//   featured_video: string;
//   courseType: string;
//   credits: number;
//   duration: number;
//   courseStartDate: string;
//   faqs: any[];
//   curriculum: any[];
//   whatWillILearn: any[];
//   liveClasses: any[];
//   testimonials: any[];
//   reviews: any[];
//   companies: any[];
//   placementOpportunities: any[];
// }

// const AddCourse: React.FC = () => {
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

//   const [uploadedMedia, setUploadedMedia] = useState<any[]>([]);
//   const [allInstructor, setAllInstructor] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [submitLoader, setSubmitLoader] = useState(false);

//   const initialData: CourseType = {
//     instructor: "",
//     courseID: "",
//     bannerImg: "",
//     title: "",
//     category: "",
//     subcategory: "",
//     level: "",
//     base_price: "",
//     discount_percentage: "",
//     overview: "",
//     featured_image: "",
//     featured_video: "",
//     courseType: "",
//     credits: 0,
//     duration: 45,
//     courseStartDate: "",
//     faqs: [],
//     curriculum: [
//       {
//         chapter_name: "",
//         lessons: [
//           {
//             lesson_name: "",
//             video: "",
//             notes: "",
//             notesName: "",
//             assignment: "",
//             assignmentName: "",
//             transcript: "",
//             duration: "30",
//             isLiveClass: false,
//             liveClass: {
//               startDate: "",
//               endDate: "",
//               meetingLink: "",
//             },
//           },
//         ],
//         project: [
//           {
//             title: "",
//             projectInfoPdf: "",
//             duration: 0,
//           },
//         ],
//       },
//     ],
//     whatWillILearn: [],
//     liveClasses: [],
//     testimonials: [],
//     reviews: [],
//     companies: [],
//     placementOpportunities: [],
//   };

//   const [courseDetails, setCourseDetails] = useState<CourseType>(initialData);

//   useEffect(() => {
//     fetchData();
//     fetchDataInstructor();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getfilesfromaws`,
//       );
//       if (response.data.success) {
//         setUploadedMedia(response.data.data);
//       } else {
//         toast.error("Error fetching media");
//       }
//     } catch (error: any) {
//       toast.error("Error fetching media: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDataInstructor = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/instructors`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );
//       if (response.data.success) {
//         setAllInstructor(response.data.data);
//       } else {
//         toast.error("Error fetching instructor");
//       }
//     } catch (error: any) {
//       toast.error("Error fetching instructor: " + error.message);
//     }
//   };

//   const isCoursedChanged = () => {
//     return JSON.stringify(courseDetails) !== JSON.stringify(initialData);
//   };

//   const handleSubmit = async () => {
//     setSubmitLoader(true);
//     if (!isCoursedChanged()) {
//       toast.error("No changes in this course");
//       setSubmitLoader(false);
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/addcourse`,
//         courseDetails,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );
//       if (res.data.success) {
//         toast.success("Course Uploaded Successfully");
//         setCourseDetails(initialData);
//       } else {
//         toast.error("Failed to upload Course");
//       }
//     } catch (error: any) {
//       toast.error("Failed to upload Course: " + error.message);
//     } finally {
//       setSubmitLoader(false);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-6  px-4 py-6 text-black transition-all duration-500 md:px-10">
//       <Toaster position="top-center" />
//       <InstructorDetail
//         {...{
//           InstructorDetails: allInstructor,
//           courseDetails,
//           setCourseDetails,
//         }}
//       />
//       {/* <CourseInfo {...{ courseDetails, setCourseDetails }} />
//       <QualityOverview {...{ courseDetails, setCourseDetails }} />
//       <PriceAndDiscount {...{ courseDetails, setCourseDetails }} />
//       <ThumbnailAndTeaser
//         {...{ courseDetails, setCourseDetails, uploadedMedia, loading }}
//       /> */}

//       {/* <div className="mx-auto w-full max-w-7xl">
//         <CurriculumLiveClasses
//           {...{
//             courseDetails,
//             setCourseDetails,
//             uploadedMedia,
//             setUploadedMedia,
//             needToUpdate: false,
//           }}
//         />
//       </div> */}

//       {/* <AllAssessments
//         {...{ courseDetails, fetchCourseDetails: fetchDataInstructor }}
//       />
//       <FaqLearningOutcomes {...{ courseDetails, setCourseDetails }} />
//       <ReviewTestimonials
//         {...{ courseDetails, setCourseDetails, uploadedMedia }}
//       />
//       <PlacementAverageSalary {...{ courseDetails, setCourseDetails }} /> */}

//       <button
//         className="mx-auto mt-6 rounded-xl bg-gradient-to-r from-green-400 via-yellow-400 to-pink-500 px-8 py-3 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105"
//         onClick={handleSubmit}
//       >
//         {submitLoader ? "Submitting..." : "Submit Course"}
//       </button>
//     </div>
//   );
// };

// export default AddCourse;
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import InstructorDetail from "./InstructorDetail";
import CourseInfo from "./CourseInfo";
import QualityOverview from "./QualityOverview";
import PriceAndDiscount from "./PriceAndDiscount";
import ThumbnailAndTeaser from "./ThumbnailAndTeaser";
import CurriculumLiveClasses from "./CurriculumLiveClasses";
import AllAssessments from "./AllAssessments";
import FaqLearningOutcomes from "./FaqLearningOutcomes";
import ReviewTestimonials from "./ReviewTestimonials";
import PlacementAverageSalary from "./PlacementAverageSalary";

import { CourseType } from "@/types";

const AddCourse: React.FC = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const [uploadedMedia, setUploadedMedia] = useState<any[]>([]);
  const [allInstructor, setAllInstructor] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);

  const initialData: CourseType = {
    instructor: "",
    courseID: "",
    bannerImg: "",
    title: "",
    category: "",
    subcategory: "",
    level: "",
    base_price: "",
    discount_percentage: "",
    discounted_price: 0,
    overview: "",
    featured_image: "",
    featured_video: "",
    thumbnailImg: "",
    teaserLink: "",
    certificate: "",
    courseType: "",
    credits: 0,
    duration: 45,
    courseStartDate: "",
    faqs: [],
    learning_outcome: "",
    skill: [],
    tools: [],
    language: "",
    mode: "",
    live_session: false,
    status: "",
    curriculum: [
      {
        chapter_name: "",
        lessons: [
          {
            lesson_name: "",
            video: "",
            notes: "",
            notesName: "",
            assignment: "",
            assignmentName: "",
            transcript: "",
            duration: "30",
            isLiveClass: false,
            liveClass: {
              startDate: "",
              endDate: "",
              meetingLink: "",
            },
          },
        ],
        project: [
          {
            title: "",
            projectInfoPdf: "",
            duration: 0,
            startDate: "",
            endDate: "",
          },
        ],
      },
    ],
    whatWillILearn: [],
    liveClasses: [],
    testimonials: [],
    reviews: [],
    companies: [],
    placementOpportunities: [],
    assessments: [],
  };

  const [courseDetails, setCourseDetails] = useState<CourseType>(initialData);

  useEffect(() => {
    fetchData();
    fetchDataInstructor();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getfilesfromaws`,
      );
      if (response.data.success) {
        setUploadedMedia(response.data.data);
      } else {
        toast.error("Error fetching media");
      }
    } catch (error: any) {
      toast.error("Error fetching media: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataInstructor = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/instructors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        setAllInstructor(response.data.data);
      } else {
        toast.error("Error fetching instructor");
      }
    } catch (error: any) {
      toast.error("Error fetching instructor: " + error.message);
    }
  };

  const isCoursedChanged = () => {
    return JSON.stringify(courseDetails) !== JSON.stringify(initialData);
  };

  const handleSubmit = async () => {
    setSubmitLoader(true);
    if (!isCoursedChanged()) {
      toast.error("No changes in this course");
      setSubmitLoader(false);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/addcourse`,
        courseDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.success) {
        toast.success("Course Uploaded Successfully");
        setCourseDetails(initialData);
      } else {
        toast.error("Failed to upload Course");
      }
    } catch (error: any) {
      toast.error("Failed to upload Course: " + error.message);
    } finally {
      setSubmitLoader(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 text-black transition-all duration-500 dark:text-white md:px-10">
      <Toaster position="top-center" />

      <div className="rounded-2xl border border-gray-300 p-5 shadow-md dark:border-gray-700">
        <InstructorDetail
          InstructorDetails={allInstructor}
          courseDetails={courseDetails}
          setCourseDetails={setCourseDetails}
        />
      </div>

      <div className="rounded-2xl border border-gray-300 p-5 shadow-md dark:border-gray-700">
        <CourseInfo
          courseDetails={courseDetails}
          setCourseDetails={setCourseDetails}
        />
      </div>

      <div className="rounded-2xl border border-gray-300 p-5 shadow-md dark:border-gray-700">
        <QualityOverview
          courseDetails={courseDetails}
          setCourseDetails={setCourseDetails}
        />
      </div>

      <div className="rounded-2xl border border-gray-300 p-5 shadow-md dark:border-gray-700">
        <PriceAndDiscount
          courseDetails={courseDetails}
          setCourseDetails={setCourseDetails}
        />
      </div>

      <div className="rounded-2xl border border-gray-300 p-5 shadow-md dark:border-gray-700">
        <ThumbnailAndTeaser
          {...{ courseDetails, setCourseDetails, uploadedMedia, loading }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl rounded-2xl border border-gray-300 p-5 shadow-md dark:border-gray-700">
        <CurriculumLiveClasses
          {...{
            courseDetails,
            setCourseDetails,
            uploadedMedia,
            setUploadedMedia,
            needToUpdate: false,
          }}
        />
      </div>

      <div className="rounded-2xl border border-gray-300 p-5 shadow-md dark:border-gray-700">
        <AllAssessments
          courseDetails={{
            ...courseDetails,
            base_price: Number(courseDetails.base_price),
            discounted_price: Number(courseDetails.discounted_price),
          }}
          fetchCourseDetails={fetchDataInstructor}
        />
      </div>

      <div className="rounded-2xl border border-gray-300 p-5 shadow-md dark:border-gray-700">
        <FaqLearningOutcomes {...{ courseDetails, setCourseDetails }} />
      </div>

      <div className="rounded-2xl border border-gray-300 p-5 shadow-md dark:border-gray-700">
        <ReviewTestimonials
          {...{ courseDetails, setCourseDetails, uploadedMedia }}
        />
      </div>

      <div className="rounded-2xl border border-gray-300 p-5 shadow-md dark:border-gray-700">
        <PlacementAverageSalary {...{ courseDetails, setCourseDetails }} />
      </div>

      <button
        className="mx-auto mt-6 rounded-xl bg-gradient-to-r from-green-400 via-yellow-400 to-pink-500 px-8 py-3 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105"
        onClick={handleSubmit}
        disabled={submitLoader}
      >
        {submitLoader ? "Submitting..." : "Submit Course"}
      </button>
    </div>
  );
};

export default AddCourse;
