"use client";

import React, { useState } from "react";
import { BiPlusMedical } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { FcBusinessman } from "react-icons/fc";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";

interface SocialLink {
  websiteName: string;
  profileUrl: string;
}

interface FormData {
  name: string;
  about: string;
  profile: string;
  email: string;
  password: string;
  phoneNo: string;
  experience: string;
  experties: string;
  workExperience: string;
  noOfStudents: number;
  socialLinks: SocialLink[];
}

const AddTrainer: React.FC = () => {
  const initialFormData: FormData = {
    name: "",
    about: "",
    profile: "",
    email: "",
    password: "",
    phoneNo: "",
    experience: "",
    experties: "",
    workExperience: "",
    noOfStudents: 0,
    socialLinks: [{ websiteName: "", profileUrl: "" }],
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("No authorization token found");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/uploadinsprofiletoaws`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Profile Picture Updated");
        setFormData((prev) => ({ ...prev, profile: res.data.url }));
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number,
  ) => {
    const { name, value } = event.target;

    if (
      (name === "websiteName" || name === "profileUrl") &&
      typeof index === "number"
    ) {
      const updatedSocialLinks = [...formData.socialLinks];
      updatedSocialLinks[index][name as keyof SocialLink] = value;
      setFormData((prev) => ({ ...prev, socialLinks: updatedSocialLinks }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const triggerFileInput = () => {
    const input = document.getElementById("profileInput") as HTMLInputElement;
    if (input) input.click();
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { websiteName: "", profileUrl: "" }],
    }));
  };

  const deleteSocialLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("No authorization token found");
      return;
    }

    const formattedData = {
      password: formData.password,
      name: formData.name,
      profile: formData.profile,
      email: formData.email,
      experience: formData.experience,
      experties: formData.experties,
      workExperience: formData.workExperience,
      noOfStudents: formData.noOfStudents,
      social_links: formData.socialLinks.map((link) => ({
        website_name: link.websiteName,
        profile_url: link.profileUrl,
      })),
      phone: formData.phoneNo,
      bio: formData.about,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/instregister`,
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("Instructor added successfully");
        setFormData(initialFormData);
      } else {
        toast.error("Failed to add instructor");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.error || "Submission failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-r">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl space-y-6 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800"
        >
          <h2 className="text-center text-3xl font-bold text-gray-800 dark:text-white">
            Add New Trainer
          </h2>

          {/* Profile Image Upload */}
          <div className="relative flex items-center justify-center">
            {/* Profile Image or Default Icon */}
            <div className="relative h-24 w-24">
              {formData.profile ? (
                <Image
                  src={formData.profile || "/images/default-avatar.avif"}
                  onError={(e) =>
                    (e.currentTarget.src = "/images/default-avatar.avif")
                  }
                  alt="Instructor"
                  className="h-64 w-full object-cover transition-all duration-300 group-hover:scale-105"
                  width={300}
                  height={300}
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border bg-gray-200 shadow">
                  <FcBusinessman className="h-20 w-20" />
                </div>
              )}

              {/* Camera Icon Overlay */}
              <div
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 cursor-pointer rounded-full border border-white bg-indigo-600 p-2 shadow-md transition hover:bg-indigo-700"
              >
                <FaCamera className="text-sm text-white" />
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              id="profileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { name: "name", type: "text", placeholder: "Full Name" },
              { name: "email", type: "email", placeholder: "Email Address" },
              { name: "password", type: "password", placeholder: "Password" },
              { name: "phoneNo", type: "text", placeholder: "Phone Number" },
              {
                name: "experience",
                type: "text",
                placeholder: "Total Experience",
              },
              {
                name: "experties",
                type: "text",
                placeholder: "Area of Expertise",
              },
              {
                name: "workExperience",
                type: "text",
                placeholder: "Work Experience Details",
              },
              {
                name: "noOfStudents",
                type: "number",
                placeholder: "No. of Students Taught",
              },
            ].map((input) => (
              <div key={input.name} className="relative">
                <input
                  type={
                    input.name === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : input.type
                  }
                  name={input.name}
                  value={(formData as any)[input.name]}
                  onChange={handleChange}
                  className="peer w-full rounded-lg border border-gray-300 bg-white px-4 pb-2 pt-5 text-sm text-gray-900 placeholder-transparent shadow-sm transition duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder={input.placeholder}
                />
                <label
                  htmlFor={input.name}
                  className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-500 dark:text-gray-400 dark:peer-placeholder-shown:text-gray-500"
                >
                  {input.placeholder}
                </label>

                {/* Show/hide icon ONLY for password input */}
                {input.name === "password" && (
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 cursor-pointer text-gray-500 hover:text-indigo-500 dark:text-gray-300"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* About Section */}
          {/* About Trainer Textarea */}
          <div className="relative mb-6">
            <textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={4}
              placeholder="About the trainer"
              className="peer w-full rounded-lg border border-gray-300 bg-white px-4 pb-2 pt-5 text-sm text-gray-900 placeholder-transparent shadow-sm transition duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <label
              htmlFor="about"
              className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-500 dark:text-gray-400"
            >
              About the trainer
            </label>
          </div>

          {/* Social Links Section */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-700 dark:text-white">
              Social Links
            </h3>
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="mb-4 flex gap-3">
                {/* Website Name */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    id={`websiteName-${index}`}
                    name="websiteName"
                    value={link.websiteName}
                    onChange={(e) => handleChange(e, index)}
                    placeholder="Website Name"
                    className="peer w-full rounded-lg border border-gray-300 bg-white px-4 pb-2 pt-5 text-sm text-gray-900 placeholder-transparent shadow-sm transition duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <label
                    htmlFor={`websiteName-${index}`}
                    className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-500 dark:text-gray-400"
                  >
                    Website Name
                  </label>
                </div>

                {/* Profile URL */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    id={`profileUrl-${index}`}
                    name="profileUrl"
                    value={link.profileUrl}
                    onChange={(e) => handleChange(e, index)}
                    placeholder="Profile URL"
                    className="peer w-full rounded-lg border border-gray-300 bg-white px-4 pb-2 pt-5 text-sm text-gray-900 placeholder-transparent shadow-sm transition duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <label
                    htmlFor={`profileUrl-${index}`}
                    className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-500 dark:text-gray-400"
                  >
                    Profile URL
                  </label>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => deleteSocialLink(index)}
                  className="mt-7 rounded p-2 text-red-600 transition hover:bg-red-100 dark:hover:bg-red-900"
                  aria-label="Delete social link"
                >
                  <ImCross size={20} />
                </button>
              </div>
            ))}

            {/* Add Social Link Button */}
            <button
              type="button"
              onClick={addSocialLink}
              className="mt-3 flex items-center space-x-1 font-medium text-indigo-600 hover:text-indigo-700"
            >
              <BiPlusMedical />
              <span>Add Social Link</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-green-600 p-3 font-semibold text-white shadow hover:bg-green-700"
          >
            {loading ? "Submitting..." : "Add Trainer"}
          </button>
        </form>
      </div>

      {/* Tailwind custom class for input */}
      <style jsx>{`
        .input {
          @apply w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white;
        }
      `}</style>
    </>
  );
};

export default AddTrainer;
