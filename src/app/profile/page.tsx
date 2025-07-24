"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CameraIcon } from "./_components/icons";
import { Dialog } from "@headlessui/react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { CiUser } from "react-icons/ci";

const API_URL = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "";

type UserData = {
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  profilePhoto: string | null;
  coverPhoto: string | null;
};

export default function Page() {
  const [data, setData] = useState<UserData>({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    profilePhoto: null,
    coverPhoto:
      "https://media.licdn.com/dms/image/v2/D4D16AQF0bPXbyhMSKg/profile-displaybackgroundimage-shrink_200_800/0/1664786802828?e=2147483647&v=beta&t=riaFhspZg5BsbexzfRryy4PvhwXT5TrD7N5JpY2ATwU",
  });

  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Load token & decode email on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    console.log("Token from localStorage:", token);
    if (token) {
      try {
        setAdminToken(token);
        const decoded: any = jwtDecode(token);
        console.log("Decoded token:", decoded);
        if (decoded && decoded.email) setAdminEmail(decoded.email);
        else toast.error("Token missing email");
      } catch (error) {
        toast.error("Invalid token");
        console.error("Token decode error:", error);
      }
    } else {
      toast.error("No token found");
    }
  }, []);

  // Fetch user profile when email and token available
  useEffect(() => {
    if (!adminEmail || !adminToken) return;

    async function fetchUserProfile() {
      try {
        const emailToEncode = adminEmail ?? "";
        const res = await fetch(
          `${API_URL}/admin?email=${encodeURIComponent(emailToEncode)}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        const json = await res.json();

        if (res.ok && json.success && json.data) {
          toast.success("Admin data fetched successfully!");
          setData({
            name:
              (json.data.firstName || "") + " " + (json.data.lastName || "") ||
              "Super Admin",
            firstName: json.data.firstName || "",
            lastName: json.data.lastName || "",
            email: json.data.email || "",
            mobile: json.data.mobile || "",
            profilePhoto: json.data.profile || null,
            coverPhoto: data.coverPhoto,
          });
        } else {
          toast.error(json.message || "Failed to fetch admin data");
        }
      } catch (error) {
        toast.error("Error fetching admin data");
        console.error("Fetch error:", error);
      }
    }

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminEmail, adminToken]);

  // Handle profile info update
  const handleUpdate = async () => {
    if (!adminToken) {
      toast.error("No admin token found.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/updateAdmin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          mobile: data.mobile,
        }),
      });

      const json = await response.json();
      console.log("Update response:", json);

      if (response.ok && (json.success === true || json.data || json.updated)) {
        toast.success("Admin profile updated successfully!");
        setIsOpen(false);
        setData((prev) => ({
          ...prev,
          name: `${data.firstName} ${data.lastName}`,
        }));
      } else {
        toast.error(json.message || "Failed to update admin data");
      }
    } catch (error) {
      toast.error("Error updating admin data");
      console.error("Update error:", error);
    }
  };

  // Handle profile photo upload & update
const handleProfilePhotoChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const file = e.target.files?.[0];
  if (!file || !adminToken) return;

  // Check file size before uploading (e.g., 5MB)
  const MAX_SIZE_MB = 5;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    toast.error(`Image too large. Max ${MAX_SIZE_MB}MB allowed.`);
    return;
  }

  try {
    const formData = new FormData();
    formData.append("profile", file);

    const res = await fetch(`${API_URL}/updateAdmin`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      body: formData,
    });

    const json = await res.json();

    if (res.status === 413) {
      toast.error("Image too large to upload. Server rejected the request.");
      return;
    }

    if (res.ok && (json.success === true || json.data || json.updated)) {
      toast.success("Profile photo updated");

      if (json.data?.profile) {
        setData((prev) => ({ ...prev, profilePhoto: json.data.profile }));
      }

      setIsOpen(false);
    } else {
      toast.error(json.message || "Failed to update profile photo");
    }
  } catch (error: any) {
    if (error.message.includes("413")) {
      toast.error("Server rejected the upload — image too large.");
    } else {
      toast.error("Error updating profile photo");
    }
    console.error("Upload error:", error);
  }
};


  // Fix cover photo fallback
  // const coverPhotoUrl =
  //   data.coverPhoto && data.coverPhoto !== ""
  //     ? data.coverPhoto
  //     : "https://via.placeholder.com/970x260?text=Cover+Photo";

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-900 dark:shadow-card">
        {/* Cover Photo */}
        <div className="relative z--20 h-[140px] md:h-[260px]">
          <Image
            src="/images/banner.png"
            alt="Cover Photo"
            width={400}
            height={260}
            className="h-full w-full rounded-xl object-fill p-2"
          />
        </div>

        {/* Profile Section */}
        <div className="px-4 pb-6 text-center">
          <div className="relative mx-auto -mt-22 flex h-44 w-44 items-center justify-center rounded-full bg-white/20 p-2 backdrop-blur">
            <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-primary">
              {data.profilePhoto ? (
                <Image
                  src={data.profilePhoto}
                  width={160}
                  height={160}
                  className="h-full w-full rounded-full object-cover"
                  alt="Profile"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-4xl text-gray-500 dark:bg-gray-700 dark:text-white">
                  <CiUser />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
              {data.name || "Loading..."}
            </h3>
            <p className="font-medium dark:text-white">{data.email}</p>

            <button
              onClick={() => setIsOpen(true)}
              className="mt-4 rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="flex h-screen items-center justify-center p-4">
          <Dialog.Panel className="relative w-full max-w-md rounded bg-white p-6 shadow-lg dark:bg-gray-900">
            <Dialog.Title className="text-center text-xl font-bold text-dark dark:text-white">
              Edit Admin Info
            </Dialog.Title>

            {/* Profile Image Section */}
            <div className="relative mt-4 flex justify-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-primary">
                {data.profilePhoto ? (
                  <Image
                    src={data.profilePhoto}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                    unoptimized={true}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                    No Image
                  </div>
                )}
                <label
                  htmlFor="modalProfileUpload"
                  className="absolute bottom-4 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white"
                >
                  <CameraIcon className="h-4 w-4" />
                  <input
                    id="modalProfileUpload"
                    name="profilePhoto"
                    type="file"
                    className="sr-only"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={handleProfilePhotoChange}
                  />
                </label>
              </div>
            </div>

            {/* Input Fields */}
            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full rounded border border-gray-300 bg-white p-2 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                value={data.firstName}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, firstName: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full rounded border border-gray-300 bg-white p-2 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                value={data.lastName}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, lastName: e.target.value }))
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded border border-gray-300 bg-white p-2 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                value={data.email}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Mobile"
                className="w-full rounded border border-gray-300 bg-white p-2 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                value={data.mobile}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, mobile: e.target.value }))
                }
              />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded bg-gray-300 px-4 py-2 dark:bg-gray-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="rounded bg-primary px-4 py-2 text-white"
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
