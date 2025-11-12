"use client";

import React from "react";
import { Shield, Settings, BarChart3, Users, BookOpen, TrendingUp } from "lucide-react";

export function AdminHeader() {
  const features = [
    {
      icon: Users,
      title: "User Management",
      description: "Manage all users, roles, and permissions in one place",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: BookOpen,
      title: "Course Management",
      description: "Create, edit, and organize your course content",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track performance metrics and user engagement",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: TrendingUp,
      title: "Growth Insights",
      description: "Monitor platform growth and revenue trends",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10"
    }
  ];

  const quickActions = [
    { icon: Settings, label: "Settings", description: "Platform configuration" },
    { icon: Shield, label: "Security", description: "Security and permissions" },
    { icon: Users, label: "Users", description: "Manage user accounts" },
    { icon: BookOpen, label: "Courses", description: "Content management" }
  ];

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Your command center for managing the entire platform with powerful tools and insights
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome Back, Admin!</h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
              You're now in control of your platform's ecosystem. Monitor performance, 
              manage content, and drive growth with our comprehensive admin tools. 
              Everything you need to succeed is right here at your fingertips.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl ${feature.bgColor} backdrop-blur-xl border border-white/20 p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 text-left transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <action.icon className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{action.label}</h4>
                  <p className="text-gray-400 text-sm">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Platform Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">1.2K</div>
                <div className="text-blue-300 text-sm">Active Users</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">58</div>
                <div className="text-green-300 text-sm">Courses</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">92%</div>
                <div className="text-yellow-300 text-sm">Satisfaction</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-purple-300 text-sm">Uptime</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Performance</span>
                <span className="text-green-400 font-semibold">Excellent</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Security</span>
                <span className="text-green-400 font-semibold">Protected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Updates</span>
                <span className="text-blue-400 font-semibold">Current</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}