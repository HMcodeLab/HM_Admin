"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import { Users, BookOpen, DollarSign, Activity, Award, Clock, Target, Star, Video, MessageCircle } from "lucide-react";

export function TrainerHeader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  const stats = [
    {
      label: "Total Students",
      value: "1,245",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      trend: "+42 this week",
      description: "Active learners"
    },
    {
      label: "My Courses",
      value: "12",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      trend: "3 ongoing",
      description: "Published courses"
    },
    {
      label: "Total Earnings",
      value: "$24,580",
      icon: DollarSign,
      color: "from-yellow-500 to-amber-500",
      trend: "+$2,400",
      description: "This month"
    },
    {
      label: "Completion Rate",
      value: "94%",
      icon: Award,
      color: "from-purple-500 to-pink-500",
      trend: "+5% growth",
      description: "Course completion"
    },
  ];

  const quickActions = [
    { icon: BookOpen, label: "Create Course", color: "bg-blue-500/20", hover: "hover:bg-blue-500/30" },
    { icon: Video, label: "Live Session", color: "bg-green-500/20", hover: "hover:bg-green-500/30" },
    { icon: MessageCircle, label: "Messages", color: "bg-purple-500/20", hover: "hover:bg-purple-500/30" },
    { icon: Users, label: "My Students", color: "bg-orange-500/20", hover: "hover:bg-orange-500/30" },
  ];

  const upcomingSessions = [
    { time: "10:00 AM", title: "React Advanced", students: 24, type: "Live" },
    { time: "02:30 PM", title: "JavaScript Basics", students: 18, type: "Workshop" },
    { time: "04:00 PM", title: "Q&A Session", students: 32, type: "Discussion" },
  ];

  const performanceMetrics = [
    { label: "Student Satisfaction", value: "4.8", icon: Star, color: "text-yellow-500" },
    { label: "Course Rating", value: "4.9", icon: Award, color: "text-purple-500" },
    { label: "Response Time", value: "2h", icon: Clock, color: "text-green-500" },
    { label: "Goals Achieved", value: "87%", icon: Target, color: "text-blue-500" },
  ];

  return (
    <div className="min-h-screen p-4 dark:from-gray-900 dark:via-orange-900 dark:to-red-900 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/80 dark:bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-lg">
              <Award className="text-orange-600 dark:text-orange-400" size={36} />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Trainer Dashboard
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Empower learners, share knowledge, grow your impact
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
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white shadow-2xl"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Welcome Back, Coach!</h3>
            <p className="text-orange-100 max-w-2xl">
              Your expertise is transforming lives. Continue inspiring your students with 
              engaging content and personalized guidance.
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
                Teaching Tools
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300 hover:scale-105 group ${action.hover}`}
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
            </div>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Today's Sessions
            </h3>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-white/20">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {session.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {session.time} • {session.students} students
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                    {session.type}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Teaching Performance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 hover:scale-105 transition-transform duration-300">
                <metric.icon className={`mx-auto mb-3 ${metric.color}`} size={28} />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {metric.value}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/20 p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-orange-600 dark:text-orange-400" size={24} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Achievements
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-white/5">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">5-Star Reviews</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-white/5">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">1K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Students Helped</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-white/5">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Courses Created</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}