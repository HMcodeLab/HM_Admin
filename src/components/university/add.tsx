"use client";

import React, {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const initialFormData = {
  password: "",
  name: "",
  profile: "",
  email: "",
  coins: "",
  mobile: "",
  college: "", // Internal field name
  collegeName: "",
  coursesAllotted: [] as string[],
};

const RegisterUniversity: React.FC = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [addedCourseTitle, setAddedCourseTitle] = useState<string[]>([]);
  const [addedCourseId, setAddedCourseId] = useState<string[]>([]);
  const [courseData, setCourseData] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const searchRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/uploadinsprofiletoaws`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Profile Picture Updated");
        setFormData((prev) => ({ ...prev, profile: res.data.url }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "TPO Name is required";
    }
    if (!formData.college.trim()) {
      errors.college = "University is required";
    }
    if (!formData.collegeName.trim()) {
      errors.collegeName = "College Name is required";
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      errors.email = "Valid Email is required";
    }
    if (!formData.password || formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!formData.mobile || formData.mobile.length < 10) {
      errors.mobile = "Valid Mobile Number is required (at least 10 digits)";
    }
    if (!formData.coins || isNaN(Number(formData.coins))) {
      errors.coins = "Valid Coins amount is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form - show errors only on submit
    if (!validateForm()) {
      // Show first error as toast
      const firstError = Object.values(formErrors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    if (addedCourseId.length === 0) {
      toast.error("Please select at least one course");
      return;
    }

    setIsSubmitting(true);

    // Backend fields के according payload बनाएं
    const payload = {
      password: formData.password,
      email: formData.email.trim(),
      name: formData.name.trim(),
      mobile: Number(formData.mobile), // Convert to number as per backend
      profile:
        formData.profile ||
        "https://hoping-minds-courses-1234.s3.ap-south-1.amazonaws.com/images/profile/instructors/default-profile.png",
      college: formData.college.trim(), // Internal field name remains 'college'
      collegeName: formData.collegeName.trim(),
      coins: Number(formData.coins), // Convert to number as per backend
      coursesAllotted: addedCourseId,
    };

    console.log("📤 Final Payload:", JSON.stringify(payload, null, 2));
    console.log(
      "🔑 Admin Token:",
      localStorage.getItem("adminToken") ? "Present" : "Missing",
    );

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/registercollegeUser`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          timeout: 15000,
        },
      );

      console.log("✅ Server Response:", response.data);

      if (response.status >= 200 && response.status < 300) {
        toast.success("🎉 College User registered successfully!");
        setFormData(initialFormData);
        setAddedCourseId([]);
        setAddedCourseTitle([]);
        setSelectedImage(null);
        setFormErrors({});

        // Reset file input
        const fileInput = document.getElementById(
          "profile",
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    } catch (error: any) {
      console.error("❌ Full Error Object:", error);

      // Enhanced error handling with detailed logging
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverError = error.response.data;

        console.error("🚨 Server Error Status:", status);
        console.error("🚨 Server Error Data:", serverError);

        // Extract error message from various possible structures
        let errorMessage = "Registration failed";

        if (typeof serverError === "string") {
          errorMessage = serverError;
        } else if (serverError?.message) {
          errorMessage = serverError.message;
        } else if (serverError?.error?.message) {
          errorMessage = serverError.error.message;
        } else if (serverError?.error?.error) {
          errorMessage = serverError.error.error;
        } else if (serverError?.error) {
          errorMessage = serverError.error;
        } else if (serverError?.errors) {
          // Handle array of errors
          errorMessage = serverError.errors
            .map((err: any) => err.msg || err.message || err.error)
            .join(", ");
        } else if (serverError?.details) {
          errorMessage = serverError.details;
        }

        // Specific error messages for common status codes
        switch (status) {
          case 400:
            toast.error(`Bad Request: ${errorMessage}`);
            break;
          case 401:
            toast.error("Unauthorized: Please check your admin token");
            break;
          case 409:
            if (
              errorMessage.includes("mobile") ||
              errorMessage.includes("phone")
            ) {
              toast.error(
                "Mobile number already exists. Please use a different mobile number.",
              );
            } else if (errorMessage.includes("email")) {
              toast.error(
                "Email already exists. Please use a different email.",
              );
            } else {
              toast.error(`Conflict: ${errorMessage}`);
            }
            break;
          case 500:
            toast.error(`Server Error: ${errorMessage}`);
            break;
          default:
            toast.error(`Error ${status}: ${errorMessage}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error("🌐 No Response Received:", error.request);
        toast.error(
          "No response from server. Please check your internet connection and try again.",
        );
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Please try again.");
      } else {
        // Something else happened
        console.error("⚡ Other Error:", error.message);
        toast.error(`Request failed: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectedCourse = (id: string, title: string) => {
    if (!addedCourseId.includes(id)) {
      setAddedCourseId((prev) => [...prev, id]);
      setAddedCourseTitle((prev) => [...prev, title]);
      toast.success(`Course "${title}" added`);
    } else {
      toast.error("Course already selected");
    }
    setShowDropdown(false);
    if (searchRef.current) {
      searchRef.current.value = "";
    }
  };

  const removeCourse = (index: number) => {
    const removedTitle = addedCourseTitle[index];
    setAddedCourseId((prev) => prev.filter((_, i) => i !== index));
    setAddedCourseTitle((prev) => prev.filter((_, i) => i !== index));
    toast.success(`Course "${removedTitle}" removed`);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/courses`,
      );
      setCourseData(res.data.courses);
      console.log("📚 Courses loaded:", res.data.courses.length);
    } catch (err) {
      console.error("Failed to fetch courses", err);
      toast.error("Failed to load courses");
    }
  };

  const clearForm = () => {
    setFormData(initialFormData);
    setAddedCourseId([]);
    setAddedCourseTitle([]);
    setSelectedImage(null);
    setFormErrors({});
    const fileInput = document.getElementById("profile") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    toast.success("Form cleared");
  };

  useEffect(() => {
    fetchData();

    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearchFocus = () => {
    setShowDropdown(true);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShowDropdown(true);
  };

  const filteredCourses = courseData.filter((course) =>
    course.title
      .toLowerCase()
      .includes(searchRef.current?.value.toLowerCase() || ""),
  );

  return (
    <div className="min-h-screen bg-white p-6 text-black dark:bg-gray-900 dark:text-white">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Register College User</h1>
        <button
          type="button"
          onClick={clearForm}
          className="rounded bg-gray-500 px-4 py-2 font-medium text-white hover:bg-gray-600"
        >
          Clear Form
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2"
      >
        {/* TPO Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-medium">
            TPO Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter TPO name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`rounded border p-2 focus:outline-none focus:ring-1 ${
              formErrors.name
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
          />
          {formErrors.name && (
            <p className="text-sm text-red-500">{formErrors.name}</p>
          )}
        </div>

        {/* University - UI में University दिखेगा, internally college field use होगा */}
        <div className="flex flex-col gap-2">
          <label htmlFor="college" className="font-medium">
            University *
          </label>
          <input
            type="text"
            id="college"
            name="college"
            placeholder="Enter university name"
            value={formData.college}
            onChange={handleChange}
            required
            className={`rounded border p-2 focus:outline-none focus:ring-1 ${
              formErrors.college
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
          />
          {formErrors.college && (
            <p className="text-sm text-red-500">{formErrors.college}</p>
          )}
        </div>

        {/* College Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="collegeName" className="font-medium">
            College Name *
          </label>
          <input
            type="text"
            id="collegeName"
            name="collegeName"
            placeholder="Enter college name with location"
            value={formData.collegeName}
            onChange={handleChange}
            required
            className={`rounded border p-2 focus:outline-none focus:ring-1 ${
              formErrors.collegeName
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
          />
          {formErrors.collegeName && (
            <p className="text-sm text-red-500">{formErrors.collegeName}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-medium">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email address"
            autoComplete="new-email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`rounded border p-2 focus:outline-none focus:ring-1 ${
              formErrors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
          />
          {formErrors.email && (
            <p className="text-sm text-red-500">{formErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-medium">
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password (min 6 characters)"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className={`rounded border p-2 focus:outline-none focus:ring-1 ${
              formErrors.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
          />
          {formErrors.password && (
            <p className="text-sm text-red-500">{formErrors.password}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="flex flex-col gap-2">
          <label htmlFor="mobile" className="font-medium">
            Mobile Number *
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            placeholder="Enter mobile number (10 digits)"
            value={formData.mobile}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={10}
            pattern="[0-9]{10}"
            className={`rounded border p-2 focus:outline-none focus:ring-1 ${
              formErrors.mobile
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
          />
          {formErrors.mobile && (
            <p className="text-sm text-red-500">{formErrors.mobile}</p>
          )}
        </div>

        {/* Coins */}
        <div className="flex flex-col gap-2">
          <label htmlFor="coins" className="font-medium">
            Coins *
          </label>
          <input
            type="number"
            id="coins"
            name="coins"
            placeholder="Enter coins amount"
            value={formData.coins}
            onChange={handleChange}
            required
            min="0"
            className={`rounded border p-2 focus:outline-none focus:ring-1 ${
              formErrors.coins
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
          />
          {formErrors.coins && (
            <p className="text-sm text-red-500">{formErrors.coins}</p>
          )}
        </div>

        {/* Profile Photo */}
        <div className="col-span-full flex flex-col gap-2">
          <label htmlFor="profile" className="font-medium">
            Profile Photo
          </label>
          <input
            type="file"
            id="profile"
            accept="image/*"
            onChange={handleFileChange}
            className="rounded border border-gray-300 p-4 text-sm dark:border-gray-700"
          />
          {formData.profile && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Preview:
              </p>
              <Image
                src={formData.profile}
                alt="Profile Preview"
                width={100}
                height={100}
                className="rounded border"
              />
            </div>
          )}
        </div>

        {/* Course Selection */}
        <div className="relative col-span-full">
          <label htmlFor="courseSearch" className="font-medium">
            Choose Course *
          </label>
          <input
            type="text"
            id="courseSearch"
            placeholder="Search and select courses..."
            ref={searchRef}
            onFocus={handleSearchFocus}
            onChange={handleSearchChange}
            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          {showDropdown && filteredCourses.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700">
              {filteredCourses.map((course, i) => (
                <li
                  key={course._id}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSelectedCourse(course._id, course.title)}
                >
                  <div className="font-medium">{course.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    By {course?.instructor?.name || "Unknown Instructor"}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Selected Courses */}
          <div className="mt-3">
            <label className="font-medium">
              Selected Courses ({addedCourseTitle.length}):
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {addedCourseTitle.length === 0 ? (
                <span className="text-gray-500 dark:text-gray-400">
                  No courses selected. Please search and select at least one
                  course.
                </span>
              ) : (
                addedCourseTitle.map((title, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                  >
                    {title}
                    <button
                      type="button"
                      onClick={() => removeCourse(i)}
                      className="ml-1 rounded-full bg-blue-200 p-1 text-xs hover:bg-blue-300 dark:bg-blue-800 dark:hover:bg-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-full flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full max-w-md items-center justify-center rounded bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {isSubmitting ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Registering...
              </>
            ) : (
              "Register College User"
            )}
          </button>
        </div>
      </form>

      {/* Debug Info */}
      <div className="mt-8 rounded border border-gray-300 p-4 dark:border-gray-700">
        <h3 className="mb-2 font-medium">Debug Information:</h3>
        <div className="text-sm">
          <p>Selected Courses IDs: {addedCourseId.join(", ") || "None"}</p>
          <p>Profile Image: {formData.profile ? "Uploaded" : "Not uploaded"}</p>
          <p>University Field Value: {formData.college}</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterUniversity;
