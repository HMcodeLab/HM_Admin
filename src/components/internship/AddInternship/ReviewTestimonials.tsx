"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PlusCircle, UploadCloud, Trash2 } from "lucide-react";
import { InternshipData } from "@/types";
import ImageCoursesModal from "@/utils/ImageCoursesModal";
import FeatureVideoCourseModal from "@/utils/FeatureVideoCourseModal";

interface ReviewTestimonialsProps {
  courseDetails: InternshipData;
  setCourseDetails: React.Dispatch<React.SetStateAction<InternshipData>>;
  uploadedMedia: any[];
}

const ReviewTestimonials: React.FC<ReviewTestimonialsProps> = ({
  courseDetails,
  setCourseDetails,
  uploadedMedia,
}) => {
  const [isModalImageOpen, setIsModalImageOpen] = useState(false);
  const [isModalVideoOpen, setIsModalVideoOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState("");
  const [selectedMediaFromModal, setSelectedMediaFromModal] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState<
    number | null
  >(null);
  const [currentReviewsIndex, setCurrentReviewsIndex] = useState<number | null>(
    null,
  );

  const openModal = useCallback(() => setIsModalVideoOpen(true), []);
  const closeModal = useCallback(() => setIsModalVideoOpen(false), []);
  const openImageModal = useCallback(() => setIsModalImageOpen(true), []);
  const closeImageModal = useCallback(() => setIsModalImageOpen(false), []);

  const handleReviewVideosChange = useCallback(
    (url: string) => {
      if (currentTestimonialIndex === null) return;
      setCourseDetails((prev) => {
        const updated = { ...prev };
        updated.testimonials[currentTestimonialIndex].reviewVideo = url;
        return updated;
      });
    },
    [currentTestimonialIndex, setCourseDetails],
  );

  const handleUserImageChange = useCallback(
    (url: string) => {
      if (currentReviewsIndex === null) return;
      setCourseDetails((prev) => {
        const updated = { ...prev };
        updated.reviews[currentReviewsIndex].userProfileImg = url;
        return updated;
      });
    },
    [currentReviewsIndex, setCourseDetails],
  );

  useEffect(() => {
    if (selectedMediaFromModal) {
      if (selectedMediaType === "reviewVideo") {
        handleReviewVideosChange(selectedMediaFromModal);
      } else if (selectedMediaType === "userProfileImg") {
        handleUserImageChange(selectedMediaFromModal);
      }
      setSelectedMediaFromModal("");
      setSelectedMediaType("");
      closeImageModal();
      closeModal();
    }
  }, [
    selectedMediaFromModal,
    selectedMediaType,
    handleReviewVideosChange,
    handleUserImageChange,
    closeImageModal,
    closeModal,
  ]);

  const addReviews = useCallback(() => {
    setCourseDetails((prev) => ({
      ...prev,
      reviews: [
        ...prev.reviews,
        { review: "", reating: 1, userName: "", userProfileImg: "" },
      ],
    }));
  }, [setCourseDetails]);

  const removeReviews = useCallback(
    (index: number) => {
      setCourseDetails((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((_, i) => i !== index),
      }));
    },
    [setCourseDetails],
  );

  const handleReviewsChange = useCallback(
    (
      index: number,
      field: string,
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setCourseDetails((prev) => {
        const updated = [...prev.reviews];
        updated[index][field] = e.target.value;
        return { ...prev, reviews: updated };
      });
    },
    [setCourseDetails],
  );

  const addTestimonials = useCallback(() => {
    setCourseDetails((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        { review: "", rating: 1, userName: "", reviewVideo: "" },
      ],
    }));
  }, [setCourseDetails]);

  const removeTestimonials = useCallback(
    (index: number) => {
      setCourseDetails((prev) => ({
        ...prev,
        testimonials: prev.testimonials.filter((_, i) => i !== index),
      }));
    },
    [setCourseDetails],
  );

  const handleTestimonialsChange = useCallback(
    (
      index: number,
      field: string,
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setCourseDetails((prev) => {
        const updated = [...prev.testimonials];
        updated[index][field] = e.target.value;
        return { ...prev, testimonials: updated };
      });
    },
    [setCourseDetails],
  );

  return (
    <div className="mt-8 px-4 dark:text-white">
      {isModalImageOpen && (
        <ImageCoursesModal
          isModalImageOpen={isModalImageOpen}
          setIsModalImageOpen={setIsModalImageOpen}
          courseDetails={courseDetails}
          setCourseDetails={setCourseDetails}
          type={selectedModal}
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
          type={selectedModal}
          uploadedMedia={uploadedMedia}
          setSelectedMediaFromModal={setSelectedMediaFromModal}
        />
      )}

      <h1 className="mb-6 text-3xl font-bold text-green-600 dark:text-green-300">
        Reviews & Testimonials
      </h1>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {/* Reviews */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Reviews</h2>
            <PlusCircle
              className="cursor-pointer text-green-600"
              onClick={addReviews}
            />
          </div>
          <div className="max-h-[400px] space-y-4 overflow-y-auto pr-2">
            {courseDetails?.reviews.map((review, index) => (
              <div
                key={index}
                className="relative rounded-lg border bg-gray-50 p-4 pt-10 dark:bg-gray-900"
              >
                <button
                  onClick={() => removeReviews(index)}
                  className="absolute right-2 top-2 p-2 text-red-500"
                >
                  <Trash2 size={18} />
                </button>
                <input
                  type="text"
                  placeholder="User Name"
                  value={review.userName}
                  onChange={(e) => handleReviewsChange(index, "userName", e)}
                  className="input-style w-[80%]"
                />
                <textarea
                  placeholder="Review"
                  value={review.review}
                  onChange={(e) => handleReviewsChange(index, "review", e)}
                  className="input-style"
                />
                <input
                  type="number"
                  placeholder="Rating"
                  min={1}
                  max={5}
                  value={review.reating}
                  onChange={(e) => handleReviewsChange(index, "reating", e)}
                  className="input-style"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="User Profile Image"
                    value={review.userProfileImg}
                    onChange={(e) =>
                      handleReviewsChange(index, "userProfileImg", e)
                    }
                    className="input-style"
                  />
                  <button
                    onClick={() => {
                      openImageModal();
                      setCurrentReviewsIndex(index);
                      setSelectedMediaType("userProfileImg");
                    }}
                    className="text-blue-600"
                  >
                    <UploadCloud />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Testimonials</h2>
            <PlusCircle
              className="cursor-pointer text-green-600"
              onClick={addTestimonials}
            />
          </div>
          <div className="max-h-[400px] space-y-4 overflow-y-auto pr-2">
            {courseDetails?.testimonials?.map((testimonial, index) => (
              <div
                key={index}
                className="relative rounded-lg border bg-gray-50 p-4 pt-10 dark:bg-gray-900"
              >
                <button
                  onClick={() => removeTestimonials(index)}
                  className="absolute right-2 top-2 text-red-500"
                >
                  <Trash2 size={18} />
                </button>
                <input
                  type="text"
                  placeholder="User Name"
                  value={testimonial.userName}
                  onChange={(e) =>
                    handleTestimonialsChange(index, "userName", e)
                  }
                  className="input-style"
                />
                <textarea
                  placeholder="Review"
                  value={testimonial.review}
                  onChange={(e) => handleTestimonialsChange(index, "review", e)}
                  className="input-style"
                />
                <input
                  type="number"
                  placeholder="Rating"
                  min={1}
                  max={5}
                  value={testimonial.rating}
                  onChange={(e) => handleTestimonialsChange(index, "rating", e)}
                  className="input-style"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="Testimonial Video"
                    value={testimonial.reviewVideo}
                    onChange={(e) =>
                      handleTestimonialsChange(index, "reviewVideo", e)
                    }
                    className="input-style"
                  />
                  <button
                    onClick={() => {
                      openModal();
                      setCurrentTestimonialIndex(index);
                      setSelectedMediaType("reviewVideo");
                    }}
                    className="text-blue-600"
                  >
                    <UploadCloud />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-style {
          width: 100%;
          padding: 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid #ccc;
          background-color: inherit;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default ReviewTestimonials;
