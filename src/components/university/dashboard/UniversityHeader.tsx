"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import { Users, BookOpen, GraduationCap, DollarSign, Calendar, Building, Award, BarChart3, Library, Clock } from "lucide-react";

export function UniversityHeader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  const stats = [
    {
      label: "Total Students",
      value: "12,458",
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      trend: "+5% this semester",
      description: "Enrolled students"
    },
    {
      label: "Academic Programs",
      value: "142",
      icon: BookOpen,
      color: "from-green-600 to-emerald-600",
      trend: "8 new programs",
      description: "Degrees & courses"
    },
    {
      label: "Faculty Members",
      value: "856",
      icon: GraduationCap,
      color: "from-purple-600 to-pink-600",
      trend: "+24 hires",
      description: "Teaching staff"
    },
    {
      label: "Annual Budget",
      value: "$48.2M",
      icon: DollarSign,
      color: "from-amber-600 to-orange-600",
      trend: "On track",
      description: "Fiscal year 2024"
    },
  ];

  const quickActions = [
    { icon: BookOpen, label: "Academic Calendar", color: "bg-blue-500/20", hover: "hover:bg-blue-500/30" },
    { icon: Users, label: "Student Portal", color: "bg-green-500/20", hover: "hover:bg-green-500/30" },
    { icon: GraduationCap, label: "Faculty Management", color: "bg-purple-500/20", hover: "hover:bg-purple-500/30" },
    { icon: BarChart3, label: "Analytics", color: "bg-amber-500/20", hover: "hover:bg-amber-500/30" },
  ];

  const upcomingEvents = [
    { time: "10:00 AM", title: "Faculty Meeting", location: "Main Hall", type: "Meeting" },
    { time: "02:30 PM", title: "Research Symposium", location: "Science Building", type: "Event" },
    { time: "04:00 PM", title: "Student Orientation", location: "Auditorium", type: "Orientation" },
  ];

  const departments = [
    { name: "Engineering", students: "3,245", color: "bg-blue-500/20" },
    { name: "Business", students: "2,856", color: "bg-green-500/20" },
    { name: "Arts & Sciences", students: "4,125", color: "bg-purple-500/20" },
    { name: "Medicine", students: "1,892", color: "bg-red-500/20" },
  ];

  return (
    <div className="min-h-screen p-4 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/80 dark:bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-lg">
              <Building className="text-blue-600 dark:text-blue-400" size={36} />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                University Dashboard
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Excellence in Education, Innovation in Research
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-2xl"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Welcome to University Administration</h3>
            <p className="text-blue-100 max-w-2xl">
              Managing academic excellence, student success, and institutional growth. 
              Track key metrics and drive the future of education.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-24 translate-y-24"></div>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="relative rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity`}></div>
                
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg mb-4`}>
                  <item.icon className="text-white" size={24} />
                </div>

                {/* Content */}
                <div className="relative">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {item.label}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {item.value}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </span>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      {item.trend}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Middle Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Administrative Tools
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:scale-105 group ${action.hover}`}
                  >
                    <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                      <action.icon className="text-gray-700 dark:text-gray-300" size={20} />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Departments Overview */}
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                  Departments Overview
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {departments.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-white/20">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {dept.name}
                      </span>
                      <span className="text-xs bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                        {dept.students}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                University Events
              </h3>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-white/20">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {event.time} • {event.location}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Academic Excellence Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {/* Research Metrics */}
          <div className="rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-green-600 dark:text-green-400" size={20} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Academic Excellence
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10">
                <span className="text-sm text-gray-700 dark:text-gray-300">Research Papers</span>
                <span className="font-bold text-green-600 dark:text-green-400">1,248</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10">
                <span className="text-sm text-gray-700 dark:text-gray-300">Grants Awarded</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">$12.8M</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10">
                <span className="text-sm text-gray-700 dark:text-gray-300">International Rankings</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">Top 50</span>
              </div>
            </div>
          </div>

          {/* Library Stats */}
          <div className="rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Library className="text-amber-600 dark:text-amber-400" size={20} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Library Resources
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-amber-500/10">
                <span className="text-sm text-gray-700 dark:text-gray-300">Digital Resources</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">45,821</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10">
                <span className="text-sm text-gray-700 dark:text-gray-300">Physical Books</span>
                <span className="font-bold text-red-600 dark:text-red-400">285,634</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-indigo-500/10">
                <span className="text-sm text-gray-700 dark:text-gray-300">Active Subscriptions</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">124</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}