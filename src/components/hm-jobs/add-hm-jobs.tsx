"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

type WorkExperience = {
  isFresher: boolean;
  from: string | number;
  to: string | number;
};

type SalaryRange = {
  from: string;
  to: string;
};

type FormDataType = {
  position: string;
  employment_type: string;
  educational_qualification: string;
  company: string;
  role_category: string;
  work_mode: string;
  work_experience: WorkExperience;
  annual_salary_range: SalaryRange;
  company_industry: string;
  interview_mode: string;
  job_url: string;
  about_company: string;
  company_website_link: string;
  company_address: string;
  logoUrl: string;
  publishStatus: string;
  publishDate: string;
  lastDate: string;
  applicantsFile: File | null;
};

const initialFormData: FormDataType = {
  position: "",
  employment_type: "",
  educational_qualification: "",
  company: "",
  role_category: "",
  work_mode: "",
  work_experience: { isFresher: true, from: "", to: "" },
  annual_salary_range: { from: "", to: "" },
  company_industry: "",
  interview_mode: "",
  job_url: "",
  about_company: "",
  company_website_link: "",
  company_address: "",
  logoUrl: "",
  publishStatus: "",
  publishDate: "",
  lastDate: "",
  applicantsFile: null,
};

const AddHMJobs: React.FC = () => {
  const [jd, setJd] = useState<string>("");
  const [keySkill, setKeySkill] = useState<string>("");
  const [addedSkills, setAddedSkills] = useState<string[]>([]);
  const [jobLocation, setJobLocation] = useState<string>("");
  const [addedLocations, setAddedLocations] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormDataType>(initialFormData);

  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "applicantsFile" && files) {
      setFormData((prev) => ({ ...prev, applicantsFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = () => {
    if (keySkill.trim()) {
      setAddedSkills([...addedSkills, keySkill.trim()]);
      setKeySkill("");
    }
  };

  const handleAddLocation = () => {
    if (jobLocation.trim()) {
      setAddedLocations([...addedLocations, jobLocation.trim()]);
      setJobLocation("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setAddedSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveLocation = (index: number) => {
    setAddedLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSalary = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      annual_salary_range: { ...prev.annual_salary_range, [name]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!jd.trim()) {
      toast.error("Please provide a job description.");
      return;
    }

    if (
      !formData.work_experience.isFresher &&
      (!formData.work_experience.from || !formData.work_experience.to)
    ) {
      toast.error("Please provide work experience duration.");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append simple fields except nested & file
      for (const key in formData) {
        if (
          key === "applicantsFile" ||
          key === "work_experience" ||
          key === "annual_salary_range"
        ) {
          continue;
        }
        // @ts-ignore
        formDataToSend.append(key, formData[key] ?? "");
      }

      // Append nested objects as JSON strings
      formDataToSend.append(
        "work_experience",
        JSON.stringify(formData.work_experience),
      );
      formDataToSend.append(
        "annual_salary_range",
        JSON.stringify(formData.annual_salary_range),
      );

      // Append arrays without [] in key
      addedSkills.forEach((skill) =>
        formDataToSend.append("key_skills", skill),
      );

      addedLocations.forEach((loc) => formDataToSend.append("location", loc));

      // Append job description separately
      formDataToSend.append("job_description", jd);

      // Append file if exists
      if (formData.applicantsFile) {
        formDataToSend.append("applicantsFile", formData.applicantsFile);
      }

      // Debug: log all entries to console before sending
      for (const pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/createAInHousePlacement`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Job Posted Successfully");

      // Reset form
      setFormData(initialFormData);
      setJd("");
      setAddedSkills([]);
      setAddedLocations([]);
      setJobLocation("");
      setKeySkill("");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        toast.error(data?.message || "Failed to post job.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="bg-gray-100 px-4 py-6 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white">
          Post a Job Vacancy
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {/* Position */}
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Job Title *"
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          {/* Employment Type */}
          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="" disabled>
              Select Employment Type *
            </option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Freelance">Freelance</option>
          </select>

          {/* Company */}
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company Name *"
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          {/* Company Industry */}
          <input
            type="text"
            name="company_industry"
            value={formData.company_industry}
            onChange={handleChange}
            placeholder="Company Industry *"
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          {/* Job Location */}
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Location *
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddLocation}
                className="rounded bg-blue-600 px-4 py-2 text-white"
              >
                Add
              </button>
            </div>
            <ul className="mt-2 text-sm text-gray-800 dark:text-gray-200">
              {addedLocations.map((loc, i) => (
                <li key={i} className="flex justify-between">
                  {loc}{" "}
                  <button
                    onClick={() => handleRemoveLocation(i)}
                    type="button"
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Skills */}
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Key Skills *
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={keySkill}
                onChange={(e) => setKeySkill(e.target.value)}
                className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="rounded bg-green-600 px-4 py-2 text-white"
              >
                Add
              </button>
            </div>
            <ul className="mt-2 text-sm text-gray-800 dark:text-gray-200">
              {addedSkills.map((skill, i) => (
                <li key={i} className="flex justify-between">
                  {skill}{" "}
                  <button
                    onClick={() => handleRemoveSkill(i)}
                    type="button"
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Role Category */}
          <input
            type="text"
            name="role_category"
            value={formData.role_category}
            onChange={handleChange}
            placeholder="Role Category *"
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          {/* Salary Range */}
          <div className="flex gap-2">
            <input
              type="number"
              name="from"
              placeholder="Min Salary"
              value={formData.annual_salary_range.from}
              onChange={handleSalary}
              className="w-1/2 rounded border p-3 dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="number"
              name="to"
              placeholder="Max Salary"
              value={formData.annual_salary_range.to}
              onChange={handleSalary}
              className="w-1/2 rounded border p-3 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Job Description */}
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Job Description *"
            className="col-span-2 rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          {/* Company Website */}
          <input
            type="text"
            name="company_website_link"
            value={formData.company_website_link}
            onChange={handleChange}
            placeholder="Company Website *"
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          {/* About Company */}
          <textarea
            name="about_company"
            value={formData.about_company}
            onChange={handleChange}
            placeholder="About Company *"
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          {/* Educational Qualification */}
          <textarea
            name="educational_qualification"
            value={formData.educational_qualification}
            onChange={handleChange}
            placeholder="Educational Qualification *"
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          {/* Company Address */}
          <input
            type="text"
            name="company_address"
            value={formData.company_address}
            onChange={handleChange}
            placeholder="Company Address *"
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          {/* Work Experience */}
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Work Experience *
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="fresher"
                checked={formData.work_experience.isFresher}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    work_experience: {
                      isFresher: e.target.checked,
                      from: "",
                      to: "",
                    },
                  }))
                }
              />
              <label
                htmlFor="fresher"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Fresher
              </label>
            </div>
            {!formData.work_experience.isFresher && (
              <div className="mt-2 flex gap-2">
                <input
                  type="number"
                  name="from"
                  placeholder="From"
                  value={formData.work_experience.from}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      work_experience: {
                        ...prev.work_experience,
                        from: e.target.value,
                      },
                    }))
                  }
                  className="w-1/2 rounded border p-3 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  name="to"
                  placeholder="To"
                  value={formData.work_experience.to}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      work_experience: {
                        ...prev.work_experience,
                        to: e.target.value,
                      },
                    }))
                  }
                  className="w-1/2 rounded border p-3 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Publish Date */}
          <input
            type="date"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          {/* Publish Status */}
          <select
            name="publishStatus"
            value={formData.publishStatus}
            onChange={handleChange}
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="" disabled>
              Select Publish Status *
            </option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>

          {/* Job URL */}
          <input
            type="url"
            name="job_url"
            value={formData.job_url}
            onChange={handleChange}
            placeholder="Job URL *"
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          {/* Logo URL */}
          <input
            type="url"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
            placeholder="Logo URL *"
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          {/* Last Date */}
          <input
            type="date"
            name="lastDate"
            value={formData.lastDate}
            onChange={handleChange}
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          {/* Work Mode */}
          <select
            name="work_mode"
            value={formData.work_mode}
            onChange={handleChange}
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="" disabled>
              Select Work Mode *
            </option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
            <option value="Office">Office</option>
          </select>

          {/* Interview Mode */}
          <select
            name="interview_mode"
            value={formData.interview_mode}
            onChange={handleChange}
            className="rounded border p-3 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="" disabled>
              Select Interview Mode *
            </option>
            <option value="Online">Online</option>
            <option value="in person">In Person</option>
          </select>

          {/* Applicants File Upload */}
          <input
            type="file"
            name="applicantsFile"
            onChange={handleChange}
            className="col-span-2 rounded border p-3 dark:bg-gray-700 dark:text-white"
          />

          <div className="col-span-2 mt-6 flex justify-center">
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-8 py-3 text-white hover:bg-green-700"
            >
              Post Job
            </button>
          </div>
        </form>

        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </div>
    </div>
  );
};

export default AddHMJobs;
