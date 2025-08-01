"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const rolesList = ["hr", "admin", "superAdmin", "pap", "university"];
const availableRoutes = [
  "dashboard",
  "users",
  "settings",
  "analytics",
  "reports",
];

const RoleManagement = () => {
  const [activeTab, setActiveTab] = useState<"create" | "change">("create");

  // Form States
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);

  // Update Role States
  const [searchRole, setSearchRole] = useState("");
  const [fetchedRoutes, setFetchedRoutes] = useState<string[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  // Reset form
  const resetForm = () => {
    setEmail("");
    setName("");
    setPassword("");
    setSelectedRole("");
    setSelectedRoutes([]);
    setSearchRole("");
    setFetchedRoutes([]);
  };

  // Toggle route selection
  const toggleRoute = (route: string) => {
    setSelectedRoutes((prev) =>
      prev.includes(route) ? prev.filter((r) => r !== route) : [...prev, route],
    );
  };

  // 🔹 Create Access Route (POST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || selectedRoutes.length === 0) {
      toast.error("Please select role and routes");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/addaccessroutes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({
            role: selectedRole,
            routes: selectedRoutes,
          }),
        },
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("✅ Access routes created successfully");
        resetForm();
      } else {
        toast.error(result.message || "Failed to create access routes");
      }
    } catch (error) {
      toast.error("❌ Something went wrong");
      console.error(error);
    }
  };

  // 🔹 Fetch Access Routes by Role (GET)
  const fetchRoutesByRole = async () => {
    if (!searchRole) {
      toast.error("Please enter a role");
      return;
    }
    setLoadingRoutes(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getaccessroute/${searchRole}`,
      );
      const result = await response.json();
      console.log("resultresultresultresult", result);
      if (response.ok) {
        setFetchedRoutes(result.routes || []);
        setSelectedRoutes(result.routes || []);
        toast.success("✅ Routes fetched");
      } else {
        toast.error(result.message || "No routes found");
        setFetchedRoutes([]);
      }
    } catch (error) {
      toast.error("❌ Failed to fetch routes");
      console.error(error);
    } finally {
      setLoadingRoutes(false);
    }
  };

  // 🔹 Update Access Routes (PUT)
  const handleUpdateRoutes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRole || selectedRoutes.length === 0) {
      toast.error("Please select role and routes");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/updateaccess`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({
            role: searchRole,
            routes: selectedRoutes,
          }),
        },
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("✅ Access routes updated successfully");
        resetForm();
      } else {
        toast.error(result.message || "Failed to update routes");
      }
    } catch (error) {
      toast.error("❌ Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-xl p-4">
      {/* Tabs */}
      <div className="mb-6 flex justify-center gap-4">
        <button
          onClick={() => setActiveTab("create")}
          className={`rounded-full px-6 py-2 font-semibold ${
            activeTab === "create"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
          }`}
        >
          Create Access Route
        </button>
        <button
          onClick={() => setActiveTab("change")}
          className={`rounded-full px-6 py-2 font-semibold ${
            activeTab === "change"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
          }`}
        >
          Update Access Route
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "create" ? (
          // CREATE ROUTES
          <motion.form
            key="create"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900"
          >
            <h2 className="mb-4 text-xl font-bold dark:text-white">
              Create Access Routes
            </h2>

            <div className="mb-3">
              <p className="mb-1 font-medium dark:text-white">Select Role</p>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded border p-2 dark:bg-gray-700 dark:text-white"
              >
                <option value="">-- Select Role --</option>
                {rolesList.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <p className="mb-1 font-medium dark:text-white">Select Routes</p>
              <div className="flex flex-wrap gap-3">
                {availableRoutes.map((route) => (
                  <label key={route} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRoutes.includes(route)}
                      onChange={() => toggleRoute(route)}
                      className="accent-green-600"
                    />
                    <span className="capitalize dark:text-white">{route}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700"
            >
              Create Access
            </button>
          </motion.form>
        ) : (
          // UPDATE ROUTES
          <motion.form
            key="change"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleUpdateRoutes}
            className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900"
          >
            <h2 className="mb-4 text-xl font-bold dark:text-white">
              Update Access Routes
            </h2>

            <div className="mb-3 flex gap-2">
              <input
                type="text"
                placeholder="Enter Role..."
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
                className="flex-1 rounded border p-2 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={fetchRoutesByRole}
                className="rounded bg-blue-600 px-4 text-white hover:bg-blue-700"
              >
                {loadingRoutes ? "Loading..." : "Fetch"}
              </button>
            </div>

            {fetchedRoutes.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 font-medium dark:text-white">
                  Update Routes
                </p>
                <div className="flex flex-wrap gap-3">
                  {availableRoutes.map((route) => (
                    <label
                      key={route}
                      className="inline-flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoutes.includes(route)}
                        onChange={() => toggleRoute(route)}
                        className="accent-green-600"
                      />
                      <span className="capitalize dark:text-white">
                        {route}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
            >
              Update Access
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleManagement;
