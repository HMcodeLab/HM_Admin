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

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const noLayoutRoutes = ["/auth/sign-in", "/auth/sign-up"];
  const isAuthPage = noLayoutRoutes.includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      setIsLoggedIn(true);
    } else if (!isAuthPage) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true); // allow auth pages
    }
  }, [pathname]);

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
          {/* Spinner */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>

          {/* Loading Text */}
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
          {/* Sidebar - Fixed Width, No Scroll Effect */}
          <div className="w-74 flex-shrink-0 bg-white dark:bg-[#0c1a2b]">
            <Sidebar userRole="superAdmin" />
          </div>

          {/* Right Side - Scrollable Content */}
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
