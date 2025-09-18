"use client";

import React, { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Loader from "../Loader";

const API_URL = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "";

type UserData = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  profilePhoto: string | null;
  role?: string;
};

type WorkExperience = {
  isFresher: boolean;
  from: number;
  to: number;
};

type SalaryRange = {
  from: number;
  to: number;
};

type FormDataType = {
  publishedBy: string;
  position: string;
  employment_type: string;
  educational_qualification: string;
  company: string;
  role_category: string;
  work_mode: string;
  degree: string;
  specialization: string;
  work_experience: WorkExperience;
  annual_salary_range: SalaryRange;
  company_industry: string;
  interview_mode: string;
  job_description: string;
  about_company: string;
  company_website_link: string;
  company_address: string;
  logoUrl: string;
  publishStatus: string;
  publishDate: string;
  lastDate: string;
  applicantsFile: File | null;
  job_url: string;
};

const DEFAULT_LOGO =
  "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwcICAgHCAgIBwgHCA0HCAgIDQ8IDQgNFREWFhURExMYHSggJBslGxMTITEhMSkrLjouFx8zRDM4QygvOi0BCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAZAAEBAQEBAQAAAAAAAAAAAAAAAQQDAgf/xAA1EAEAAgACBAsGBwEAAAAAAAAAAQIDEQQTITESFDJBUlNicpGSoSJRccLR8DM0QmGxweEk/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APq6gAEKAAAAACgAAAAAAAAIAAqAIqAAAEgCCgAKAAACgigAAAAAAAAAAAAAAAigIACCoAACgAKigAAAAAAAAAAAAAAAAAAAAIqAIoBkIoBAAoAAAAAAAAAAAAAAAAAAAAAAIBIqAAAKigAAAAAAAAAAAAAAAAAAAAAAAAIoCCgAAAAAAAAAAAzXicTFms7onKsTtiNmfivFo7PlBoGfi0dnynFo7PlBoGfi0dnynFo7PlBoGfi0dnynFo7PlBoGfi0dnyvM11Voyzzyz2RkDUAAAAAAAAAAIoAAAAAAAAAAM9fx7d75XnHtNrzWc+DXKODzTOWec+K1n/onvfK6YmFFp4UTlPP+4OWBaa2isbp2ZNTlh4PBnhTOcxuy3Q6gPFMSl85rOcRPiz42NrPZr+Hzz1n+ffx81tNZzjZMA2s2k8qO7/bth4kXjZvjfHucdK5Ve7/AGDTO+QnfIAAAAAAAAAAAAAAAAAAAADLX8xPe+VovetKza05RHqz1/Mz3vleNItM4lomdlMorHu2R9QXX3m/D3RuinNEfUxsacT2IzrT9Xvv+3w+/jyzMwUTMzB7raazExsl00vl17s/y4w7aZy692f5BqnfISAAAAAAAAACKAAAAAAAAAADJaeBj2tMTlnns5/ZepxcCZmZw5mZ3zMRt9Xe1K25VYn4vOpwuhHqDjrdH6qfCDW6P1U+EO2pwuhHqanC6EeoOOt0fqp8INbo/VT4Q7anC6EepqcLoR6g5a3R+rnwhzxr620cHLbuDty2zLTqcLoR6rXDpWc61iJ9+8HuQAAAAAAAAAAABIUAAAAAAAAAAAAAAAAAAAAAAAAAAE2goIqEAoAAAAAAAAAAAAAAAAAAAAAAACSryCiAKIAsKigAAAAAAAAAAAAAAAAAAAAAgAgAqKCAAKigogCgAAAAAAAAAAAAAAAAgAgAAAAAAAAAqAKqEAogCgAAAAAAAAACACKgAAAICiACgAAAoAIoAACgAAAAAJKgJCgCAAIAHOAAgAAA/9k=";

const initialFormData: FormDataType = {
  publishedBy: "",
  position: "",
  employment_type: "Full-time",
  educational_qualification: "",
  company: "",
  role_category: "",
  work_mode: "Office",
  degree: "B.Tech",
  specialization: "Computer Science",
  work_experience: { isFresher: false, from: 0, to: 0 },
  annual_salary_range: { from: 0, to: 0 },
  company_industry: "",
  interview_mode: "Online",
  job_description: "",
  about_company: "",
  company_website_link: "",
  company_address: "",
  logoUrl: DEFAULT_LOGO,
  publishStatus: "active",
  publishDate: new Date().toISOString().split("T")[0],
  lastDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  applicantsFile: null,
  job_url: "",
};

const AddHMJobs: React.FC = () => {
  const [jd, setJd] = useState<string>("");
  const [keySkill, setKeySkill] = useState<string>("");
  const [addedSkills, setAddedSkills] = useState<string[]>([]);
  const [jobLocation, setJobLocation] = useState<string>("");
  const [addedLocations, setAddedLocations] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    profilePhoto: null,
    role: "",
  });

  // Load token and decode email on component mount
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    if (token) {
      setAdminToken(token);
      try {
        const decoded: any = jwtDecode(token);
        if (decoded?.email) {
          setAdminEmail(decoded.email);
        } else {
          toast.error("Token missing email");
        }
      } catch (error) {
        toast.error("Invalid token");
        console.error("Token decode error:", error);
      }
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!adminEmail || !adminToken) return;

    setIsProfileLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/admin?email=${encodeURIComponent(adminEmail)}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const profileData = json.data;
        setUserData({
          _id: profileData._id,
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          email: profileData.email || "",
          mobile: profileData.mobile || "",
          profilePhoto: profileData.profile || null,
          role: profileData.role || "",
        });

        setFormData((prev) => ({
          ...prev,
          publishedBy: profileData._id,
        }));
      } else {
        toast.error(json.message || "Failed to fetch profile");
      }
    } catch (err) {
      toast.error("Error fetching profile");
      console.error(err);
    } finally {
      setIsProfileLoading(false);
    }
  }, [adminEmail, adminToken]);

  useEffect(() => {
    if (adminEmail && adminToken) {
      fetchProfile();
    }
  }, [adminEmail, adminToken, fetchProfile]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "applicantsFile" && files) {
      setFormData((prev) => ({ ...prev, applicantsFile: files[0] }));
    } else if (name === "logoUrl" && value === "") {
      setFormData((prev) => ({ ...prev, logoUrl: DEFAULT_LOGO }));
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
      annual_salary_range: {
        ...prev.annual_salary_range,
        [name]: Number(value),
      },
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      "position",
      "employment_type",
      "company",
      "role_category",
      "work_mode",
      "company_industry",
      "interview_mode",
      "company_address",
      "company_website_link",
      "about_company",
      "job_url",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof FormDataType]) {
        toast.error(`Please provide ${field.replace(/_/g, " ")}`);
        return false;
      }
    }

    if (addedLocations.length === 0) {
      toast.error("At least one job location is required");
      return false;
    }

    if (addedSkills.length === 0) {
      toast.error("At least one key skill is required");
      return false;
    }

    if (!jd) {
      toast.error("Job description is required");
      return false;
    }

    if (!formData.educational_qualification.trim()) {
      toast.error("Educational qualification is required");
      return false;
    }

    if (formData.annual_salary_range.from > formData.annual_salary_range.to) {
      toast.error("Maximum salary should be greater than minimum salary");
      return false;
    }

    if (new Date(formData.lastDate) < new Date(formData.publishDate)) {
      toast.error("Last date should be after publish date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Properly define jobData object
      const jobData = {
        publishedBy: formData.publishedBy,
        position: formData.position,
        employment_type: formData.employment_type,
        key_skills: addedSkills,
        company: formData.company,
        role_category: formData.role_category,
        work_mode: formData.work_mode,
        location: addedLocations[0],
        work_experience: {
          isFresher: formData.work_experience.isFresher,
          from: formData.work_experience.isFresher
            ? 0
            : Number(formData.work_experience.from),
          to: formData.work_experience.isFresher
            ? 0
            : Number(formData.work_experience.to),
        },
        annual_salary_range: {
          from: Number(formData.annual_salary_range.from),
          to: Number(formData.annual_salary_range.to),
        },
        company_industry: formData.company_industry,
        educational_qualification: formData.educational_qualification
          .split("\n")
          .filter((item) => item.trim() !== ""),
        interview_mode: formData.interview_mode,
        job_description: jd,
        about_company: formData.about_company,
        company_website_link: formData.company_website_link,
        company_address: formData.company_address,
        logoUrl: formData.logoUrl || DEFAULT_LOGO,
        publishStatus: formData.publishStatus,
        publishDate: new Date(formData.publishDate).toISOString(),
        lastDate: new Date(formData.lastDate).toISOString(),
        job_url: formData.job_url,
        applicants: [],
      };

      // Debug log to verify the data
      console.log("Job Data hdhaahahhahahahahaha:", jobData);

      const formDataToSend = new FormData();
      formDataToSend.append("job", JSON.stringify(jobData)); // Explicitly stringify

      if (formData.applicantsFile) {
        formDataToSend.append("applicantsFile", formData.applicantsFile);
      }

      // Debug FormData contents
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(
        `${API_URL}/createAInHousePlacement`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            // Don't set Content-Type - browser will set it automatically with boundary
          },
        },
      );

      if (response.data?.success) {
        toast.success("Job posted successfully!");
        resetForm();
      } else {
        toast.error(response.data?.message || "Failed to post job");
      }
    } catch (error: any) {
      console.error("Full Error:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
        toast.error(error.response.data?.message || "Server error occurred");
      } else {
        toast.error(error.message || "Failed to connect to server");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ...initialFormData,
      publishedBy: userData._id || "",
    });
    setJd("");
    setAddedSkills([]);
    setAddedLocations([]);
    setJobLocation("");
    setKeySkill("");
  };

  if (isProfileLoading) {
    return <Loader />;
  }

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
          {/* Published By */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Published By (Your User ID)
            </label>
            <input
              type="text"
              name="publishedBy"
              value={formData.publishedBy}
              readOnly
              className="w-full rounded border bg-gray-100 p-3 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Position */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Position *
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Job Title"
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Employment Type */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Employment Type *
            </label>
            <select
              name="employment_type"
              value={formData.employment_type}
              onChange={handleChange}
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Company Industry */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Industry *
            </label>
            <input
              type="text"
              name="company_industry"
              value={formData.company_industry}
              onChange={handleChange}
              placeholder="Industry"
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Role Category */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role Category *
            </label>
            <input
              type="text"
              name="role_category"
              value={formData.role_category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Work Mode */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Work Mode *
            </label>
            <select
              name="work_mode"
              value={formData.work_mode}
              onChange={handleChange}
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="Office">Office</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Job Location */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Location *
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                placeholder="Add job location"
              />
              <button
                type="button"
                onClick={handleAddLocation}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {addedLocations.length > 0 && (
              <div className="mt-2">
                <ul className="mt-1 space-y-1">
                  {addedLocations.map((loc, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded bg-gray-100 px-3 py-2 dark:bg-gray-700"
                    >
                      <span>{loc}</span>
                      <button
                        onClick={() => handleRemoveLocation(i)}
                        type="button"
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Key Skills */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Key Skills *
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={keySkill}
                onChange={(e) => setKeySkill(e.target.value)}
                className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                placeholder="Add key skill"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Add
              </button>
            </div>
            {addedSkills.length > 0 && (
              <div className="mt-2">
                <ul className="mt-1 space-y-1">
                  {addedSkills.map((skill, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded bg-gray-100 px-3 py-2 dark:bg-gray-700"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(i)}
                        type="button"
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Salary Range */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Annual Salary Range (INR) *
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                name="from"
                placeholder="Minimum salary"
                value={formData.annual_salary_range.from}
                onChange={handleSalary}
                className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                type="number"
                name="to"
                placeholder="Maximum salary"
                value={formData.annual_salary_range.to}
                onChange={handleSalary}
                className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Work Experience */}
          <div className="col-span-2 rounded border p-4 dark:border-gray-600">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                      from: e.target.checked ? 0 : prev.work_experience.from,
                      to: e.target.checked ? 0 : prev.work_experience.to,
                    },
                  }))
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label
                htmlFor="fresher"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Fresher (No experience required)
              </label>
            </div>

            {!formData.work_experience.isFresher && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Minimum Experience (years) *
                  </label>
                  <input
                    type="number"
                    name="from"
                    value={formData.work_experience.from}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        work_experience: {
                          ...prev.work_experience,
                          from: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maximum Experience (years) *
                  </label>
                  <input
                    type="number"
                    name="to"
                    value={formData.work_experience.to}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        work_experience: {
                          ...prev.work_experience,
                          to: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
                    min="0"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Description *
            </label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Detailed job description..."
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              rows={5}
              required
            />
          </div>

          {/* Educational Qualification */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Educational Qualification *
            </label>
            <textarea
              name="educational_qualification"
              value={formData.educational_qualification}
              onChange={handleChange}
              placeholder="Add each qualification on a new line"
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              rows={5}
              required
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Each line will be treated as a separate qualification
            </p>
          </div>

          {/* About Company */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              About Company *
            </label>
            <textarea
              name="about_company"
              value={formData.about_company}
              onChange={handleChange}
              placeholder="Company description..."
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              rows={5}
              required
            />
          </div>

          {/* Company Website */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Website *
            </label>
            <input
              type="url"
              name="company_website_link"
              value={formData.company_website_link}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Company Address */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Address *
            </label>
            <textarea
              name="company_address"
              value={formData.company_address}
              onChange={handleChange}
              placeholder="Full address"
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              rows={5}
              required
            />
          </div>

          {/* Interview Mode */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Interview Mode *
            </label>
            <select
              name="interview_mode"
              value={formData.interview_mode}
              onChange={handleChange}
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="Online">Online</option>
              <option value="in person">In Person</option>
            </select>
          </div>

          {/* Job URL */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job URL *
            </label>
            <input
              type="url"
              name="job_url"
              value={formData.job_url}
              onChange={handleChange}
              placeholder="https://example.com/jobs/123"
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Logo URL */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Logo URL
            </label>
            <input
              type="url"
              name="logoUrl"
              value={formData.logoUrl === DEFAULT_LOGO ? "" : formData.logoUrl}
              onChange={handleChange}
              placeholder="Leave blank for default logo"
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Publish Status */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Publish Status *
            </label>
            <select
              name="publishStatus"
              value={formData.publishStatus}
              onChange={handleChange}
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Publish Date */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Publish Date *
            </label>
            <input
              type="date"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleChange}
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Last Date */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Date *
            </label>
            <input
              type="date"
              name="lastDate"
              value={formData.lastDate}
              onChange={handleChange}
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Applicants File Upload */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Applicants File (Optional)
            </label>
            <input
              type="file"
              name="applicantsFile"
              onChange={handleChange}
              className="w-full rounded border p-3 dark:bg-gray-700 dark:text-white"
              accept=".pdf,.doc,.docx"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-2 mt-6 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-lg px-8 py-3 text-white ${isSubmitting ? "cursor-not-allowed bg-gray-500" : "bg-green-600 hover:bg-green-700"}`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Posting...
                </span>
              ) : (
                "Post Job"
              )}
            </button>
          </div>
        </form>

        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </div>
    </div>
  );
};

export default AddHMJobs;
