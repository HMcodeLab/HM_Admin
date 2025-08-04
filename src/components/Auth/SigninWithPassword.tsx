"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import React, { useState, useEffect } from "react";
import InputGroup from "../FormElements/InputGroup";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { FaLock, FaLockOpen } from "react-icons/fa";

export default function SigninWithPassword() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [data, setData] = useState({
    email:
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_DEMO_USER_MAIL || ""
        : "",
    password:
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_DEMO_USER_PASS || ""
        : "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (Cookies.get("adminToken")) {
      router.push("/");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!data.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!data.password) {
      setError("Password is required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/loginAdminWithEmail`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid email or password");
      }

      const result = await response.json();

      localStorage.setItem("adminToken", result.token);
      Cookies.set("adminToken", result.token, {
        expires: data.remember ? 7 : 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      try {
        const payload = JSON.parse(atob(result.token.split(".")[1]));
        if (payload.exp) {
          localStorage.setItem("tokenExpiry", payload.exp.toString());
        }
      } catch (err) {
        console.error("Token decoding error:", err);
      }

      toast.success("Login successful!");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-in rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-8"
    >
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
        Welcome Back
      </h2>
      <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
        Sign in to access your dashboard
      </p>

      <div className="space-y-4">
        <InputGroup
          type="email"
          label="Email"
          placeholder="your@email.com"
          name="email"
          handleChange={handleChange}
          value={data.email}
          icon={<EmailIcon className="h-5 w-5" />}
          required
        />
        <div className="relative">
          <InputGroup
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="••••••••"
            name="password"
            handleChange={handleChange}
            value={data.password}
            icon={
              showPassword ? (
                <FaLockOpen
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <FaLock
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )
            }
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-6 w-full rounded-xl bg-primary px-6 py-3 font-semibold text-white transition duration-300 hover:bg-opacity-90 ${
          loading ? "cursor-not-allowed opacity-70" : ""
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </button>

      {error && (
        <p className="animate-shake mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
