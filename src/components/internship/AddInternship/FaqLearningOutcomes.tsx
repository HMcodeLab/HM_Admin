"use client";

import { InternshipData } from "@/types";
import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";

interface FaqLearningOutcomesProps {
  courseDetails: InternshipData;
  setCourseDetails: React.Dispatch<React.SetStateAction<InternshipData>>;
}
const FaqLearningOutcomes: React.FC<FaqLearningOutcomesProps> = ({
  courseDetails,
  setCourseDetails,
}) => {
  const addLearningOutcome = () => {
    setCourseDetails({
      ...courseDetails,
      learningOutcome: [...(courseDetails.learningOutcome || []), ""],
    });
  };

  const removeLearningOutcome = (indexToRemove: number) => {
    const updated = courseDetails.learningOutcome.filter(
      (_, idx) => idx !== indexToRemove,
    );
    setCourseDetails({ ...courseDetails, learningOutcome: updated });
  };

  const handleLearningOutcomeChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const updated = [...courseDetails.learningOutcome];
    updated[index] = e.target.value;
    setCourseDetails({ ...courseDetails, learningOutcome: updated });
  };

  const addFaq = () => {
    setCourseDetails({
      ...courseDetails,
      faqs: [...courseDetails.faqs, { question: "", answer: "" }],
    });
  };

  const handleFaqQuestionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newFaqs = [...courseDetails.faqs];
    newFaqs[index].question = e.target.value;
    setCourseDetails({ ...courseDetails, faqs: newFaqs });
  };

  const handleFaqAnswerChange = (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newFaqs = [...courseDetails.faqs];
    newFaqs[index].answer = e.target.value;
    setCourseDetails({ ...courseDetails, faqs: newFaqs });
  };

  const removeFaq = (index: number) => {
    const newFaqs = [...courseDetails.faqs];
    newFaqs.splice(index, 1);
    setCourseDetails({ ...courseDetails, faqs: newFaqs });
  };

  return (
    <section className="max-w-full p-0">
      <h1 className="font-Montserrat text-3xl font-semibold text-green-600 dark:text-green-300 py-4">
        FAQ & Learning Outcomes
      </h1>

      <div className="grid grid-cols-1 gap-6 rounded-lg bg-gray-50 p-6 shadow-lg dark:bg-gray-800 md:grid-cols-2">
        {/* FAQ Section */}
        <fieldset
          className="flex flex-col gap-4"
          aria-label="Frequently Asked Questions"
        >
          <legend className="flex select-none items-center gap-3 text-lg font-semibold text-gray-900 dark:text-gray-300">
            Frequently Asked Questions
            <FaPlusCircle
              onClick={addFaq}
              className="cursor-pointer text-gray-700 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Add FAQ"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") addFaq();
              }}
            />
          </legend>

          <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-900 flex max-h-56 flex-col gap-5 overflow-y-auto pr-2">
            {courseDetails?.faqs?.map((faq, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-md bg-white p-3 shadow-inner dark:bg-gray-900"
              >
                <input
                  type="text"
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => handleFaqQuestionChange(index, e)}
                  className="rounded-md bg-gray-100 p-2 text-gray-900 shadow-inner outline-none dark:bg-gray-800 dark:text-gray-200"
                  aria-label={`FAQ question ${index + 1}`}
                />
                <div className="flex items-start gap-3">
                  <textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => handleFaqAnswerChange(index, e)}
                    className="w-full resize-none rounded-md bg-gray-100 p-2 text-gray-900 shadow-inner outline-none dark:bg-gray-800 dark:text-gray-200"
                    rows={3}
                    aria-label={`FAQ answer ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    aria-label={`Remove FAQ ${index + 1}`}
                    className="text-red-600 transition hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                  >
                    <MdClose />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Learning Outcomes Section */}
        <fieldset
          className="flex flex-col gap-4"
          aria-label="Learning Outcomes"
        >
          <legend className="flex select-none items-center gap-3 text-lg font-semibold text-gray-900 dark:text-gray-300">
            What will I learn
            <FaPlusCircle
              onClick={addLearningOutcome}
              className="cursor-pointer text-gray-700 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Add learning outcome"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") addLearningOutcome();
              }}
            />
          </legend>

          <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-900 flex max-h-56 flex-col gap-3 overflow-y-auto pr-2">
            {courseDetails.learningOutcome?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-md bg-white p-2 shadow-inner dark:bg-gray-900"
              >
                <input
                  placeholder="What Will I Learn"
                  value={item}
                  onChange={(e) => handleLearningOutcomeChange(index, e)}
                  className="w-full rounded-md bg-gray-100 p-2 text-gray-900 shadow-inner outline-none dark:bg-gray-800 dark:text-gray-200"
                  aria-label={`Learning outcome ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeLearningOutcome(index)}
                  aria-label={`Remove learning outcome ${index + 1}`}
                  className="text-red-600 transition hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                >
                  <MdClose />
                </button>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </section>
  );
};

export default FaqLearningOutcomes;
