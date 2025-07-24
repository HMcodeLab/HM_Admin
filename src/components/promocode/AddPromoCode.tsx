"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";

interface PromoForm {
  promocode: string;
  applicableTo: string;
  validTill: string;
  discountPercentage: string;
  quantity: string;
  forCollege: string;
}

interface AddPromoCodeProps {
  handleToggleOpen: () => void;
  submitHandler: (data: PromoForm) => void;
}

const AddPromoCode: React.FC<AddPromoCodeProps> = ({
  handleToggleOpen,
  submitHandler,
}) => {
  const [form, setForm] = useState<PromoForm>({
    promocode: "",
    applicableTo: "",
    validTill: "",
    discountPercentage: "",
    quantity: "",
    forCollege: "",
  });

  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const applicableFor = ["courses", "internships", "both"];

  const validateForm = (): string | null => {
    const { promocode, validTill, discountPercentage, quantity, applicableTo } =
      form;
    if (
      !promocode ||
      !validTill ||
      !discountPercentage ||
      !quantity ||
      !applicableTo
    ) {
      return "Please fill out all required fields.";
    }
    if (
      isNaN(Number(discountPercentage)) ||
      Number(discountPercentage) <= 0 ||
      Number(discountPercentage) > 100
    ) {
      return "Discount percentage must be a number between 1 and 100.";
    }
    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      return "Quantity must be a positive number.";
    }
    return null;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      setLoading(false);
      return;
    }
    const data = {
      ...form,
      validTill: new Date(form.validTill).toISOString(),
    };
    await submitHandler(data);
    setLoading(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-25 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 px-4 pt-6">
      <Toaster position="top-center" />

      {/* Form Container */}
      <div className="relative z-10 mb-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-4 shadow-lg dark:bg-gray-900 md:p-6">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Create New Promocode
            </h2>
            <button
              type="button"
              className="text-xl font-bold text-red-500"
              onClick={() => setShowConfirmation(true)}
            >
              &times;
            </button>
          </div>

          {/* Form Body */}
          <div className="mt-4 space-y-4">
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                PromoCode
              </label>
              <input
                type="text"
                name="promocode"
                value={form.promocode}
                onChange={handleInputChange}
                className="w-full rounded-md border px-3 py-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Applicable For
              </label>
              <select
                name="applicableTo"
                value={form.applicableTo}
                onChange={handleInputChange}
                className="w-full rounded-md border px-3 py-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
              >
                <option value="" disabled>
                  Select Option
                </option>
                {applicableFor.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Expiry Date
              </label>
              <input
                type="datetime-local"
                name="validTill"
                value={form.validTill}
                onChange={handleInputChange}
                className="w-full rounded-md border px-3 py-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Discount %
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={form.discountPercentage}
                onChange={handleInputChange}
                className="w-full rounded-md border px-3 py-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleInputChange}
                className="w-full rounded-md border px-3 py-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                College
              </label>
              <input
                type="text"
                name="forCollege"
                value={form.forCollege}
                onChange={handleInputChange}
                className="w-full rounded-md border px-3 py-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="z-[9999] fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
            <p className="mb-4 text-center text-gray-800 dark:text-white">
              Are you sure you want to close without saving?
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => {
                  setShowConfirmation(false); // ✅ Hide confirmation first
                  handleToggleOpen(); // ✅ Then close main modal
                }}
                className="rounded-md bg-red-600 px-4 py-2 text-white"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="rounded-md bg-gray-500 px-4 py-2 text-white"
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

export default AddPromoCode;
