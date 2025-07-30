"use client";

import Signin from "@/components/Auth/Signin";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.push("/");
    } else {
      setCheckingAuth(false);
    }
  }, [router]); // <-- add router here

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
          Checking authentication...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-white dark:bg-gray-dark">
      <div className="flex min-h-screen flex-wrap items-center justify-center shadow-1 dark:shadow-card">
        {/* Left side - Sign In Form */}
        <div className="flex w-full justify-center xl:w-1/2">
          <div className="w-full max-w-md p-4 sm:p-12 xl:p-15">
            <Signin />
          </div>
        </div>

        {/* Right side - Centered Content */}
        <div className="hidden w-full xl:flex xl:w-1/2 xl:items-center xl:justify-center">
          <div className="custom-gradient-1 flex flex-col items-center overflow-hidden rounded-2xl px-8 pt-12 text-center dark:!bg-dark-2 dark:bg-none">
            <Link className="mb-8 inline-block" href="/">
              <Image
                className="hidden dark:block"
                src="https://hopingminds.com/logo.png"
                alt="Logo"
                width={176}
                height={32}
              />
              <Image
                className="dark:hidden"
                src="https://sbs.ac.in/wp-content/uploads/2023/09/Asset-5.png"
                alt="Logo"
                width={176}
                height={32}
              />
            </Link>

            <p className="mb-2 text-xl font-medium text-dark dark:text-white">
              Sign in to your account
            </p>

            <h1 className="mb-2 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
              Welcome Back!
            </h1>
            <h1 className="mb-4 font-serif text-xl uppercase text-dark dark:text-green-600 sm:text-heading-3">
              Hoping minds
            </h1>

            <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
              Please sign in to your account by completing the necessary fields
              below
            </p>

            <div className="mt-8">
              <Image
                src="/images/grids/grid-02.svg"
                alt="Illustration"
                width={405}
                height={325}
                className="mx-auto dark:opacity-30"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
