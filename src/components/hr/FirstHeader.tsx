"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import { Users, Briefcase, DollarSign, Activity, UserPlus, Target, Clock, Award } from "lucide-react";

export function AdminHeader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  const stats = [
    {
      label: "Total Employees",
      value: "1,245",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      trend: "+12%",
      description: "Active workforce"
    },
    {
      label: "Open Positions",
      value: "58",
      icon: Briefcase,
      color: "from-green-500 to-emerald-500",
      trend: "+5",
      description: "Hiring required"
    },
    {
      label: "Payroll Processed",
      value: "$24,580",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
      trend: "On time",
      description: "This month"
    },
    {
      label: "New Hires",
      value: "92",
      icon: UserPlus,
      color: "from-pink-500 to-rose-500",
      trend: "+8%",
      description: "Last 30 days"
    },
  ];

  const quickActions = [
    { icon: UserPlus, label: "Recruit", color: "bg-blue-500/20" },
    { icon: Briefcase, label: "Jobs", color: "bg-green-500/20" },
    { icon: DollarSign, label: "Payroll", color: "bg-yellow-500/20" },
    { icon: Users, label: "Team", color: "bg-purple-500/20" },
  ];

  const upcomingEvents = [
    { time: "10:00 AM", title: "Team Standup", type: "Meeting" },
    { time: "02:30 PM", title: "Candidate Interview", type: "Interview" },
    { time: "04:00 PM", title: "Payroll Review", type: "Finance" },
  ];

  return (
    <div className="min-h-screen  p-4 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/80 dark:bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-lg">
              <Users className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HR Dashboard
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Managing talent, driving growth
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
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white shadow-2xl"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Welcome to HR Command Center</h3>
            <p className="text-blue-100 max-w-2xl">
              Streamline your HR operations, track employee engagement, and drive organizational 
              success with comprehensive people analytics.
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

        {/* Bottom Section */}
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
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:scale-105 group"
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

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Today's Schedule
            </h3>
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
                      {event.time} • {event.type}
                    </p>
                  </div>
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            HR Performance Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <Target className="mx-auto text-green-600 dark:text-green-400 mb-2" size={24} />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">94%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Goals Met</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Award className="mx-auto text-blue-600 dark:text-blue-400 mb-2" size={24} />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">87%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Engagement</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Users className="mx-auto text-purple-600 dark:text-purple-400 mb-2" size={24} />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">32</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Training</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Activity className="mx-auto text-orange-600 dark:text-orange-400 mb-2" size={24} />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">99%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Compliance</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}