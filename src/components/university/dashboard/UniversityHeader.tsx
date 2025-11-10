"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import { Users, ShoppingBag, DollarSign, Activity } from "lucide-react";

export function UniversityHeader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  const stats = [
    {
      label: "Total Users",
      value: "1,245",
      icon: Users,
      color: "from-blue-500/80 to-indigo-500/80",
    },
    {
      label: "Active Courses",
      value: "58",
      icon: ShoppingBag,
      color: "from-green-400/80 to-emerald-500/80",
    },
    {
      label: "Total Revenue",
      value: "$24,580",
      icon: DollarSign,
      color: "from-yellow-400/80 to-orange-500/80",
    },
    {
      label: "New Enrollments",
      value: "92",
      icon: Activity,
      color: "from-pink-400/80 to-rose-500/80",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-950 sm:p-6 lg:p-8">
      {/* Title Section */}
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
          University Dashboard
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of platform insights and activities
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`relative rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-xl transition-transform hover:scale-[1.02] dark:bg-white/5`}
          >
            {/* Icon */}
            <div
              className={`absolute right-0 top-0 -translate-y-4 translate-x-4 rounded-full bg-gradient-to-r p-4 ${item.color} shadow-md`}
            >
              <item.icon className="text-white" size={26} />
            </div>

            {/* Content */}
            <div className="pt-6">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {item.label}
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
