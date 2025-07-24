"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "next-themes";

interface EditBatchModalProps {
  batchId: string;
  handleToggleOpen: () => void;
  onHandleEditBatch: () => void;
}

interface Batch {
  _id: string;
  batchName: string;
  startDate: string;
  endDate: string;
  batchlimit: number;
}

interface FormData {
  batchId?: string;
  batchName?: string;
  startDate?: string;
  endDate?: string;
  batchlimit?: number;
}

const EditBatchModal: React.FC<EditBatchModalProps> = ({
  batchId,
  handleToggleOpen,
  onHandleEditBatch,
}) => {
  const [form, setForm] = useState<FormData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [batch, setBatch] = useState<Batch | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getBatch/${batchId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          },
        );
        if (response?.data?.batch) {
          setBatch(response.data.batch);
        }
      } catch (error) {
        console.error("Error fetching batch:", error);
      }
    };
    fetchBatch();
  }, [batchId]);

  useEffect(() => {
    if (batch) {
      setForm({
        batchId: batch._id,
        batchName: batch.batchName,
        startDate: batch.startDate,
        endDate: batch.endDate,
        batchlimit: batch.batchlimit,
      });
    }
  }, [batch]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "batchlimit" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    if (!token) return toast.error("Unauthorized");

    try {
      const validToken = jwtDecode(token);
      if (validToken) {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/editBatchDetails`,
          form,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response) {
          toast.success("Batch updated successfully!");
          onHandleEditBatch();
          handleToggleOpen();
        }
      }
    } catch (error) {
      toast.error("Error submitting batch. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
      <Toaster position="top-center" />
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <form
        onSubmit={handleSubmit}
        className={`relative max-h-screen w-[90%] overflow-y-auto rounded-lg shadow-lg sm:w-[500px] ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <button
          type="button"
          className="absolute right-2 top-2 font-bold text-red-500"
          onClick={() => setShowConfirmation(true)}
        >
          X
        </button>
        <h1 className="my-4 text-center text-lg font-bold underline">
          Edit Batch
        </h1>
        <div className="form-group mb-4 flex flex-col gap-3 px-6">
          <InputField
            name="batchId"
            label="Batch Id"
            value={form.batchId || ""}
            disabled
          />
          <InputField
            name="batchName"
            label="Batch Name"
            value={form.batchName || ""}
            onChange={handleInputChange}
            required
          />
          <InputField
            name="startDate"
            label="Start Date"
            value={formatDate(form.startDate)}
            type="datetime-local"
            onChange={handleInputChange}
            required
          />
          <InputField
            name="endDate"
            label="End Date"
            value={formatDate(form.endDate)}
            type="datetime-local"
            onChange={handleInputChange}
            required
          />
          <InputField
            name="batchlimit"
            label="Batch Limit"
            value={form.batchlimit?.toString() || ""}
            type="number"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="my-4 flex justify-center">
          <button
            type="submit"
            className="rounded-md bg-green-600 px-6 py-2 text-white transition hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`rounded-lg p-6 shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          >
            <p className="mb-4">
              Are you sure you want to close without updating?
            </p>
            <div className="flex justify-around">
              <button
                className="rounded-md bg-red-600 px-4 py-2 text-white"
                onClick={handleToggleOpen}
              >
                Yes
              </button>
              <button
                className="rounded-md bg-gray-500 px-4 py-2 text-white"
                onClick={() => setShowConfirmation(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface InputFieldProps {
  name: string;
  label: string;
  value: string;
  type?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  value,
  type = "text",
  onChange,
  required,
  disabled,
}) => (
  <div className="flex flex-col gap-1">
    <label className="font-semibold">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="form-control rounded bg-gray-100 px-3 py-2 text-black shadow-md focus:outline-none disabled:opacity-60"
    />
  </div>
);

export default EditBatchModal;
