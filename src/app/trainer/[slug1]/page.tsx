"use client";

import { useEffect, useState } from "react";
import { FaPhoneVolume } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import axios from "axios";
import Image from "next/image";
import { FaRegUser } from "react-icons/fa";

interface SocialLink {
  website_name?: string;
  profile_url?: string;
  _id?: string;
}

interface InstructorData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  email?: string;
  password?: string;
  phoneNo?: string;
  experience?: string;
  experties?: string;
  noOfStudents?: number;
  workExperience?: string;
  socialLinks?: SocialLink[];
  profile?: string;
}

const Page = () => {
  const [formData, setFormData] = useState<InstructorData>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof window !== "undefined") {
          const email = localStorage.getItem("instructorEmail");
          if (!email) return;

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/inst/${email}`,
          );

          const instructorToUpdate = response.data.instructorDetails;

          console.log("instructorToUpdate", instructorToUpdate);
          if (instructorToUpdate) {
            const name = instructorToUpdate?.name?.split(" ") || [];
            setFormData({
              firstName: instructorToUpdate.firstName || name[0],
              lastName: instructorToUpdate.lastName || name[1],
              bio: instructorToUpdate.bio,
              email: instructorToUpdate.email,
              password: instructorToUpdate.password,
              phoneNo: instructorToUpdate.phone,
              experience: instructorToUpdate.experience,
              experties: instructorToUpdate.experties,
              noOfStudents: instructorToUpdate.noOfStudents,
              workExperience: instructorToUpdate.workExperience,
              socialLinks: instructorToUpdate.social_links || [],
              profile: instructorToUpdate.profile,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen justify-center">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
        {/* Cover Section */}
        <div
          className="relative h-56 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 transform">
            <div className="relative h-36 w-36 overflow-hidden rounded-full bg-gray-200 shadow-lg ring-4 ring-white dark:ring-gray-900">
              <Image
                src={formData?.profile || "/assets/person.png"}
                alt="Instructor Profile"
                fill
                className="object-cover"
                unoptimized={true}
              />
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="px-6 pb-8 pt-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-wide text-gray-900 dark:text-white">
            {formData.firstName ?? "-"} {formData.lastName ?? ""}
          </h1>

          <p className="mt-2 text-lg font-medium text-indigo-600 dark:text-indigo-400">
            {formData.experience ?? "-"}
          </p>

          {formData.bio && (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {formData.bio}
            </p>
          )}

          {/* Contact Info */}
          <div className="mt-6 flex justify-center gap-10 text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2 transition hover:text-indigo-600 dark:hover:text-indigo-400">
              <FaPhoneVolume className="h-5 w-5" />
              <span className="font-semibold">
                +91 {formData.phoneNo ?? "-"}
              </span>
            </div>
            <div className="flex items-center gap-2 transition hover:text-indigo-600 dark:hover:text-indigo-400">
              <IoMailOutline className="h-5 w-5" />
              <span className="font-semibold">{formData.email ?? "-"}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3 text-gray-700 dark:text-gray-300">
            <FaRegUser className="h-5 w-5" />
            <span className="font-semibold text-gray-700 dark:text-gray-300"> 
              Students Trained: {formData.noOfStudents?.toLocaleString() ?? "-"}
            </span>
          </div>

          {/* Extra Info Section */}
          <div className="mt-10 space-y-6 px-2 text-left text-sm text-gray-800 dark:text-gray-200 sm:px-8 md:text-base">
            {formData.experties && (
              <div>
                <h2 className="font-bold text-gray-700 dark:text-gray-300">
                  Expertise:
                </h2>
                <p className="mt-1">{formData.experties}</p>
              </div>
            )}

            {formData.workExperience && (
              <div>
                <h2 className="font-bold text-gray-700 dark:text-gray-300">
                  Work Experience:
                </h2>
                <p className="mt-1">{formData.workExperience}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
