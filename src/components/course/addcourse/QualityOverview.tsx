"use client";

import React from "react";
import { FaAngleDown } from "react-icons/fa";
import { CourseType } from "@/types";

interface QualityOverviewProps {
  courseDetails: CourseType;
  setCourseDetails: React.Dispatch<React.SetStateAction<CourseType>>;
}

interface DropdownProps {
  label: string;
  name: keyof CourseType;
  options: (string | number)[];
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  name,
  options,
  value,
  onChange,
}) => (
  <div className="relative mx-4 w-full gap-1 lg:max-w-sm">
    <p className="font-Montserrat text-lg font-semibold text-gray-800 dark:text-gray-200">
      {label}
    </p>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-gray-300 bg-transparent p-3 text-gray-900 shadow-sm transition-colors duration-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-400 dark:border-gray-600 dark:text-gray-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
      >
        <option value="" className="text-gray-400">
          Select {label}
        </option>
        {options.map((option) => (
          <option key={option.toString()} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FaAngleDown className="pointer-events-none absolute right-0 top-0 mr-2 mt-4 text-gray-600 dark:text-gray-400" />
    </div>
  </div>
);

const QualityOverview: React.FC<QualityOverviewProps> = ({
  courseDetails,
  setCourseDetails,
}) => {
  const levelOptions = ["Beginner", "Intermediate", "Advance"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement
    >,
  ) => {
    const { name, value } = e.target;

    setCourseDetails((prev) => ({
      ...prev,
      [name]: name === "credits" ? Number(value) : value,
    }));
  };

  return (
    <fieldset className="mx-[5%] flex flex-col gap-8">
      <h1 className="font-Montserrat bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-4xl font-extrabold text-transparent dark:from-green-400 dark:to-emerald-300">
        Course Quality and Overview
      </h1>

      <div className="flex flex-col gap-8 rounded-lg border border-gray-200 bg-white bg-opacity-70 p-6 shadow-lg backdrop-blur-md dark:border-gray-700 dark:bg-gray-900 dark:bg-opacity-30">
        <div className="flex flex-wrap justify-between gap-6">
          <Dropdown
            label="Course"
            name="courseType"
            options={["public", "minorDegree", "internship"]}
            value={courseDetails.courseType}
            onChange={handleChange}
          />

          {courseDetails.courseType === "minorDegree" && (
            <Dropdown
              label="Credits"
              name="credits"
              options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              value={courseDetails.credits}
              onChange={handleChange}
            />
          )}

          <div className="relative mx-4 w-full lg:max-w-sm">
            <label
              htmlFor="level"
              className="font-Montserrat text-lg font-semibold text-gray-800 dark:text-gray-200"
            >
              Level
            </label>
            <div className="relative">
              <select
                id="level"
                name="level"
                value={courseDetails.level}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-transparent p-3 text-gray-900 shadow-sm transition-colors duration-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-400 dark:border-gray-600 dark:text-gray-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
              >
                <option value="" className="text-gray-400">
                  Select Level
                </option>
                {levelOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <FaAngleDown className="pointer-events-none absolute right-0 top-0 mr-2 mt-4 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="p-2">
          <label
            htmlFor="overview"
            className="font-Montserrat text-lg font-semibold text-gray-800 dark:text-gray-200"
          >
            Overview
          </label>
          <textarea
            id="overview"
            name="overview"
            placeholder="Course Overview"
            className="mt-2 w-full rounded-md border border-gray-300 bg-transparent p-4 text-gray-900 shadow-md transition-colors duration-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-400 dark:border-gray-600 dark:text-gray-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
            value={courseDetails.overview}
            onChange={handleChange}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default QualityOverview;
