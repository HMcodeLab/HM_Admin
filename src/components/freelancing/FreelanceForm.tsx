"use client";

import React from "react";
import toast, { Toaster } from "react-hot-toast";
import ImageUploader from "./ImageUploader";
import { FreelancePost } from "@/types";

type FieldValue = string | number;

interface DropDownProps {
  field: keyof FreelancePost;
  title: string;
  fieldArray: string[] | number[];
  onSelect?: (value: string) => void;
  freelancePost: FreelancePost;
  setFreelancePost: React.Dispatch<React.SetStateAction<FreelancePost>>;
}

const DropDown: React.FC<DropDownProps> = ({
  field,
  title,
  fieldArray,
  onSelect,
  freelancePost,
  setFreelancePost,
}) => {
  const value = freelancePost[field];
  const selectValue: FieldValue =
    typeof value === "string" || typeof value === "number" ? value : "";

  return (
    <select
      className="h-12 w-full border p-3"
      value={selectValue}
      onChange={(e) => {
        const selectedValue = e.target.value;
        if (onSelect) {
          onSelect(selectedValue);
        } else {
          setFreelancePost((prev) => ({
            ...prev,
            [field]: selectedValue,
          }));
        }
      }}
    >
      <option value="">{`--SELECT ${title}--`}</option>
      {fieldArray.map((item, index) => (
        <option value={item} key={index}>
          {item}
        </option>
      ))}
    </select>
  );
};

interface FreelanceFormProps {
  freelancePost: FreelancePost;
  setFreelancePost: React.Dispatch<React.SetStateAction<FreelancePost>>;
  handleSubmit: () => void;
  loading: boolean;
}

const FreelanceForm: React.FC<FreelanceFormProps> = ({
  freelancePost,
  setFreelancePost,
  handleSubmit,
  loading,
}) => {
  // Update field handler
  const handleInputChange = (field: keyof FreelancePost, value: any) => {
    setFreelancePost((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Options (same as your original)
  const workMode = ["Office", "Remote", "Hybrid"];
  const roles = [
    "Software Developer",
    "Data Scientist",
    "DevOps Engineer",
    "UI/UX Designer",
    "Cybersecurity Specialist",
    "Machine Learning Engineer",
    "Cloud Solutions Architect",
    "Mobile App Developer",
  ];
  const jobPosition: Record<string, string[]> = {
    "Software Developer": [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "MERN Stack Developer",
      "Java Developer",
      "Python Developer",
    ],
    "Data Scientist": [
      "Data Analyst",
      "Business Intelligence Analyst",
      "Machine Learning Specialist",
    ],
    "DevOps Engineer": [
      "Cloud Engineer",
      "Infrastructure Engineer",
      "DevOps Engineer",
    ],
    "UI/UX Designer": ["Interaction Designer", "Product Designer"],
    "Cybersecurity Specialist": [
      "Information Security Specialist",
      "Penetration Tester",
      "Security Engineer",
    ],
    "Machine Learning Engineer": [
      "AI Research Scientist",
      "Deep Learning Specialist",
    ],
    "Cloud Solutions Architect": [
      "Cloud Engineer",
      "Cloud Consultant",
      "Cloud Infrastructure Engineer",
    ],
    "Mobile App Developer": [
      "Android Developer",
      "iOS Developer",
      "Flutter Developer",
      "Cross-Platform Mobile Developer",
    ],
  };
  const interviewMode = ["In-person", "Online"];

  const highestEducation = [
    "Bachelor's Degree in Computer Science",
    "Master's Degree in Data Science",
    "Bachelor's Degree in Electrical Engineering",
    "Master's Degree in Mechanical Engineering",
    "Bachelor's Degree in Information Technology",
    "Master's Degree in Business Administration",
    "Bachelor's Degree in Civil Engineering",
    "Master's Degree in Cybersecurity",
    "Bachelor's Degree in Marketing",
    "Doctorate in Artificial Intelligence",
    "Bachelor's Degree in Psychology",
    "Master's Degree in Finance",
    "Bachelor's Degree in Economics",
    "Master's Degree in Supply Chain Management",
    "Bachelor's Degree in Graphic Design",
    "Master's Degree in Human Resource Management",
    "Bachelor's Degree in Environmental Science",
    "Master's Degree in Chemical Engineering",
    "Bachelor's Degree in Mathematics",
    "Master's Degree in Physics",
    "Doctorate in Computer Science",
    "Bachelor's Degree in Political Science",
    "Master's Degree in International Relations",
    "Bachelor's Degree in Architecture",
    "Master's Degree in Urban Planning",
    "Bachelor's Degree in Journalism",
    "Master's Degree in Public Health",
    "Bachelor's Degree in Sociology",
    "Master's Degree in Education",
    "Bachelor's Degree in Software Engineering",
    "Doctorate in Physics",
    "Bachelor's Degree in Philosophy",
    "Master's Degree in Economics",
    "Bachelor's Degree in Nursing",
    "Master's Degree in Robotics",
    "Bachelor's Degree in Accounting",
    "Master of Computer Applications (MCA)",
    "Bachelor in Computer Applications (BCA)",
    "Bachelor's Degree in Computer Engineering",
    "Master's Degree in Digital Marketing",
    "Bachelor's Degree in Biotechnology",
    "Master's Degree in Information Systems",
    "Bachelor's Degree in Animation and Multimedia",
    "Master's Degree in Artificial Intelligence",
    "Bachelor's Degree in Hotel Management",
    "Master's Degree in Cloud Computing",
    "Bachelor's Degree in Social Work",
    "Master's Degree in Environmental Engineering",
    "Doctorate in Mechanical Engineering",
    "Bachelor's Degree in Fine Arts",
    "Master's Degree in Data Analytics",
    "Bachelor's Degree in Media Studies",
    "Master's Degree in Blockchain Technology",
  ];

  const budgetOptions: number[] = [];
  let budget = 180000;
  for (let i = 0; i < 1000; i++) {
    budgetOptions.push(budget);
    budget += 10000;
  }

  const companyIndustries = [
    "Information Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Manufacturing",
    "Telecommunications",
    "Real Estate",
    "Transportation",
    "Energy",
    "Hospitality",
    "Entertainment",
    "Construction",
    "Insurance",
    "Pharmaceuticals",
  ];

  const employeeTypes = [
    "Full time",
    "Freelancer",
    "Part time",
    "Intern",
    "Contract",
    "Temporary",
    "Consultant",
  ];

  const minYearExperience = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const addSkill = (skill: string) => {
    if (skill.trim() !== "") {
      setFreelancePost((prev) => ({
        ...prev,
        key_skills: [...prev.key_skills, skill.trim()],
      }));
    }
  };

  const removeSkill = (index: number) => {
    setFreelancePost((prev) => ({
      ...prev,
      key_skills: prev.key_skills.filter((_, i) => i !== index),
    }));
  };

  const addEducationQualification = (qualification: string) => {
    if (
      qualification.trim() !== "" &&
      !freelancePost.educational_qualification.includes(qualification.trim())
    ) {
      setFreelancePost((prev) => ({
        ...prev,
        educational_qualification: [
          ...prev.educational_qualification,
          qualification.trim(),
        ],
      }));
    }
  };

  const removeEducationQualification = (index: number) => {
    setFreelancePost((prev) => ({
      ...prev,
      educational_qualification: prev.educational_qualification.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center ">
      <Toaster position="top-center" />
      <div className="w-full max-w-4xl space-y-8 rounded-lg ">
        <h1 className="mb-4 text-center text-3xl font-extrabold text-gray-900 underline decoration-blue-600 dark:text-white">
          Freelance Project Submission
        </h1>

        <div className="space-y-6">
          {/* SECTION: Job & Role Info */}
          <div className="rounded-lg ">
            <h2 className="mb-3 text-2xl font-semibold text-green-500 dark:text-white">
              Job & Role Information
            </h2>
            <div className="grid gap-4">
              {/* Role Category */}
              <div>
                <label className="text-lg font-medium">Role Category</label>
                <DropDown
                  field="role_category"
                  title="Role Category"
                  fieldArray={roles}
                  freelancePost={freelancePost}
                  setFreelancePost={setFreelancePost}
                />
              </div>

              {/* Project Title (Position) */}
              <div>
                <label className="text-lg font-medium">
                  Project Title (Position)
                </label>
                <select
                  className="h-12 w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                  value={freelancePost.position || ""}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                  disabled={!freelancePost.role_category}
                >
                  <option value="" disabled>
                    Select Position
                  </option>
                  {(jobPosition[freelancePost.role_category] || []).map(
                    (position, index) => (
                      <option value={position} key={index}>
                        {position}
                      </option>
                    ),
                  )}
                </select>
                {/* Work Mode */}
                <div>
                  <label className="text-lg font-medium">Work Mode</label>
                  <DropDown
                    field="work_mode"
                    title="Work Mode"
                    fieldArray={workMode}
                    freelancePost={freelancePost}
                    setFreelancePost={setFreelancePost}
                  />
                </div>
                {/* Interview Mode */}
                <div>
                  <label className="text-lg font-medium">Interview Mode</label>
                  <DropDown
                    field="interview_mode"
                    title="Interview Mode"
                    fieldArray={interviewMode}
                    freelancePost={freelancePost}
                    setFreelancePost={setFreelancePost}
                  />
                </div>
                {/* // Inside your FreelanceForm component's JSX: */}
                <div className="flex items-center gap-4">
                  <label className="text-lg font-medium">
                    Publish Immediately
                  </label>
                  <input
                    type="checkbox"
                    checked={freelancePost.publishStatus === "Published"} // Assuming "Published" is the string for true
                    onChange={(e) =>
                      handleInputChange(
                        "publishStatus",
                        e.target.checked ? "Published" : "Draft", // Adjust strings as per your backend
                      )
                    }
                    className="h-5 w-5"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-lg font-medium">Location</label>
                <input
                  type="text"
                  placeholder="Location"
                  className="h-12 w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                  value={freelancePost.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* SECTION: Company Details */}
          <div className="rounded-lg  ">
            <h2 className="mb-3 text-2xl font-semibold">
              Company Details
            </h2>
            <div className="grid gap-4">
              <div>
                <label className="text-lg font-medium">Company Name</label>
                <input
                  type="text"
                  className="h-12 w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                  value={freelancePost.company || ""}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="text-lg font-medium">Company Details</label>
                <input
                  type="text"
                  className="h-12 w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                  value={freelancePost.about_company || ""}
                  onChange={(e) =>
                    handleInputChange("about_company", e.target.value)
                  }
                  placeholder="Company Details"
                />
              </div>
              <div>
                <label className="text-lg font-medium">
                  Company Website Link
                </label>
                <input
                  type="text"
                  className="h-12 w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                  value={freelancePost.company_website_link || ""}
                  onChange={(e) =>
                    handleInputChange("company_website_link", e.target.value)
                  }
                  placeholder="Company Website Link"
                />
              </div>
              <div>
                <label className="text-lg font-medium">Company Address</label>
                <input
                  type="text"
                  className="h-12 w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                  value={freelancePost.company_address || ""}
                  onChange={(e) =>
                    handleInputChange("company_address", e.target.value)
                  }
                  placeholder="Company Address"
                />
              </div>
              <div>
                <label className="text-lg font-medium">Job Link</label>
                <input
                  type="text"
                  className="h-12 w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                  value={freelancePost.job_url || ""}
                  onChange={(e) => handleInputChange("job_url", e.target.value)}
                  placeholder="Job Link"
                />
              </div>

              <ImageUploader
                setFreelancePost={setFreelancePost}
                freelancePost={freelancePost}
              />
            </div>
          </div>

          {/* SECTION: Salary & Dates */}
          <div className="rounded-lg ">
            <h2 className="mb-3 text-2xl font-semibold ">
              Salary & Dates
            </h2>
            <div className="grid gap-4">
              {/* Salary Range */}
              <div className="flex flex-col gap-2">
                <label className="text-lg font-medium">
                  Annual Salary Range
                </label>
                <div className="flex gap-4">
                  {/* Min */}
                  <select
                    className="h-12 w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                    value={
                      freelancePost.annual_salary_range.from?.toString() || ""
                    }
                    onChange={(e) => {
                      const fromVal = e.target.value;
                      handleInputChange("annual_salary_range", {
                        from: fromVal,
                        to:
                          parseInt(fromVal) + 10000 >
                          parseInt(
                            freelancePost.annual_salary_range.to?.toString() ||
                              "0",
                          )
                            ? (parseInt(fromVal) + 10000).toString()
                            : freelancePost.annual_salary_range.to?.toString() ||
                              "",
                      });
                    }}
                  >
                    <option value="" disabled>
                      Select Min
                    </option>
                    {budgetOptions.map((b) => (
                      <option key={b} value={b.toString()}>
                        {b}
                      </option>
                    ))}
                  </select>

                  {/* Max */}
                  <select
                    className="h-12 w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                    value={
                      freelancePost.annual_salary_range.to?.toString() || ""
                    }
                    onChange={(e) => {
                      const toVal = e.target.value;
                      if (
                        !freelancePost.annual_salary_range.from ||
                        parseInt(toVal) >=
                          parseInt(
                            freelancePost.annual_salary_range.from?.toString() ||
                              "0",
                          )
                      ) {
                        handleInputChange("annual_salary_range", {
                          ...freelancePost.annual_salary_range,
                          to: toVal,
                        });
                      } else {
                        toast.error("Max salary must be ≥ Min salary");
                      }
                    }}
                  >
                    <option value="" disabled>
                      Select Max
                    </option>
                    {budgetOptions
                      .filter(
                        (b) =>
                          !freelancePost.annual_salary_range.from ||
                          b > Number(freelancePost.annual_salary_range.from),
                      )
                      .map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-lg font-medium">Published Date</label>
                  <input
                    type="datetime-local"
                    className="h-12 w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                    value={formatDate(freelancePost.publishDate)}
                    onChange={(e) =>
                      handleInputChange("publishDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="text-lg font-medium">Deadline</label>
                  <input
                    type="datetime-local"
                    className="h-12 w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                    value={formatDate(freelancePost.lastDate)}
                    onChange={(e) =>
                      handleInputChange("lastDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <label className="text-lg font-medium">Employment Type</label>
            <DropDown
              field="employment_type"
              title="Employment Type"
              fieldArray={employeeTypes}
              freelancePost={freelancePost}
              setFreelancePost={setFreelancePost}
            />
          </div>

          {/* Company Industry */}
          <div>
            <label className="text-lg font-medium">Company Industry</label>
            <DropDown
              field="company_industry"
              title="Company Industry"
              fieldArray={companyIndustries}
              freelancePost={freelancePost}
              setFreelancePost={setFreelancePost}
            />
          </div>

          {/* Educational Qualification */}
          <div>
            <label className="text-lg font-medium">
              Educational Qualification
            </label>
            <div className="mb-2 flex gap-2">
              <select
                className="h-10 rounded border p-2 dark:bg-gray-700 dark:text-white"
                onChange={(e) => {
                  addEducationQualification(e.target.value);
                  e.target.value = ""; // reset after add
                }}
                value=""
              >
                <option value="">-- Select or Add --</option>
                {highestEducation
                  .filter(
                    (qual) =>
                      !freelancePost.educational_qualification.includes(qual),
                  )
                  .map((qual, idx) => (
                    <option key={idx} value={qual}>
                      {qual}
                    </option>
                  ))}
              </select>
              {/* Optional: input for manual entry */}
              {/* You can add an input + button here for manual addition if needed */}
            </div>
            <div className="flex flex-wrap gap-2">
              {freelancePost.educational_qualification.map((qual, index) => (
                <span
                  key={index}
                  className="flex items-center rounded bg-blue-200 px-3 py-1 text-sm text-blue-800 dark:bg-blue-700 dark:text-blue-100"
                >
                  {qual}
                  <button
                    type="button"
                    onClick={() => removeEducationQualification(index)}
                    className="ml-2 rounded-full bg-blue-400 px-1 text-white hover:bg-blue-600"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="flex items-center gap-4">
            <label className="text-lg font-medium">Are you a fresher?</label>
            <input
              type="checkbox"
              checked={freelancePost.work_experience.isFresher}
              onChange={(e) =>
                setFreelancePost((prev) => ({
                  ...prev,
                  work_experience: {
                    ...prev.work_experience,
                    isFresher: e.target.checked,
                  },
                }))
              }
              className="h-5 w-5"
            />
          </div>

          {/* Experience From / To */}
          {!freelancePost.work_experience.isFresher && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-lg font-medium">
                  Experience From (years)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={freelancePost.work_experience.from?.toString() || ""}
                  onChange={(e) =>
                    setFreelancePost((prev) => ({
                      ...prev,
                      work_experience: {
                        ...prev.work_experience,
                        from: e.target.value,
                      },
                    }))
                  }
                  className="h-12 w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="text-lg font-medium">
                  Experience To (years)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={freelancePost.work_experience.to?.toString() || ""}
                  onChange={(e) =>
                    setFreelancePost((prev) => ({
                      ...prev,
                      work_experience: {
                        ...prev.work_experience,
                        to: e.target.value,
                      },
                    }))
                  }
                  className="h-12 w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Key Skills */}
          <div>
            <label className="text-lg font-medium">Key Skills</label>
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                placeholder="Add skill"
                id="skillInput"
                className="h-10 rounded border p-2 dark:bg-gray-700 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = (e.target as HTMLInputElement).value;
                    if (val.trim()) {
                      addSkill(val);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById(
                    "skillInput",
                  ) as HTMLInputElement;
                  if (input?.value.trim()) {
                    addSkill(input.value);
                    input.value = "";
                  }
                }}
                className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {freelancePost?.key_skills.map((skill, index) => (
                <span
                  key={index}
                  className="flex items-center rounded bg-green-200 px-3 py-1 text-sm text-green-800 dark:bg-green-700 dark:text-green-100"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-2 rounded-full bg-green-400 px-1 text-white hover:bg-green-600"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            {/* Job Description */}
            <div>
              <label className="text-lg font-medium">Job Description</label>
              <textarea
                className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                rows={5}
                placeholder="Enter detailed job description"
                value={freelancePost.job_description || ""}
                onChange={(e) =>
                  handleInputChange("job_description", e.target.value)
                }
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-4 z-50 flex justify-center rounded-xl bg-white p-4 shadow-inner dark:bg-gray-900">
            <button
              className="w-full max-w-sm rounded bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
              onClick={() => handleSubmit()}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelanceForm;
