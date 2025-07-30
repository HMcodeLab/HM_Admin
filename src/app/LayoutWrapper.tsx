"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import NextTopLoader from "nextjs-toploader";
import toast from "react-hot-toast";

import "@/css/satoshi.css";
import "@/css/style.css";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";
import { jwtDecode } from "jwt-decode";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const noLayoutRoutes = ["/auth/sign-in", "/auth/sign-up"];
  const isAuthPage = noLayoutRoutes.includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const role = decoded?.role || decoded?.userRole || null;
        setUserRole(role);
        setIsLoggedIn(true);
        localStorage.setItem("userRole", role ?? "");
      } catch (error) {
        console.error("Token decoding failed:", error);
        setIsLoggedIn(false);
      }
    } else if (!isAuthPage) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [pathname, isAuthPage]);

  useEffect(() => {
    if (isLoggedIn === false && !isAuthPage) {
      toast.error("Please login to continue.");
      router.push("/auth/sign-in");
    }
  }, [isLoggedIn, isAuthPage, router]);

  useEffect(() => {
    if (isLoggedIn === false && !isAuthPage) {
      toast.error("Please login to continue.");
      router.push("/auth/sign-in");
    }
  }, [isLoggedIn, isAuthPage, router]);

  if (isLoggedIn === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
          <p className="text-lg text-gray-500 dark:text-gray-300">
            Welcome Back...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NextTopLoader color="#5750F1" showSpinner={false} />
      {isAuthPage ? (
        <main className="min-h-screen">{children}</main>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <div className="w-74 flex-shrink-0 bg-white dark:bg-[#0c1a2b]">
            {/* Pass empty string if userRole is null */}
            {/* <Sidebar userRole={userRole ?? ""} /> */}
            <Sidebar userRole="superAdmin" />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden bg-gray-2 dark:bg-[#020d1a]">
            <Header />
            <main className="isolate mx-auto w-full max-w-screen-2xl flex-1 overflow-y-auto p-4 md:p-6 2xl:p-10">
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
