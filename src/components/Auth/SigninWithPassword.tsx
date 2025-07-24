"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { useRouter } from "next/navigation";

export default function SigninWithPassword() {
  const router = useRouter();

  const [data, setData] = useState({
    email: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/loginAdminWithEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Invalid email or password. Please try again.");
      }

      const result = await response.json();

      // ✅ Save token
      localStorage.setItem("adminToken", result.token);

      // ✅ Save expiry time from JWT token
      try {
        const payload = JSON.parse(atob(result.token.split(".")[1]));
        if (payload.exp) {
          localStorage.setItem("tokenExpiry", payload.exp.toString());
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-in rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-8"
    >
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
        Sign In to Your Account
      </h2>

      <div className="space-y-4">
        <InputGroup
          type="email"
          label="Email"
          placeholder="Enter your email"
          name="email"
          handleChange={handleChange}
          value={data.email}
          icon={<EmailIcon />}
        />

        <div className="relative">
          <InputGroup
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            name="password"
            handleChange={handleChange}
            value={data.password}
            icon={
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                style={{
                  transform: showPassword ? "rotate(20deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              >
                <PasswordIcon />
              </button>
            }
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-primary px-6 py-3 font-semibold text-white transition duration-300 hover:bg-opacity-90 disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </button>

      {error && (
        <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
