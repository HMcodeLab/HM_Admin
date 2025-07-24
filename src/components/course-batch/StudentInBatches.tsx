"use client";

import React, { useState } from "react";
import axios from "axios";
import { FaUserAltSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

import clsx from "clsx";

interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface Batch {
  _id: string;
  batchName: string;
  course: string;
  users: User[];
}

interface Props {
  batch: Batch;
  onStudentView: () => void;
}

const StudentInBatches: React.FC<Props> = ({ batch, onStudentView }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const toggleDeleteModal = (user: User | null) => {
    setSelectedUser(user);
    setModalOpen((prev) => !prev);
  };

  const adminToken =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") || ""
      : "";

  const deleteAction = async (id: string) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/removeUserFromBatch`,
        {
          userID: id,
          BatchId: batch._id,
          courseId: batch.course,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (response.status === 200) {
        toast.success("User removed successfully");
        onStudentView();
      }
    } catch (error) {
      console.error("Error removing user from batch:", error);
      toast.error("Error removing user from batch");
    } finally {
      setModalOpen(false);
    }
  };

  const DeleteModal = ({ id }: { id: string }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-auto w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <p className="text-gray-800 dark:text-gray-100">
          Are you sure you want to remove this student from the batch?
        </p>
        <div className="mt-6 flex justify-between">
          <button
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            onClick={() => deleteAction(id)}
          >
            Yes
          </button>
          <button
            className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
            onClick={() => toggleDeleteModal(null)}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-10 flex flex-col gap-4 px-4">
      <Toaster position="top-center" />
      {batch?.users && batch?.users?.length > 0 ? (
        <>
          <h1 className="text-center text-lg font-semibold text-orange-500 dark:text-orange-300 md:text-xl">
            {batch?.batchName}
          </h1>
          <div className="overflow-auto">
            <table className="min-w-full border border-gray-300 text-center dark:border-gray-600">
              <thead className="bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                <tr>
                  <th className="border p-2 dark:border-gray-600">
                    Student ID
                  </th>
                  <th className="border p-2 dark:border-gray-600">Name</th>
                  <th className="border p-2 dark:border-gray-600">
                    Email / Phone
                  </th>
                  <th className="border p-2 dark:border-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {batch.users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                  >
                    <td className="p-2">{user._id}</td>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email || user.phone}</td>
                    <td className="p-2">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => toggleDeleteModal(user)}
                        title="Remove Student"
                      >
                        <FaUserAltSlash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <h1 className="text-center text-xl font-semibold text-red-500 dark:text-red-400">
          No students are in this batch
        </h1>
      )}
      {modalOpen && selectedUser && <DeleteModal id={selectedUser._id} />}
    </div>
  );
};

export default StudentInBatches;
