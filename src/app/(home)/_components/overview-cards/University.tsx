"use client";

import type { JSX, SVGProps, ComponentType } from "react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Loader from "@/components/Loader";

type PropsType = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  onClick?: () => void;
};

interface DashboardData {
  total_colleges?: number;
}

export function University({ label, Icon, onClick }: PropsType) {
  const [data, setData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  // ✅ Compact number format (1.2K, 3.5M)
  const compactFormat = (num: number | string | undefined) => {
    if (!num) return "0";
    if (typeof num === "string") num = parseInt(num);
    return Intl.NumberFormat("en", { notation: "compact" }).format(num);
  };

  // ✅ Fetch data
  useEffect(() => {
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded) {
        setError("Invalid token");
        setLoading(false);
        return;
      }

      const fetchData = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/collegeUsers`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // ✅ Assuming response: { data: { data: [array of colleges] } }
          const collegeCount = res.data?.data?.length || 0;

          setData({ total_colleges: collegeCount });
        } catch (err) {
          console.error("Failed to fetch colleges:", err);
          setError("Failed to load data");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } catch (err) {
      console.error("Token error:", err);
      setError("Invalid token");
      setLoading(false);
    }
  }, [token]);

  const value = data.total_colleges;
  const growthRate = value && value > 0 ? 5 : 0;
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
              {compactFormat(value)}
            </dt>
            <dd className="text-sm font-medium text-dark-6">{label}</dd>
          </dl>
        )}
      </div>
    </div>
  );
}
