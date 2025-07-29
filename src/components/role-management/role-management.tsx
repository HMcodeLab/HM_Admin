"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const rolesList = ["hr", "admin", "superAdmin", "pap", "university"];

const RoleManagement = () => {
  const [activeTab, setActiveTab] = useState<"create" | "change">("create");

  // Form States
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔹 Static Users for Testing
  const [users] = useState([
    { email: "john@example.com", roles: ["admin"] },
    { email: "mary@example.com", roles: ["hr", "pap"] },
    { email: "alex@example.com", roles: ["superAdmin"] },
    { email: "lisa@example.com", roles: ["university"] },
    { email: "john@example.com", roles: ["admin"] },
    { email: "mary@example.com", roles: ["hr", "pap"] },
    { email: "alex@example.com", roles: ["superAdmin"] },
    { email: "lisa@example.com", roles: ["university"] },
    { email: "john@example.com", roles: ["admin"] },
    { email: "mary@example.com", roles: ["hr", "pap"] },
    { email: "alex@example.com", roles: ["superAdmin"] },
    { email: "lisa@example.com", roles: ["university"] },
    { email: "john@example.com", roles: ["admin"] },
    { email: "mary@example.com", roles: ["hr", "pap"] },
    { email: "alex@example.com", roles: ["superAdmin"] },
    { email: "lisa@example.com", roles: ["university"] },
    { email: "john@example.com", roles: ["admin"] },
    { email: "mary@example.com", roles: ["hr", "pap"] },
    { email: "alex@example.com", roles: ["superAdmin"] },
    { email: "lisa@example.com", roles: ["university"] },
    { email: "john@example.com", roles: ["admin"] },
    { email: "mary@example.com", roles: ["hr", "pap"] },
    { email: "alex@example.com", roles: ["superAdmin"] },
    { email: "lisa@example.com", roles: ["university"] },
  ]);

  // Filtered Users based on search term
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
    setSearchTerm("");
  };

  // Create New User
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password || selectedRoles.length === 0) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("✅ User created (Mock Test)");
    resetForm();
  };

  // Update Role
  const handleRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || selectedRoles.length === 0) {
      toast.error("Please select a user and roles");
      return;
    }
    toast.success("✅ User role updated (Mock Test)");
    resetForm();
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
          Create New User
        </button>
        <button
          onClick={() => setActiveTab("change")}
          className={`rounded-full px-6 py-2 font-semibold ${
            activeTab === "change"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
          }`}
        >
          Change User Role
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "create" ? (
          // CREATE USER FORM
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
              Create New User
            </h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3 w-full rounded border p-2 dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-3 w-full rounded border p-2 dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-3 w-full rounded border p-2 dark:bg-gray-700 dark:text-white"
              required
            />

            <div className="mb-3">
              <p className="mb-1 font-medium dark:text-white">Select Roles</p>
              <div className="flex flex-wrap gap-3">
                {rolesList.map((role) => (
                  <label key={role} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="accent-green-600"
                    />
                    <span className="capitalize dark:text-white">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700"
            >
              Create User
            </button>
          </motion.form>
        ) : (
          // UPDATE ROLE FORM
          <motion.form
            key="change"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleRoleChange}
            className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900"
          >
            <h2 className="mb-4 text-xl font-bold dark:text-white">
              Change User Role
            </h2>

            {/* Searchable Dropdown */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search user by email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full rounded border p-2 dark:bg-gray-700 dark:text-white"
              />
              {showDropdown && filteredUsers.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded border bg-white shadow dark:bg-gray-800">
                  {filteredUsers.map((u) => (
                    <li
                      key={u.email}
                      onClick={() => {
                        setEmail(u.email);
                        setSearchTerm(u.email);
                        setSelectedRoles(u.roles);
                        setShowDropdown(false);
                      }}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      {u.email}{" "}
                      <span className="text-sm text-gray-500">
                        ({u.roles.join(", ")})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mb-3">
              <p className="mb-1 font-medium dark:text-white">Update Roles</p>
              <div className="flex flex-wrap gap-3">
                {rolesList.map((role) => (
                  <label key={role} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="accent-green-600"
                    />
                    <span className="capitalize dark:text-white">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
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
