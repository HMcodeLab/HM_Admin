"use client";

import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import { CourseType } from "@/types"; // Assumed types are defined here

interface FaqLearningOutcomesProps {
  courseDetails: CourseType;
  setCourseDetails: React.Dispatch<React.SetStateAction<CourseType>>;
}

const FaqLearningOutcomes: React.FC<FaqLearningOutcomesProps> = ({
  courseDetails,
  setCourseDetails,
}) => {
  const addWhatWillILearn = () => {
    setCourseDetails({
      ...courseDetails,
      whatWillILearn: [...(courseDetails.whatWillILearn || []), ""],
    });
  };

  const removeWhatWillILearn = (indexToRemove: number) => {
    const updatedWhatWillILearn = courseDetails.whatWillILearn.filter(
      (_, index) => index !== indexToRemove,
    );
    setCourseDetails({
      ...courseDetails,
      whatWillILearn: updatedWhatWillILearn,
    });
  };

  const handleWhatWillILearnChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const updatedWhatWillILearn = [...courseDetails.whatWillILearn];
    updatedWhatWillILearn[index] = e.target.value;
    setCourseDetails({
      ...courseDetails,
      whatWillILearn: updatedWhatWillILearn,
    });
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
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6 lg:px-20">
      <h1 className="font-Montserrat text-3xl font-bold text-green-600 dark:text-green-400">
        FAQ & Learning Outcomes
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* FAQ Section */}
        <fieldset className="flex flex-col gap-4">
          <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-gray-100">
            Frequently Asked Questions
            <FaPlusCircle
              onClick={addFaq}
              className="cursor-pointer text-lg text-green-600 dark:text-green-400"
            />
          </h2>
          <div className="flex h-48 flex-col gap-4 overflow-y-auto pr-2">
            {courseDetails?.faqs?.map((faq, index) => (
              <div key={index} className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => handleFaqQuestionChange(index, e)}
                  className="rounded-md border border-gray-300 p-2 shadow-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <div className="flex items-start gap-3">
                  <textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => handleFaqAnswerChange(index, e)}
                    className="w-full rounded-md border border-gray-300 p-2 shadow-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    onClick={() => removeFaq(index)}
                    className="text-xl text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        {/* What Will I Learn Section */}
        <fieldset className="flex flex-col gap-4">
          <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-gray-100">
            What will I learn
            <FaPlusCircle
              onClick={addWhatWillILearn}
              className="cursor-pointer text-lg text-green-600 dark:text-green-400"
            />
          </h2>
          <div className="flex h-48 flex-col gap-3 overflow-y-auto pr-2">
            {courseDetails?.whatWillILearn?.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Learning outcome"
                  value={item}
                  onChange={(e) => handleWhatWillILearnChange(index, e)}
                  className="w-full rounded-md border border-gray-300 p-2 shadow-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                  onClick={() => removeWhatWillILearn(index)}
                  className="text-xl text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default FaqLearningOutcomes;
