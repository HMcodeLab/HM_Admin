"use client";

import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FcBusinessman } from "react-icons/fc";
import { FaUserEdit } from "react-icons/fa";
import Image from "next/image";

interface Course {
  _id: string;
  title: string;
  instructor?: {
    name: string;
  };
}

interface FormData {
  name?: string;
  email?: string;
  mobile?: string;
  experience?: string;
  courseAlloted?: string[];
  college?: string;
  coins?: string | number;
  profile?: string;
}

const Page: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [collegeId, setCollegeId] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [addedCourseTitle, setAddedCourseTitle] = useState<string[]>([]);
  const [addedCourseId, setAddedCourseId] = useState<string[]>([]);
  const [courseData, setCourseData] = useState<Course[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/courses`,
        );
        setCourseData(response.data.courses);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch courses");
      }
    };
    fetchCourseDetails();
  }, []);

  useEffect(() => {
    if (courseData.length === 0) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("adminToken") ?? "";
        const email = localStorage.getItem("collegeEmail");

        if (!email) return toast.error("No college email found.");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/collegeUser?email=${email}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const collegeUserToUpdate = response.data.data;
        setCollegeId(collegeUserToUpdate._id);

        const courseTitles =
          collegeUserToUpdate.courseAlloted?.map((courseId: string) => {
            const course = courseData.find((c) => c._id === courseId);
            return course ? course.title : courseId;
          }) || [];

        setFormData({
          name: collegeUserToUpdate.name,
          email: collegeUserToUpdate.email,
          mobile: collegeUserToUpdate.mobile,
          experience: collegeUserToUpdate.experience,
          courseAlloted: collegeUserToUpdate.courseAlloted || [],
          college: collegeUserToUpdate.college,
          coins: collegeUserToUpdate.coins,
          profile: collegeUserToUpdate.profile,
        });

        setAddedCourseId(collegeUserToUpdate.courseAlloted || []);
        setAddedCourseTitle(courseTitles);
      } catch (error: any) {
        toast.error(error.message || "Error fetching college data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerFileInput = () => {
    document.getElementById("profileInput")?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const token = localStorage.getItem("adminToken") ?? "";
      const form = new FormData();
      form.append("file", file);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/uploadinsprofiletoaws`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Profile Picture Updated");
        setFormData((prev) => ({ ...prev, profile: res.data.url }));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    }
  };

  const handleSelectedCourse = (id: string, title: string) => {
    if (!addedCourseId.includes(id)) {
      setAddedCourseId((prev) => [...prev, id]);
      setAddedCourseTitle((prev) => [...prev, title]);
      setFormData((prev) => ({
        ...prev,
        courseAlloted: [...(prev.courseAlloted || []), id],
      }));
      setShowDropdown(false);
    }
  };

  const handleRemoveCourse = (id: string, title: string) => {
    setAddedCourseId((prev) => prev.filter((courseId) => courseId !== id));
    setAddedCourseTitle((prev) =>
      prev.filter((courseTitle) => courseTitle !== title),
    );
    setFormData((prev) => ({
      ...prev,
      courseAlloted: (prev.courseAlloted || []).filter(
        (courseId) => courseId !== id,
      ),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken") ?? "";

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/updatecollegeUserAdmin/${collegeId}`,
        { ...formData, courseAlloted: addedCourseId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 201) {
        toast.success("College Updated Successfully");
        router.push("/university/view");
      } else {
        toast.error("Failed to update");
      }
    } catch (error: any) {
      toast.error(error.message || "Update error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 dark:from-gray-900 dark:to-gray-800">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl space-y-6 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800"
        >
          <div className="flex justify-center">
            <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-yellow-400 shadow-lg">
              {formData.profile ? (
                <Image
                  src={formData.profile}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <FcBusinessman className="h-full w-full p-4 text-gray-300 dark:text-gray-600" />
              )}
              <FaUserEdit
                onClick={triggerFileInput}
                className="absolute bottom-2 right-2 z-10 cursor-pointer rounded-full bg-white p-1 text-xl text-yellow-400 shadow-md dark:bg-gray-700"
              />
            </div>
            <input
              id="profileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { name: "name", placeholder: "Name" },
              { name: "college", placeholder: "College" },
              { name: "email", placeholder: "Email", disabled: true },
              { name: "mobile", placeholder: "Mobile" },
              { name: "coins", placeholder: "Coins" },
            ].map((input) => (
              <input
                key={input.name}
                name={input.name}
                value={formData[input.name as keyof FormData] || ""}
                onChange={handleChange}
                placeholder={input.placeholder}
                disabled={input.disabled}
                className={`rounded-lg border p-3 outline-none focus:ring-2 ${
                  input.disabled
                    ? "bg-gray-200 text-gray-500 dark:bg-gray-700"
                    : "bg-white text-black focus:ring-yellow-400 dark:bg-gray-900 dark:text-white"
                }`}
              />
            ))}
          </div>

          <div>
            <input
              type="text"
              placeholder="Search Courses"
              className="w-full rounded-lg border bg-white p-3 outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-900 dark:text-white"
              onFocus={() => setShowDropdown(true)}
              ref={searchRef}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {addedCourseTitle.map((title, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2 rounded-full bg-yellow-200 px-3 py-1 text-sm text-gray-800 shadow"
                >
                  {title}
                  <button
                    onClick={() => handleRemoveCourse(addedCourseId[i], title)}
                    className="text-red-500 hover:text-red-700"
                    type="button"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            {showDropdown && (
              <ul className="mt-2 max-h-60 overflow-auto rounded-lg border bg-white shadow dark:bg-gray-700">
                {courseData.map((course) => (
                  <li
                    key={course._id}
                    className="cursor-pointer px-4 py-2 hover:bg-yellow-100 dark:hover:bg-yellow-700"
                    onClick={() =>
                      handleSelectedCourse(course._id, course.title)
                    }
                  >
                    {course.title} - {course.instructor?.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-full bg-yellow-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-yellow-600 disabled:opacity-60"
            >
              {loading && (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {loading ? "Updating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Page;
