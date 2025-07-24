"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import {
  fetchEnquiries,
  fetchCoursesForAdmin,
  fetchUniversityCount,
  fetchPayments,
} from "@/api/api";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import Loader from "@/components/Loader";

export function OverviewCardsGroup() {
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [activeCoursesCount, setActiveCoursesCount] = useState(0);
  const [inactiveCoursesCount, setInactiveCoursesCount] = useState(0);
  const [universityCount, setUniversityCount] = useState(0);
  const [totalEarning, setTotalEarning] = useState(0);
  const [overviewData, setOverviewData] = useState({
    views: { value: 0, growthRate: 0 },
    profit: { value: 0, growthRate: 0 },
    products: { value: 0, growthRate: 0 },
    users: { value: 0, growthRate: 0 },
  });
  const [loading, setLoading] = useState(true);

  // ⏳ Retry wrapper for unstable API (502 errors etc.)
  const retryUniversityFetch = async (token: string, retries = 2) => {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await fetchUniversityCount(token);
        if (result?.length) return result;
      } catch (err) {
        console.warn(`University fetch retry ${i + 1} failed`);
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Admin token not found");
        setLoading(false);
        return;
      }

      try {
        const [enquiries, courses, overview, universities, payments] =
          await Promise.all([
            fetchEnquiries(token),
            fetchCoursesForAdmin(token),
            getOverviewData(),
            retryUniversityFetch(token),
            fetchPayments(token),
          ]);

        setEnrolledCount(enquiries.length);
        setCoursesCount(courses.length);

        const active = courses.filter((c: any) => c.display === true);
        const inactive = courses.filter((c: any) => c.display === false);
        setActiveCoursesCount(active.length);
        setInactiveCoursesCount(inactive.length);

        setUniversityCount(universities.length);

        const totalAmount = payments.reduce((sum: number, order: any) => {
          const success = order?.paymentStauts?.status === "success";
          const amount = parseFloat(
            order?.payemntData?.["Total Amount"] || "0",
          );
          return success ? sum + amount : sum;
        }, 0);
        setTotalEarning(totalAmount);

        setOverviewData(overview);
      } catch (error: any) {
        console.error("❌ Error loading dashboard:", error.message);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Enrolled Student's"
        data={{
          ...overviewData.views,
          value: compactFormat(enrolledCount),
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Total Courses"
        data={{
          ...overviewData.profit,
          value: compactFormat(coursesCount),
          active: compactFormat(activeCoursesCount),
          inactive: compactFormat(inactiveCoursesCount),
        }}
        Icon={icons.Users}
      />

      <OverviewCard
        label="Total University"
        data={{
          value: compactFormat(universityCount),
          growthRate: 0,
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Total Earning"
        data={{
          value: `₹${totalEarning.toLocaleString("en-IN")}`,
          growthRate: 0,
        }}
        Icon={icons.Profit}
      />
    </div>
  );
}
