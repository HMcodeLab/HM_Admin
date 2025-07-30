"use client";

import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa6";

interface Job {
  position: string;
  employment_type: string;
  educational_qualification: string;
  company: string;
  role_category: string;
  work_mode: string;
  work_experience: { isFresher: boolean; from: string; to: string };
  annual_salary_range: { from: string; to: string };
  company_industry: string;
  interview_mode: string;
  job_url: string;
  about_company: string;
  job_description: string;
  company_website_link: string;
  company_address: string;
  logoUrl: string;
  publishStatus: string;
  publishDate: string;
  lastDate: string;
  key_skills: string[];
}

const Page: React.FC = () => {
  const { slug } = useParams();
  const router = useRouter();

  // Get token from localStorage safely
  const adminToken =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") || ""
      : "";

  const emptyJob = useMemo<Job>(
    () => ({
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
      job_description: "",
      company_website_link: "",
      company_address: "",
      logoUrl: "",
      publishStatus: "",
      publishDate: "",
      lastDate: "",
      key_skills: [],
    }),
    [],
  ); 

  const [job, setJob] = useState<Job>(emptyJob);

  // const emptyJob: Job = {
  //   position: "",
  //   employment_type: "",
  //   educational_qualification: "",
  //   company: "",
  //   role_category: "",
  //   work_mode: "",
  //   work_experience: { isFresher: true, from: "", to: "" },
  //   annual_salary_range: { from: "", to: "" },
  //   company_industry: "",
  //   interview_mode: "",
  //   job_url: "",
  //   about_company: "",
  //   job_description: "",
  //   company_website_link: "",
  //   company_address: "",
  //   logoUrl: "",
  //   publishStatus: "",
  //   publishDate: "",
  //   lastDate: "",
  //   key_skills: [],
  // };



  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [newSkill, setNewSkill] = useState<string>("");

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getInHousePlacement?jobid=${slug}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${adminToken}`,
  //         },
  //       },
  //     );

  //     if (response?.data?.InHousePlacement) {
  //       setJob(response.data.InHousePlacement);
  //     } else {
  //       setJob(null);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to fetch job details.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

   useEffect(() => {
     if (!adminToken || !slug) return;

     const fetchData = async () => {
       setLoading(true);
       try {
         const response = await axios.get(
           `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getInHousePlacement?jobid=${slug}`,
           {
             headers: { Authorization: `Bearer ${adminToken}` },
           },
         );
         if (response?.data?.InHousePlacement) {
           setJob(response.data.InHousePlacement);
         } else {
           setJob(emptyJob); // reset to emptyJob safely
         }
       } catch (error) {
         console.error(error);
         toast.error("Failed to fetch job details.");
       } finally {
         setLoading(false);
       }
     };

     fetchData();
   }, [adminToken, slug, emptyJob]);

  // useEffect(() => {
  //   if (adminToken && slug) {
  //     fetchData();
  //   }
  // }, [adminToken, slug]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setJob((prev) => ({
        ...prev,
        key_skills: [...prev.key_skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setJob((prev) => ({
      ...prev,
      key_skills: prev.key_skills.filter((_, i) => i !== index),
    }));
  };

  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Job,
    nestedField: string,
  ) => {
    setJob((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as any),
        [nestedField]: e.target.value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/updateInHousePlacement`,
        job,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );
      toast.success("Job updated successfully!");
      router.push("/hm-jobs/view");
    } catch (err) {
      setError("Failed to update job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl rounded-lg bg-white p-6 shadow-lg transition-colors duration-300 dark:bg-gray-900">
      <Toaster />
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-2 text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Grid layout for inputs */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* Position */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Position
            </label>
            <input
              name="position"
              value={job.position}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="Job Position"
              required
            />
          </div>

          {/* Employment Type */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Employment Type
            </label>
            <input
              name="employment_type"
              value={job.employment_type}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="Full-time, Part-time, etc."
              required
            />
          </div>

          {/* Role Category */}
          {/* Role Category */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Role Category
            </label>
            <input
              name="role_category"
              value={job.role_category}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="Category of Role"
            />
          </div>

          {/* Work Mode */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Work Mode
            </label>
            <select
              name="work_mode"
              value={job.work_mode}
              onChange={handleChange}
              className="w-full cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              required
            >
              <option value="">Select work mode</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Office">Office</option>
            </select>
          </div>
        </section>

        {/* Experience and Salary */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* Experience */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Experience (Years)
            </label>
            <div className="flex gap-4">
              <input
                name="from"
                placeholder="From"
                value={job.work_experience?.from || ""}
                onChange={(e) =>
                  handleNestedChange(e, "work_experience", "from")
                }
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                type="number"
                min={0}
              />
              <input
                name="to"
                placeholder="To"
                value={job.work_experience?.to || ""}
                onChange={(e) => handleNestedChange(e, "work_experience", "to")}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                type="number"
                min={0}
              />
            </div>
          </div>

          {/* Salary */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Salary Range (Annual)
            </label>
            <div className="flex gap-4">
              <input
                name="from"
                placeholder="From"
                value={job.annual_salary_range?.from || ""}
                onChange={(e) =>
                  handleNestedChange(e, "annual_salary_range", "from")
                }
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                type="number"
                min={0}
              />
              <input
                name="to"
                placeholder="To"
                value={job.annual_salary_range?.to || ""}
                onChange={(e) =>
                  handleNestedChange(e, "annual_salary_range", "to")
                }
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                type="number"
                min={0}
              />
            </div>
          </div>
        </section>

        {/* Key Skills */}
        <section className="w-full">
          <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
            Key Skills
          </label>
          <div className="flex gap-3">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-grow rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="Add a skill"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="flex items-center justify-center rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Add Skill"
            >
              <FaPlus />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            {job.key_skills.map((skill, i) => (
              <span
                key={i}
                className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700 shadow-sm transition hover:bg-green-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(i)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  aria-label={`Remove skill ${skill}`}
                >
                  <FaTrash />
                </button>
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {/* Company */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Company
            </label>
            <input
              name="company"
              value={job.company}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="Company Name"
            />
          </div>

          {/* Industry */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Industry
            </label>
            <input
              name="company_industry"
              value={job.company_industry}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="Industry Type"
            />
          </div>

          {/* Website */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Website
            </label>
            <input
              name="company_website_link"
              value={job.company_website_link}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="https://example.com"
            />
          </div>

          {/* Logo URL */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Logo URL
            </label>
            <input
              name="logoUrl"
              value={job.logoUrl}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="Image URL"
            />
          </div>

          {/* Company Address */}
          <div className="flex w-full flex-col md:col-span-2">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Company Address
            </label>
            <input
              name="company_address"
              value={job.company_address}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="Full address"
            />
          </div>

          {/* About Company */}
          <div className="flex w-full flex-col md:col-span-2">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              About Company
            </label>
            <textarea
              name="about_company"
              value={job.about_company}
              onChange={handleChange}
              className="min-h-[120px] w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="Write about the company"
            />
          </div>
        </section>

        {/* Interview & dates */}
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Interview Mode */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Interview Mode
            </label>
            <input
              name="interview_mode"
              value={job.interview_mode}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="In-person, Online, etc."
            />
          </div>

          {/* Job URL */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Job URL
            </label>
            <input
              name="job_url"
              value={job.job_url}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="Application URL"
            />
          </div>

          {/* Publish Date */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Publish Date
            </label>
            <input
              type="date"
              name="publishDate"
              value={job.publishDate?.split("T")[0] || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Last Date */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Last Date
            </label>
            <input
              type="date"
              name="lastDate"
              value={job.lastDate?.split("T")[0] || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Publish Status */}
          <div className="flex w-full flex-col">
            <label className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Publish Status
            </label>
            <select
              name="publishStatus"
              value={job.publishStatus}
              onChange={handleChange}
              className="w-full cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-green-600 px-8 py-3 text-white transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Job"}
          </button>
        </div>
      </form>

      {/* Input styling */}
      <style jsx>{`
        .input-style {
          @apply w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 transition duration-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500;
        }
      `}</style>
    </div>
  );
};

export default Page;
