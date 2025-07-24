import React, { ChangeEvent } from "react";
import InputBox from "@/utils/InputBox";
import { InternshipData } from "@/types";

interface CourseDetails {
  internshipId: string;
  title: string;
  category: string;
  subcategory: string;
  internshipPeriod: string;
  internshipCategory: string;
  internshipStartDate: string;
  duration: number;
}

interface CourseInfoProps {
  courseDetails: InternshipData;
  setCourseDetails: React.Dispatch<React.SetStateAction<InternshipData>>;
}


const CourseInfo: React.FC<CourseInfoProps> = ({
  courseDetails,
  setCourseDetails,
}) => {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCourseDetails((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  const Categories = [
    "Visual Arts",
    "Software Development",
    "Information Technology",
    "Technology",
    "Marketing",
  ];

  const CategoriesWithSub: Record<string, string[]> = {
    "Visual Arts": [
      "Digital Design",
      "Digital Product Design",
      "Graphic Illustration",
      "3D Animation",
    ],
    "Software Development": [
      "Web Development",
      "Mobile App Development",
      "Backend Development",
      "Game Development",
    ],
    Technology: [
      "Data Science & Machine Learning",
      "Blockchain Development",
      "Artificial Intelligence",
      "Cybersecurity",
    ],
    "Information Technology": [
      "Network Security",
      "Data Analysis and Machine Learning",
      "Cloud Computing",
      "Database Administration",
    ],
    Marketing: [
      "Online Marketing",
      "SEO",
      "Social Media Marketing",
      "Content Marketing",
    ],
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  };

  return (
    <fieldset className="w-full space-y-6">
      <h2 className="font-Montserrat mb-2 text-3xl font-bold text-green-700 dark:text-green-300">
        Internship Details
      </h2>

      <div className="grid gap-6 rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:grid-cols-1 md:grid-cols-2">
        <InputBox
          label="Internship ID"
          type="text"
          placeholder="Enter Internship ID"
          name="internshipId"
          value={courseDetails.internshipId}
          onChange={handleInputChange}
        />
        <InputBox
          label="Title"
          type="text"
          placeholder="Enter Internship Title"
          name="title"
          value={courseDetails.title}
          onChange={handleInputChange}
        />

        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700 dark:text-gray-200">
            Category
          </label>
          <select
            name="category"
            value={courseDetails.category}
            onChange={(e) =>
              setCourseDetails((prev) => ({
                ...prev,
                category: e.target.value,
                subcategory: "",
              }))
            }
            className="rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">-- SELECT CATEGORY --</option>
            {Categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {courseDetails.category && (
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700 dark:text-gray-200">
              Subcategory
            </label>
            <select
              name="subcategory"
              value={courseDetails.subcategory}
              onChange={handleInputChange}
              className="rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="">-- SELECT SUB CATEGORY --</option>
              {CategoriesWithSub[courseDetails.category]?.map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700 dark:text-gray-200">
            Internship Period
          </label>
          <select
            name="internshipPeriod"
            value={courseDetails.internshipPeriod}
            onChange={handleInputChange}
            className="rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">-- SELECT PERIOD --</option>
            <option value="6 Weeks">6 Weeks</option>
            <option value="6 Months">6 Months</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700 dark:text-gray-200">
            Internship Mode
          </label>
          <select
            name="internshipCategory"
            value={courseDetails.internshipCategory}
            onChange={handleInputChange}
            className="rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">-- SELECT MODE --</option>
            <option value="liveInternship">Live Internship</option>
            <option value="internship">Internship</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <InputBox
          id="datepicker-range-start"
          label="Internship Start Date"
          name="internshipStartDate"
          type="datetime-local"
          placeholder="Select Start Date"
          value={formatDate(courseDetails.internshipStartDate)}
          onChange={handleInputChange}
        />

        <InputBox
          label="Duration (in days)"
          name="duration"
          type="number"
          placeholder="Enter Duration"
          value={courseDetails.duration}
          onChange={handleInputChange}
        />
      </div>
    </fieldset>
  );
};

export default CourseInfo;
