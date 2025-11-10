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
  college: "",
  phoneNo: "",
  coursesAllotted: [] as string[],
};

const RegisterUniversity: React.FC = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [addedCourseTitle, setAddedCourseTitle] = useState<string[]>([]);
  const [addedCourseId, setAddedCourseId] = useState<string[]>([]);
  const [courseData, setCourseData] = useState<any[]>([]);
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
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      mobile: Number(formData.phoneNo),
      coursesAllotted: addedCourseId,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/registercollegeUser`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("University added successfully");
        setFormData(initialFormData);
        setAddedCourseId([]);
        setAddedCourseTitle([]);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.error || "Submit failed");
    }
  };

  const handleSelectedCourse = (id: string, title: string) => {
    if (!addedCourseId.includes(id)) {
      setAddedCourseId((prev) => [...prev, id]);
      setAddedCourseTitle((prev) => [...prev, title]);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/courses`,
      );
      setCourseData(res.data.courses);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  useEffect(() => {
    fetchData();

    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      } else {
        setShowDropdown(true);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white p-6 text-black dark:bg-gray-900 dark:text-white">
      <Toaster position="top-center" />
      <h1 className="mb-6 text-2xl font-bold">Register University</h1>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2"
      >
        <div className="flex flex-col gap-2">
          <label>TPO Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter TPO name"
            value={formData.name}
            onChange={handleChange}
            className="rounded border p-2 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>University Name</label>
          <input
            type="text"
            name="college"
            placeholder="Enter university name"
            value={formData.college}
            onChange={handleChange}
            className="rounded border p-2 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            autoComplete="new-email"
            value={formData.email}
            onChange={handleChange}
            className="rounded border p-2 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            className="rounded border p-2 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNo"
            placeholder="Enter phone number"
            value={formData.phoneNo}
            onChange={handleChange}
            className="rounded border p-2 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Coins</label>
          <input
            type="text"
            name="coins"
            placeholder="Enter coins amount"
            value={formData.coins}
            onChange={handleChange}
            className="rounded border p-2 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div className="col-span-full flex flex-col gap-2">
          <label>Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm  border p-4 rounded dark:border-gray-700"
          />
          {formData.profile && (
            <Image
              src={formData.profile}
              alt="Profile Preview"
              width={100}
              height={100}
              className="mt-2 rounded"
            />
          )}
        </div>

        <div className="relative col-span-full">
          <label>Choose Course</label>
          <input
            type="text"
            placeholder="Search course"
            ref={searchRef}
            className="w-full rounded border p-2 dark:border-gray-700 dark:bg-gray-800"
          />
          {showDropdown && (
            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border bg-white shadow dark:border-gray-600 dark:bg-gray-700">
              {courseData.map((course, i) => (
                <li
                  key={i}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSelectedCourse(course._id, course.title)}
                >
                  {course.title} - By {course?.instructor?.name}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {addedCourseTitle.map((title, i) => (
              <span
                key={i}
                className="rounded bg-blue-100 px-2 py-1 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              >
                {title}
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="col-span-full mt-4 w-1/4 mx-auto flex justify-center rounded bg-black py-2 text-white hover:opacity-90 dark:bg-white dark:text-black"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterUniversity;
