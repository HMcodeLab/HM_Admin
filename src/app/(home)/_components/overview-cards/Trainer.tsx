"use client";

import type { JSX, SVGProps, ComponentType } from "react";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Loader from "@/components/Loader";

type PropsType = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  onClick?: () => void;
};

export function Trainer({ label, Icon, onClick }: PropsType) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const compactFormat = (num: number | string | undefined) => {
    if (!num) return "0";
    if (typeof num === "string") num = parseInt(num);
    return Intl.NumberFormat("en", { notation: "compact" }).format(num);
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("No token found");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded) {
        setError("Invalid token");
        setLoading(false);
        return;
      }

      const fetchDashboardData = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/instructors`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!res.ok) throw new Error("Failed to fetch data");

          const result = await res.json();
          console.log("✅ Instructors data:", result);

          if (result?.success && Array.isArray(result.data)) {
            setCount(result.data.length); // ✅ Instructor count here
          } else {
            setError("Invalid data format from API");
          }
        } catch (err) {
          console.error("Error fetching instructors:", err);
          setError("Failed to load data");
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    } catch (err) {
      console.error("Invalid token:", err);
      setError("Invalid token");
      setLoading(false);
    }
  }, [token]);

  const growthRate = count > 0 ? 5 : 0;
  const isDecreasing = growthRate < 0;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark hover:shadow-lg transition"
    >
      <div className="flex items-center justify-between">
        <Icon className="h-6 w-6 text-primary" />
        <span
          className={`text-sm font-medium ${
            isDecreasing ? "text-red-500" : "text-green-500"
          }`}
        >
          {isDecreasing ? "↓" : "↑"} {Math.abs(growthRate)}%
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <dl>
            <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
              {compactFormat(count)} {/* ✅ show total instructors */}
            </dt>
            <dd className="text-sm font-medium text-dark-6">{label}</dd>
          </dl>
        )}
      </div>
    </div>
  );
}
