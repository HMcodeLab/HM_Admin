"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOutIcon, UserIcon } from "./icons";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { CiUser } from "react-icons/ci";

const API_URL = process.env.NEXT_PUBLIC_SERVER_DOMAIN;

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    name: "Loading...",
    email: "",
    profilePhoto: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      toast.error("No token found");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const email = decoded?.email;

      if (!email) {
        toast.error("Email not found in token");
        return;
      }

      const fetchUser = async () => {
        try {
          const res = await fetch(
            `${API_URL}/admin?email=${encodeURIComponent(email)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );

          const data = await res.json();

          if (data?.success && data?.data) {
            setUser({
              name: data.data.firstName || "Super Admin",
              email: data.data.email || "",
              profilePhoto: data.data.profile || "",
            });
          } else {
            toast.error(data.message || "Failed to fetch user data");
          }
        } catch (error) {
          toast.error("Error fetching user data");
          console.error("Fetch error:", error);
        }
      };

      fetchUser();
    } catch (err) {
      toast.error("Invalid token");
      console.error("Token decode error:", err);
    }
  }, []);

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          {user?.profilePhoto ? (
            <Image
              src={user.profilePhoto}
              className="size-12 rounded-full object-cover"
              alt={`Avatar of ${user.name}`}
              role="presentation"
              width={200}
              height={200}
              unoptimized
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-full bg-gray-200 text-2xl text-gray-500 dark:bg-gray-700 dark:text-white">
              <CiUser />
            </div>
          )}
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{user.name}</span>
            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={user.profilePhoto || "/images/user/user-03.png"}
            className="size-12"
            alt={`Avatar of ${user.name}`}
            role="presentation"
            width={200}
            height={200}
            unoptimized
          />
          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {user.name}
            </div>
            <div className="leading-none text-gray-6">{user.email}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />
            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={() => {
              setIsOpen(false);
              localStorage.removeItem("adminToken");
              window.location.href = "/auth/sign-in";
            }}
          >
            <LogOutIcon />
            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
