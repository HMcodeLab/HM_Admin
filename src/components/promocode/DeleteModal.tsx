"use client";

import React from "react";

interface DeleteModalProps {
  toggleDeleteModal: () => void;
  deleteAction: (id: any) => void;
  id: any;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  toggleDeleteModal,
  deleteAction,
  id,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={toggleDeleteModal}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      ></div>

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 text-gray-800 shadow-lg dark:bg-gray-900 dark:text-white">
        <p className="text-center text-lg font-medium">
          Are you sure you want to delete this record?
        </p>
        <div className="mt-6 flex justify-around gap-4">
          <button
            className="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
            onClick={() => deleteAction(id)}
          >
            Yes
          </button>
          <button
            className="rounded-md bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
            onClick={toggleDeleteModal}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};
