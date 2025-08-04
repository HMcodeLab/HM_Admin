"use client";

import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { CiUser } from "react-icons/ci";
import { CameraIcon } from "./_components/icons";
import Loader from "@/components/Loader";

const API_URL = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "";

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  profilePhoto: string | null;
};

export default function ProfilePage() {
  const [data, setData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    profilePhoto: null,
  });

  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Load token and decode email
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        setAdminToken(token);
        const decoded: any = jwtDecode(token);
        if (decoded?.email) setAdminEmail(decoded.email);
        else toast.error("Token missing email");
      } catch (error) {
        toast.error("Invalid token");
        console.error("Token decode error:", error);
      }
    } else {
      toast.error("No token found");
    }
  }, []);

  // Fetch profile
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
        setData({
          firstName: json.data.firstName || "",
          lastName: json.data.lastName || "",
          email: json.data.email || "",
          mobile: json.data.mobile || "",
          profilePhoto: json.data.profile || null,
        });
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
    fetchProfile();
  }, [fetchProfile]);

  // Update profile info
  const handleUpdateInfo = async () => {
    if (!adminToken) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/updateAdmin`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          mobile: data.mobile,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Profile updated successfully");
        setIsEditModalOpen(false);
      } else {
        toast.error(json.message || "Failed to update profile");
      }
    } catch {
      toast.error("Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Upload profile photo - Separate endpoint
  const handleImageUpload = async (file: File) => {
    if (!adminToken || !file || !adminEmail) {
      toast.error("Missing required data");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG/JPEG/PNG images are allowed");
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Maximum file size is 5MB");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("profile", file);
      formData.append("email", adminEmail);

      const res = await fetch(`${API_URL}/uploadProfile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: formData,
      });

      // First check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(
          `Server returned ${res.status}: ${text.substring(0, 100)}`,
        );
      }

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to update profile photo");
      }

      toast.success("Profile photo updated successfully");
      setData((prev) => ({
        ...prev,
        profilePhoto: json.profileUrl || json.data?.profileUrl,
      }));
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Error updating profile photo",
      );
    } finally {
      setIsLoading(false);
    }
  };
  if (isProfileLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your account information and profile photo
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
          <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
            {/* Profile Photo */}
            <div className="absolute -bottom-16 left-8 transform">
              <div className="relative h-32 w-32 rounded-full border-4 border-white bg-white shadow-lg dark:border-gray-800 dark:bg-gray-700">
                {data.profilePhoto ? (
                  <Image
                    src={data.profilePhoto}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="h-full w-full rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-5xl text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    <CiUser />
                  </div>
                )}
                <label className="hover:bg-primary-dark absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary shadow-md transition">
                  <CameraIcon className="h-5 w-5 text-white" />
                  <input
                    type="file"
                    accept="image/png,image/jpg,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImageUpload(e.target.files[0]);
                        e.target.value = "";
                      }
                    }}
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-16 px-8 pb-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Personal Information
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      First Name
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {data.firstName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Last Name
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {data.lastName || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Contact Information
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {data.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Mobile
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {data.mobile || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="hover:bg-primary-dark rounded-lg bg-primary px-6 py-2 font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 dark:focus:ring-offset-gray-800"
                disabled={isLoading}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Info Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800">
            <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Profile
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-gray-600 dark:text-gray-300">
              Update your personal information
            </Dialog.Description>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  value={data.firstName}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  value={data.lastName}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mobile
                </label>
                <input
                  type="tel"
                  value={data.mobile}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, mobile: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
 
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleUpdateInfo}
                className="hover:bg-primary-dark rounded-lg bg-primary px-4 py-2 font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 dark:focus:ring-offset-gray-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
