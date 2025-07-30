"use client";

import React from "react";

export interface DeleteModalProps {
  deleteHandler: () => void | Promise<void>;
  handleToggleOpen: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  deleteHandler,
  handleToggleOpen,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-bold text-red-600 dark:text-red-400">
          Confirm Deletion
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this promocode? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleToggleOpen}
            className="rounded-lg border border-gray-400 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={deleteHandler}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
