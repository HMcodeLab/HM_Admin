"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fetchEnquiries } from "@/api/api";
import {
  parseISO,
  format,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  isSameWeek,
  isSameMonth,
} from "date-fns";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const EnrolledChart = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM"),
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [seriesData, setSeriesData] = useState<
    { name: string; data: number[] }[]
  >([]);
  const { theme } = useTheme();

  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEnquiries(adminToken || "");
        setEnquiries(data);
      } catch (error) {
        toast.error("Failed to fetch enquiries");
      } finally {
        setIsLoading(false); // Set loading false after fetch completes
      }
    };

    fetchData();
  }, [adminToken]);

  useEffect(() => {
    if (!enquiries.length) return;

    const selectedDate = parseISO(`${selectedMonth}-01`);
    const weeks = eachWeekOfInterval({
      start: startOfMonth(selectedDate),
      end: endOfMonth(selectedDate),
    });

    const weeklyData = weeks.map((weekStart: Date) => {
      const count = enquiries.filter((item: any) => {
        const dateString = item.createdAt || item.date || item.timestamp;
        if (!dateString || typeof dateString !== "string") return false;

        const createdAt = parseISO(dateString);
        return (
          isSameMonth(createdAt, selectedDate) &&
          isSameWeek(createdAt, weekStart, { weekStartsOn: 1 })
        );
      }).length;

      return {
        label: `Week of ${format(weekStart, "dd MMM")}`,
        count,
      };
    });

    setCategories(weeklyData.map((d) => d.label));
    setSeriesData([
      { name: "Enrollments", data: weeklyData.map((d) => d.count) },
    ]);
  }, [enquiries, selectedMonth]);

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(new Date().getFullYear(), i);
    return {
      value: format(date, "yyyy-MM"),
      label: format(date, "MMMM yyyy"),
    };
  });

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      id: "enrollments",
      toolbar: { show: false },
      foreColor: theme === "dark" ? "#e5e7eb" : "#1f2937",
      background: theme === "dark" ? "#18181b" : "#ffffff",
    },
    xaxis: {
      categories,
      labels: {
        rotate: -45,
        style: { fontSize: "12px" },
      },
      axisBorder: {
        show: true,
        color: theme === "dark" ? "#4b5563" : "#d1d5db",
      },
      axisTicks: {
        show: true,
        color: theme === "dark" ? "#4b5563" : "#d1d5db",
      },
    },
    yaxis: {
      title: { text: "Enrollments", style: { fontSize: "12px" } },
      min: 0,
      forceNiceScale: true,
      labels: { style: { fontSize: "12px" } },
      axisBorder: {
        show: true,
        color: theme === "dark" ? "#4b5563" : "#d1d5db",
      },
      axisTicks: {
        show: true,
        color: theme === "dark" ? "#4b5563" : "#d1d5db",
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        colors: [theme === "dark" ? "#e5e7eb" : "#1f2937"],
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        borderRadius: 4,
        padding: 4,
        opacity: 0.8,
      },
    },
    tooltip: {
      theme: theme === "dark" ? "dark" : "light",
    },
    grid: {
      borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
      strokeDashArray: 4,
    },
    theme: {
      mode: theme === "dark" ? "dark" : "light",
      palette: "palette1",
    },
    colors: ["#6366f1"],
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  // 🚫 Don't render anything until data is fetched
  if (isLoading) return null;

  return (
    <div
      className="mx-auto mt-12 max-w-7xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900 sm:p-8"
      style={{
        color: theme === "dark" ? "#e5e7eb" : "#1f2937",
      }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2
          className="text-2xl font-extrabold sm:text-xl"
          style={{ color: theme === "dark" ? "#ffff" : "#000000" }}
        >
          Weekly Enrollments
        </h2>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className={`w-full max-w-xs rounded-md border px-4 py-2 transition-colors sm:w-auto ${
            theme === "dark"
              ? "border-indigo-600 text-indigo-300 dark:bg-gray-900 hover:dark:bg-gray-900"
              : "border-indigo-300 bg-indigo-100 text-white hover:bg-indigo-200"
          }`}
          aria-label="Select Month"
        >
          {monthOptions.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[320px] w-full dark:bg-gray-900 sm:h-[420px] md:h-[480px]">
        <ApexChart
          options={chartOptions}
          series={seriesData}
          type="line"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
};

export default EnrolledChart;
