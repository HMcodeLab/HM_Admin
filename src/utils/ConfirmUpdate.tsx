import React from "react";

interface ConfirmUpdateProps {
  modalClose: () => void;
  handler: () => void;
  message?: string; // Optional custom message
}

const ConfirmUpdate: React.FC<ConfirmUpdateProps> = ({
  modalClose,
  handler,
  message = "Are you sure you want to update curriculum for every batch?",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal */}
      <div className="animate-fadeIn w-[90%] max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <p className="font-medium text-gray-700">{message}</p>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={modalClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-blue-500 transition hover:bg-blue-50"
          >
            No
          </button>
          <button
            onClick={handler}
            className="rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmUpdate;
