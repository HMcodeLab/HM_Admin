"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const rolesList = ["hr", "admin", "superAdmin", "pap", "university"];

const RoleManagement = () => {
  const [activeTab, setActiveTab] = useState<"create" | "change">("create");

  // Shared fields
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const resetForm = () => {
    setEmail(""); 
    setName("");
    setPassword("");
    setSelectedRoles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password || selectedRoles.length === 0) {
      toast.error("Please fill all fields and select at least one role");
      return;
    }

    try {
      const res = await fetch("/api/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, roles: selectedRoles }),
      });

      if (res.ok) {
        toast.success("User created successfully");
        resetForm();
      } else {
        toast.error("Failed to create user");
      }
    } catch (err) {
      toast.error("Error creating user");
      console.error(err);
    }
  };

  const handleRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || selectedRoles.length === 0) {
      toast.error("Please provide an email and select roles");
      return;
    }

    try {
      const res = await fetch("/api/updateUserRole", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, roles: selectedRoles }),
      });

      if (res.ok) {
        toast.success("User role updated successfully");
        resetForm();
      } else {
        toast.error("Failed to update role");
      }
    } catch (err) {
      toast.error("Error updating role");
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-xl p-4">
      {/* Tab Buttons */}
      <div className="mb-6 flex justify-center gap-4">
        <button
          onClick={() => setActiveTab("create")}
          className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
            activeTab === "create"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white"
          }`}
        >
          Create New User
        </button>
        <button
          onClick={() => setActiveTab("change")}
          className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
            activeTab === "change"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white"
          }`}
        >
          Change User Role
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "create" ? (
          <motion.form
            key="create"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900"
          >
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
              Create New User
            </h2>

            <label className="mb-3 block">
              <span className="text-gray-700 dark:text-gray-300">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded border p-2 dark:bg-gray-700 dark:text-white"
                required
              />
            </label>

            <label className="mb-3 block">
              <span className="text-gray-700 dark:text-gray-300">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded border p-2 dark:bg-gray-700 dark:text-white"
                required
              />
            </label>

            <label className="mb-3 block">
              <span className="text-gray-700 dark:text-gray-300">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded border p-2 dark:bg-gray-700 dark:text-white"
                required
              />
            </label>

            <div className="mb-4">
              <span className="mb-1 block text-gray-700 dark:text-gray-300">
                Select Roles
              </span>
              <div className="flex flex-wrap gap-3">
                {rolesList.map((role) => (
                  <label key={role} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="accent-green-600"
                    />
                    <span className="capitalize text-gray-800 dark:text-gray-200">
                      {role}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded bg-green-600 py-2 font-medium text-white hover:bg-green-700"
            >
              Create User
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="change"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleRoleChange}
            className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900"
          >
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
              Change User Role
            </h2>

            <label className="mb-3 block">
              <span className="text-gray-700 dark:text-gray-300">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded border p-2 dark:bg-gray-700 dark:text-white"
                required
              />
            </label>

            <div className="mb-4">
              <span className="mb-1 block text-gray-700 dark:text-gray-300">
                Select New Roles
              </span>
              <div className="flex flex-wrap gap-3">
                {rolesList.map((role) => (
                  <label key={role} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="accent-green-600"
                    />
                    <span className="capitalize text-gray-800 dark:text-gray-200">
                      {role}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
            >
              Update Role
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleManagement;
