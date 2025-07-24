"use client";

import { InternshipData } from "@/types";
import React, { ChangeEvent } from "react";
import { FaAngleDown } from "react-icons/fa";

interface QualityOverviewProps {
  courseDetails: InternshipData;
  setCourseDetails: React.Dispatch<React.SetStateAction<InternshipData>>;

}

const levelOptions = ["Beginner", "Intermediate", "Advanced"];
const creditOptions = Array.from({ length: 11 }, (_, i) => i); // [0,1,...,10]

const QualityOverview: React.FC<QualityOverviewProps> = ({
  courseDetails,
  setCourseDetails,
}) => {
  const handleInputChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCourseDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreditChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setCourseDetails((prev) => ({
      ...prev,
      credits: value,
    }));
  };

  return (
    <div>
      <fieldset className="flex flex-col gap-4">
        <h1 className="font-Montserrat text-3xl font-semibold text-green-600 dark:text-green-400">
          Course Quality and Overview
        </h1>

        <div className="flex flex-col gap-4 rounded-md bg-white px-4 py-4 shadow-md dark:bg-gray-800">
          <div className="flex flex-col items-center justify-between md:flex-row">
            {/* Credits Dropdown */}
            <div className="relative mx-4 w-full gap-1">
              <p className="font-Montserrat text-lg font-semibold text-gray-900 dark:text-gray-100">
                Credits
              </p>
              <div className="relative">
                <select
                  onChange={handleCreditChange}
                  value={courseDetails.credits}
                  name="credits"
                  className="w-full appearance-none rounded-md border border-gray-300 bg-white p-2.5 text-gray-700 shadow-md outline-none focus:border-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-indigo-400"
                >
                  <option value="">Select Credits</option>
                  {creditOptions.map((credit) => (
                    <option key={credit} value={credit}>
                      {credit}
                    </option>
                  ))}
                </select>
                <FaAngleDown className="pointer-events-none absolute right-0 top-0 mr-1 mt-3 text-gray-600 dark:text-gray-400" />
              </div>
            </div>

            {/* Level Dropdown */}
            <div className="relative mx-4 mt-2 w-full md:mt-0 lg:max-w-sm">
              <label
                htmlFor="level"
                className="font-Montserrat text-lg font-semibold text-gray-900 dark:text-gray-100"
              >
                Level
              </label>
              <div className="relative">
                <select
                  id="level"
                  name="level"
                  value={courseDetails.level}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-md border border-gray-300 bg-white p-2.5 text-gray-700 shadow-md outline-none focus:border-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-indigo-400"
                >
                  <option value="">Select Level</option>
                  {levelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <FaAngleDown className="pointer-events-none absolute right-0 top-0 mr-1 mt-3 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>

          {/* Overview Textarea */}
          <div className="p-2">
            <p className="font-Montserrat text-lg font-semibold text-gray-900 dark:text-gray-100">
              Overview
            </p>
            <textarea
              className="mt-2 w-full rounded-md border-2 border-gray-300 bg-white p-2 text-gray-900 shadow-md focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Course Overview"
              name="overview"
              value={courseDetails.overview}
              onChange={handleInputChange}
              rows={5}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default QualityOverview;
