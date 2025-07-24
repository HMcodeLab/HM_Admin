"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";

interface PromoForm {
  promocode: string;
  applicableTo: string;
  validTill: string;
  discountPercentage: string;
  quantity: string;
  forCollege: string;
}

interface UpdatePromoCodeProps {
  handleToggleOpen: () => void;
  promocode: PromoForm;
  submitHandler: (data: PromoForm) => void;
}

const UpdatePromoCode: React.FC<UpdatePromoCodeProps> = ({
  handleToggleOpen,
  promocode,
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

  useEffect(() => {
    if (promocode) {
      setForm({
        promocode: promocode.promocode,
        applicableTo: promocode.applicableTo,
        validTill: formatDate(promocode.validTill),
        discountPercentage: promocode.discountPercentage,
        quantity: promocode.quantity,
        forCollege: promocode.forCollege,
      });
    }
  }, [promocode]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    const { promocode, applicableTo, validTill, discountPercentage, quantity } =
      form;
    if (
      !promocode ||
      !applicableTo ||
      !validTill ||
      !discountPercentage ||
      !quantity
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

  const applicableFor = ["courses", "internships", "both"];

  return (
    <>
      <Toaster position="top-center" />
      {/* Overlay + Centered Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-60 p-4 pt-32">
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-300 pb-3 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Update Promocode
            </h2>
            <button
              type="button"
              className="text-2xl font-bold text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"
              onClick={() => setShowConfirmation(true)}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          {/* Form Fields */}
          <div className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent mt-5 max-h-[75vh] space-y-5 overflow-y-auto pr-2">
            {/* PromoCode */}
            <div>
              <label
                htmlFor="promocode"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                PromoCode <span className="text-red-500">*</span>
              </label>
              <input
                id="promocode"
                type="text"
                name="promocode"
                value={form.promocode}
                onChange={handleInputChange}
                required
                readOnly
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="Enter promo code"
              />
            </div>

            {/* Applicable For */}
            <div>
              <label
                htmlFor="applicableTo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Applicable For <span className="text-red-500">*</span>
              </label>
              <select
                id="applicableTo"
                name="applicableTo"
                value={form.applicableTo}
                onChange={handleInputChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="" disabled>
                  Select option
                </option>
                {applicableFor.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Expiry Date */}
            <div>
              <label
                htmlFor="validTill"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                id="validTill"
                type="datetime-local"
                name="validTill"
                value={form.validTill}
                onChange={handleInputChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Discount Percentage */}
            <div>
              <label
                htmlFor="discountPercentage"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Discount % <span className="text-red-500">*</span>
              </label>
              <input
                id="discountPercentage"
                type="number"
                min="1"
                max="100"
                name="discountPercentage"
                value={form.discountPercentage}
                onChange={handleInputChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="e.g., 10"
              />
            </div>

            {/* Quantity */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                name="quantity"
                value={form.quantity}
                onChange={handleInputChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="e.g., 50"
              />
            </div>

            {/* College */}
            <div>
              <label
                htmlFor="forCollege"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                College
              </label>
              <input
                id="forCollege"
                type="text"
                name="forCollege"
                value={form.forCollege}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Update"}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <p className="mb-6 text-center text-lg font-semibold text-gray-800 dark:text-white">
              Are you sure you want to close without saving?
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  handleToggleOpen();
                }}
                className="rounded-md bg-red-600 px-5 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="rounded-md bg-gray-500 px-5 py-2 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdatePromoCode;
