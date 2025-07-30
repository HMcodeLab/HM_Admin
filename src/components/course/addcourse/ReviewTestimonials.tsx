"use client";

import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaFileUpload } from "react-icons/fa";
import ImageCoursesModal from "@/utils/ImageCoursesModal";
import FeatureVideoCourseModal from "@/utils/FeatureVideoCourseModal";
import { CourseType } from "@/types";

interface ReviewTestimonialsProps {
  courseDetails: CourseType;
  setCourseDetails: React.Dispatch<React.SetStateAction<CourseType>>;
  uploadedMedia: any[];
}

const ReviewTestimonials: React.FC<ReviewTestimonialsProps> = ({
  courseDetails,
  setCourseDetails,
  uploadedMedia,
}) => {
  const [isModalImageOpen, setIsModalImageOpen] = useState(false);
  const [isModalVideoOpen, setIsModalVideoOpen] = useState(false);
  const [selectedMediaFromModal, setSelectedMediaFromModal] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState<
    number | null
  >(null);
  const [currentReviewsIndex, setCurrentReviewsIndex] = useState<number | null>(
    null,
  );

  // useEffect(() => {
  //   if (selectedMediaFromModal) {
  //     if (selectedMediaType === "reviewVideo" && currentTestimonialIndex !== null) {
  //       const updated = [...courseDetails.testimonials];
  //       updated[currentTestimonialIndex].reviewVideo = selectedMediaFromModal;
  //       setCourseDetails({ ...courseDetails, testimonials: updated });
  //     } else if (selectedMediaType === "userProfileImg" && currentReviewsIndex !== null) {
  //       const updated = [...courseDetails.reviews];
  //       updated[currentReviewsIndex].userProfileImg = selectedMediaFromModal;
  //       setCourseDetails({ ...courseDetails, reviews: updated });
  //     }

  //     setSelectedMediaFromModal("");
  //     setSelectedMediaType("");
  //     setIsModalImageOpen(false);
  //     setIsModalVideoOpen(false);
  //   }
  // }, [selectedMediaFromModal]);

  useEffect(() => {
    if (selectedMediaFromModal) {
      if (
        selectedMediaType === "reviewVideo" &&
        currentTestimonialIndex !== null
      ) {
        const updated = [...courseDetails.testimonials];
        updated[currentTestimonialIndex].reviewVideo = selectedMediaFromModal;
        setCourseDetails({ ...courseDetails, testimonials: updated });
      } else if (
        selectedMediaType === "userProfileImg" &&
        currentReviewsIndex !== null
      ) {
        const updated = [...courseDetails.reviews];
        updated[currentReviewsIndex].userProfileImg = selectedMediaFromModal;
        setCourseDetails({ ...courseDetails, reviews: updated });
      }

      setSelectedMediaFromModal("");
      setSelectedMediaType("");
      setIsModalImageOpen(false);
      setIsModalVideoOpen(false);
    }
  }, [
    selectedMediaFromModal,
    selectedMediaType,
    currentTestimonialIndex,
    currentReviewsIndex,
    courseDetails,
    setCourseDetails,
  ]);

  const addReviews = () => {
    const newReview = {
      review: "",
      reating: 1,
      userName: "",
      userProfileImg: "",
    };
    setCourseDetails({
      ...courseDetails,
      reviews: [...courseDetails.reviews, newReview],
    });
  };

  const removeReviews = (index: number) => {
    const updated = courseDetails.reviews.filter((_, i) => i !== index);
    setCourseDetails({ ...courseDetails, reviews: updated });
  };

  const handleReviewsChange = (
    index: number,
    field: keyof (typeof courseDetails.reviews)[0],
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const updated = [...courseDetails.reviews];
    updated[index][field] = e.target.value;
    setCourseDetails({ ...courseDetails, reviews: updated });
  };

  const addTestimonials = () => {
    const newTestimonial = {
      review: "",
      rating: 1,
      userName: "",
      reviewVideo: "",
    };
    setCourseDetails({
      ...courseDetails,
      testimonials: [...courseDetails.testimonials, newTestimonial],
    });
  };

  const removeTestimonials = (index: number) => {
    const updated = courseDetails.testimonials.filter((_, i) => i !== index);
    setCourseDetails({ ...courseDetails, testimonials: updated });
  };

  const handleTestimonialsChange = (
    index: number,
    field: keyof (typeof courseDetails.testimonials)[0],
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const updated = [...courseDetails.testimonials];
    updated[index][field] = e.target.value;
    setCourseDetails({ ...courseDetails, testimonials: updated });
  };

  return (
    <>
      {isModalImageOpen && (
        <ImageCoursesModal
          isModalImageOpen={isModalImageOpen}
          setIsModalImageOpen={setIsModalImageOpen}
          courseDetails={courseDetails}
          setCourseDetails={setCourseDetails}
          type={selectedMediaType}
          uploadedMedia={uploadedMedia}
          setSelectedMediaFromModal={setSelectedMediaFromModal}
        />
      )}
      {isModalVideoOpen && (
        <FeatureVideoCourseModal
          isModalVideoOpen={isModalVideoOpen}
          setIsModalVideoOpen={setIsModalVideoOpen}
          courseDetails={courseDetails}
          setCourseDetails={setCourseDetails}
          type={selectedMediaType}
          uploadedMedia={uploadedMedia}
          setSelectedMediaFromModal={setSelectedMediaFromModal}
        />
      )}

      <div className="flex flex-col gap-6 px-4 py-6 md:px-6 lg:px-20">
        <h1 className="font-Montserrat text-3xl font-bold text-green-600 dark:text-green-400">
          Reviews & Testimonials
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Reviews Section */}
          <fieldset className="flex flex-col gap-4">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-gray-100">
              Reviews
              <FaPlusCircle
                onClick={addReviews}
                className="cursor-pointer text-lg text-green-600 dark:text-green-400"
              />
            </h2>
            <div className="flex h-56 flex-col gap-4 overflow-y-auto pr-2">
              {courseDetails.reviews.map((review, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="User Name"
                      value={review.userName}
                      onChange={(e) =>
                        handleReviewsChange(index, "userName", e)
                      }
                      className="w-full rounded-md border p-2 shadow-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      onClick={() => removeReviews(index)}
                      className="text-xl text-red-500"
                    >
                      ❌
                    </button>
                  </div>
                  <textarea
                    placeholder="Description"
                    value={review.review}
                    onChange={(e) => handleReviewsChange(index, "review", e)}
                    className="rounded-md border p-2 shadow-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Rating"
                    min={1}
                    max={5}
                    value={review.reating}
                    onChange={(e) => handleReviewsChange(index, "reating", e)}
                    className="rounded-md border p-2 shadow-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <div className="flex items-center">
                    <input
                      type="url"
                      placeholder="User Profile Image URL"
                      value={review.userProfileImg}
                      onChange={(e) =>
                        handleReviewsChange(index, "userProfileImg", e)
                      }
                      className="w-full rounded-md border p-2 shadow-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      className="ml-2 text-xl text-blue-600"
                      onClick={() => {
                        setIsModalImageOpen(true);
                        setCurrentReviewsIndex(index);
                        setSelectedMediaType("userProfileImg");
                      }}
                    >
                      <FaFileUpload />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Testimonials Section */}
          <fieldset className="flex flex-col gap-4">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-gray-100">
              Testimonials
              <FaPlusCircle
                onClick={addTestimonials}
                className="cursor-pointer text-lg text-green-600 dark:text-green-400"
              />
            </h2>
            <div className="flex h-56 flex-col gap-4 overflow-y-auto pr-2">
              {courseDetails.testimonials.map((testimonial, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="User Name"
                      value={testimonial.userName}
                      onChange={(e) =>
                        handleTestimonialsChange(index, "userName", e)
                      }
                      className="w-full rounded-md border p-2 shadow-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      onClick={() => removeTestimonials(index)}
                      className="text-xl text-red-500"
                    >
                      ❌
                    </button>
                  </div>
                  <textarea
                    placeholder="Description"
                    value={testimonial.review}
                    onChange={(e) =>
                      handleTestimonialsChange(index, "review", e)
                    }
                    className="rounded-md border p-2 shadow-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Rating"
                    min={1}
                    max={5}
                    value={testimonial.rating}
                    onChange={(e) =>
                      handleTestimonialsChange(index, "rating", e)
                    }
                    className="rounded-md border p-2 shadow-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <div className="flex items-center">
                    <input
                      type="url"
                      placeholder="Testimonial Video URL"
                      value={testimonial.reviewVideo}
                      onChange={(e) =>
                        handleTestimonialsChange(index, "reviewVideo", e)
                      }
                      className="w-full rounded-md border p-2 shadow-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      className="ml-2 text-xl text-blue-600"
                      onClick={() => {
                        setIsModalVideoOpen(true);
                        setCurrentTestimonialIndex(index);
                        setSelectedMediaType("reviewVideo");
                      }}
                    >
                      <FaFileUpload />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
};

export default ReviewTestimonials;
