import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FaBriefcase, FaBuilding, FaPlus, FaTrash } from "react-icons/fa6";

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

const UpdateJobes: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job>({
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
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [newSkill, setNewSkill] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/getInHousePlacement?jobid=${id}`,
        );
        if (response?.data?.InHousePlacement) {
          setJob(response.data.InHousePlacement);
        }
      } catch (err) {
        setError("Failed to fetch job details.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

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
    try {
      await axios.put("/api/updateInHousePlacement", job);
      toast.success("Job updated successfully!");
      router.push("/hmjobs");
    } catch (err) {
      setError("Failed to update job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl bg-white p-4 dark:bg-gray-900">
      <Toaster />
      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Position</label>
            <input
              className="input"
              name="position"
              value={job.position}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Employment Type</label>
            <input
              className="input"
              name="employment_type"
              value={job.employment_type}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Role Category</label>
            <input
              className="input"
              name="role_category"
              value={job.role_category}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Work Mode</label>
            <select
              className="input"
              name="work_mode"
              value={job.work_mode}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Office">Office</option>
            </select>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Experience (Years)</label>
            <div className="flex gap-2">
              <input
                className="input"
                name="from"
                placeholder="From"
                value={job.work_experience?.from || ""}
                onChange={(e) =>
                  handleNestedChange(e, "work_experience", "from")
                }
              />
              <input
                className="input"
                name="to"
                placeholder="To"
                value={job.work_experience?.to || ""}
                onChange={(e) => handleNestedChange(e, "work_experience", "to")}
              />
            </div>
          </div>
          <div>
            <label className="label">Salary Range</label>
            <div className="flex gap-2">
              <input
                className="input"
                name="from"
                placeholder="From"
                value={job.annual_salary_range?.from || ""}
                onChange={(e) =>
                  handleNestedChange(e, "annual_salary_range", "from")
                }
              />
              <input
                className="input"
                name="to"
                placeholder="To"
                value={job.annual_salary_range?.to || ""}
                onChange={(e) =>
                  handleNestedChange(e, "annual_salary_range", "to")
                }
              />
            </div>
          </div>
        </section>

        <section>
          <label className="label">Key Skills</label>
          <div className="flex gap-2">
            <input
              className="input"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="rounded bg-green-600 px-3 text-white"
            >
              <FaPlus />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.key_skills.map((skill, i) => (
              <span
                key={i}
                className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-green-700"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(i)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Company</label>
            <input
              className="input"
              name="company"
              value={job.company}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Industry</label>
            <input
              className="input"
              name="company_industry"
              value={job.company_industry}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Website</label>
            <input
              className="input"
              name="company_website_link"
              value={job.company_website_link}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Logo URL</label>
            <input
              className="input"
              name="logoUrl"
              value={job.logoUrl}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Company Address</label>
            <input
              className="input"
              name="company_address"
              value={job.company_address}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">About Company</label>
            <textarea
              className="input"
              name="about_company"
              value={job.about_company}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Interview Mode</label>
            <input
              className="input"
              name="interview_mode"
              value={job.interview_mode}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Job URL</label>
            <input
              className="input"
              name="job_url"
              value={job.job_url}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Publish Date</label>
            <input
              className="input"
              type="date"
              name="publishDate"
              value={job.publishDate?.split("T")[0] || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Last Date</label>
            <input
              className="input"
              type="date"
              name="lastDate"
              value={job.lastDate?.split("T")[0] || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Publish Status</label>
            <select
              className="input"
              name="publishStatus"
              value={job.publishStatus}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateJobes;
