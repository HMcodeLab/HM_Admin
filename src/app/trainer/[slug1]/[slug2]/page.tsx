"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FcBusinessman } from "react-icons/fc";
import { BiPlusMedical } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { FaUserEdit } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

interface SocialLink {
  websiteName: string;
  profileUrl: string;
}

interface InstructorForm {
  _id?: string;
  name?: string; // combined full name
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  noOfStudents?: number | string;
  bio?: string;
  experience?: string;
  experties?: string;
  workExperience?: string;
  profile?: string;
  social_links?: SocialLink[]; // underscore, check backend expects this
  password?: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InstructorForm>({
    social_links: [{ websiteName: "", profileUrl: "" }],
  });

  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;


  useEffect(() => {
    const fetchData = async () => {
      if (!adminToken) {
        toast.error("Authentication token missing");
        return;
      }
      setLoading(true);
      try {
        const email = localStorage.getItem("instructorEmail");
        if (!email) {
          toast.error("Instructor email missing");
          return;
        }

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/inst/${email}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          },
        );

        const instructor = res.data.instructorDetails;

        if (instructor) {
          const nameParts = (instructor.name || "").split(" ");
          setFormData({
            _id: instructor._id,
            name:
              instructor.name ||
              `${instructor.firstName || ""} ${instructor.lastName || ""}`.trim(),
            firstName: instructor.firstName || nameParts[0] || "",
            lastName: instructor.lastName || nameParts.slice(1).join(" ") || "",
            email: instructor.email || "",
            phone: instructor.phone || "",
            noOfStudents: instructor.noOfStudents || "",
            bio: instructor.bio || "",
            experience: instructor.experience || "",
            experties: instructor.experties || "",
            workExperience: instructor.workExperience || "",
            social_links: instructor.social_links?.length
              ? instructor.social_links
              : [{ websiteName: "", profileUrl: "" }],
            profile: instructor.profile || "",
            password: "", // never prefill password
          });
        }
      } catch (error) {
        console.error("Error fetching instructor:", error);
        toast.error("Failed to fetch instructor data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [adminToken]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!adminToken) {
      toast.error("Authentication token missing");
      return;
    }

    try {
      const formDataAWS = new FormData();
      formDataAWS.append("file", file);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/uploadinsprofiletoaws`,
        formDataAWS,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Profile Picture Updated");
        setFormData((prev) => ({ ...prev, profile: res.data.url }));
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number,
  ) => {
    const { name, value } = e.target;

    if (index !== undefined && formData.social_links) {
      const updatedLinks = [...formData.social_links];
      (updatedLinks[index] as any)[name] = value;
      setFormData((prev) => ({ ...prev, social_links: updatedLinks }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      social_links: [
        ...(prev.social_links || []),
        { websiteName: "", profileUrl: "" },
      ],
    }));
  };

  const deleteSocialLink = (index: number) => {
    if (!formData.social_links) return;
    setFormData((prev) => ({
      ...prev,
      social_links: prev.social_links!.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!adminToken) {
      toast.error("Authentication token missing");
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        ...formData,
        instructorID: formData._id,
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/updateinstructoradmin`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("Instructor Updated Successfully");
        setTimeout(() => router.push("/trainer"), 300);
      } else {
        toast.error("Failed to update instructor");
      }
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-r">
      <Toaster position="top-center" />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-3xl rounded-lg bg-white shadow-lg dark:bg-gray-900 sm:p-10"
      >
        {/* Cover Banner */}
        <div
          className="relative h-40 rounded-t-lg bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
          }}
        >
          <div className="absolute inset-0 rounded-t-lg bg-gradient-to-b from-black/40 to-transparent"></div>

          {/* Profile Image */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 transform rounded-full border-4 border-white shadow-lg dark:border-gray-900">
            {formData.profile ? (
              <Image
                src={formData.profile}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full object-cover"
                unoptimized={true}
              />
            ) : (
              <FcBusinessman className="h-[120px] w-[120px] rounded-full text-indigo-300 dark:text-indigo-600" />
            )}

            {/* Edit Icon */}
            <label
              htmlFor="profileInput"
              className="absolute bottom-2 right-2 flex cursor-pointer items-center justify-center rounded-full bg-yellow-400 p-2 text-white shadow-lg transition hover:bg-yellow-500"
              title="Change Profile Picture"
            >
              <FaUserEdit className="h-6 w-6" />
            </label>
            <input
              id="profileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="mt-20 space-y-8 px-6 sm:px-10">
          {/* Name Inputs */}
          <div className="grid gap-6 sm:grid-cols-2">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm transition duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              autoComplete="given-name"
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm transition duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              autoComplete="family-name"
              required
            />
          </div>

          {/* Other Inputs */}
          <div className="grid gap-6 sm:grid-cols-2">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm transition duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              autoComplete="email"
              required
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm transition duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              autoComplete="tel"
              required
            />
            <input
              name="noOfStudents"
              type="number"
              placeholder="Total Students"
              value={formData.noOfStudents || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm transition duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              min={0}
            />
            <input
              name="experience"
              placeholder="Experience"
              value={formData.experience || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm transition duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
            <input
              name="experties"
              placeholder="Specialization"
              value={formData.experties || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm transition duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
            <input
              name="workExperience"
              placeholder="Prior Work Experience"
              value={formData.workExperience || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm transition duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          {/* Bio textarea */}
          <div>
            <textarea
              name="bio"
              placeholder="Bio"
              rows={4}
              value={formData.bio || ""}
              onChange={handleChange}
              className="w-full resize-none rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm transition duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Social Links
              </h3>
              <button
                type="button"
                onClick={addSocialLink}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-white shadow-md transition-transform duration-300 hover:scale-110 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                aria-label="Add social link"
              >
                <BiPlusMedical className="text-xl" /> Add
              </button>
            </div>

            {(formData.social_links || []).map((link, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-md border border-gray-300 bg-gray-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center"
              >
                <input
                  name="websiteName"
                  placeholder="Website"
                  value={link.websiteName || ""}
                  onChange={(e) => handleChange(e, i)}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 placeholder-gray-400 shadow-sm transition duration-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                  autoComplete="off"
                />
                <input
                  name="profileUrl"
                  placeholder="Profile URL"
                  value={link.profileUrl || ""}
                  onChange={(e) => handleChange(e, i)}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 placeholder-gray-400 shadow-sm transition duration-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                  autoComplete="off"
                />
                <ImCross
                  className="cursor-pointer text-red-500 transition-transform duration-300 hover:scale-110 hover:text-red-600"
                  onClick={() => deleteSocialLink(i)}
                  title="Remove social link"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") deleteSocialLink(i);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-3 text-lg font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Instructor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
