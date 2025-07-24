"use client";

import React from "react";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

interface Course {
  title: string;
  base_price: number;
}

interface PaymentData {
  [key: string]: string | number;
}

interface PaymentStatus {
  status: string;
  message: string;
}

interface Payment {
  paymentStatus?: PaymentStatus;
  name?: string;
  address?: string;
  country?: string;
  state?: string;
  courses?: Course[];
  transactionAmount?: number;
  paymentData?: PaymentData;
  discountedAmount?: number;
  gstAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  zip?: string | number;
  [key: string]: any; // For any other fields that may come
}

interface PaymentModalProps {
  show: boolean;
  onClose: () => void;
  payment: Payment | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  show,
  onClose,
  payment,
}) => {
  if (!show || !payment) return null;

  const {
    paymentStatus = { status: "Unknown", message: "No message" },
    name = "N/A",
    address = "N/A",
    zip = "N/A",
    country = "N/A",
    state = "N/A",
    courses = [],
    transactionAmount = 0,
    paymentData = {},
    discountedAmount = 0,
    gstAmount = 0,
    createdAt = "N/A",
    updatedAt = "N/A",
  } = payment;

  // Format currency (INR)
  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(num)) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(num);
  };

  const printReceipt = () => window.print();

  return (
    <div
      className="fixed inset-0 z-[9999] mt-[15vh] flex items-start justify-center overflow-auto bg-black/50 p-4 dark:bg-black/70"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700 mx-auto max-h-[calc(100vh-5rem)] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 text-black shadow-xl dark:bg-gray-900 dark:text-white print:max-h-screen print:max-w-full print:overflow-visible"
      >
        <IoClose onClick={onClose}  className="w-8 h-8 cursor-pointer text-green-500 hover:text-green-600"/>
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image
            src="https://sbs.ac.in/wp-content/uploads/2023/09/Asset-5.png"
            alt="Logo"
            width={180}
            height={180}
            className="object-contain"
          />
        </div>

        {/* Header Info */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Katina Skills Pvt. Ltd.</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            4th Floor, E-314, Phase 8A, Mohali, Punjab 140308
          </p>
          <hr className="my-4 border-gray-300 dark:border-gray-600" />
        </div>

        {/* Personal Details */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailRow label="Name" value={name} />
          <DetailRow label="Address" value={address} />
          <DetailRow label="ZIP" value={zip} />
          <DetailRow label="State" value={state} />
          <DetailRow label="Country" value={country} />
          <DetailRow label="Created At" value={createdAt} />
          <DetailRow label="Updated At" value={updatedAt} />
          <DetailRow
            label="Status"
            value={`${paymentStatus.status} - ${paymentStatus.message}`}
          />
          <DetailRow
            label="Reference No."
            value={paymentData["ReferenceNo"] || "N/A"}
          />
          <DetailRow
            label="Transaction Date"
            value={paymentData["Transaction Date"] || "N/A"}
          />
        </section>

        {/* Courses Table */}
        <section className="mb-6 overflow-x-auto">
          <h3 className="mb-3 border-b border-gray-300 pb-2 text-xl font-semibold dark:border-gray-600">
            Purchased Courses
          </h3>
          <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left dark:border-gray-600">
                  Title
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right dark:border-gray-600">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course, i) => (
                  <tr key={i} className="even:bg-gray-50 dark:even:bg-gray-700">
                    <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                      {course.title || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right dark:border-gray-600">
                      {formatCurrency(course.base_price || 0)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600"
                  >
                    No courses available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Payment Details */}
        <section className="mb-6 space-y-2 rounded border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
          <h3 className="mb-2 border-b border-gray-300 pb-2 text-xl font-semibold dark:border-gray-600">
            Payment Details
          </h3>

          <DetailRow
            label="Base Price"
            value={formatCurrency(payment.basePrice || 0)}
          />
          <DetailRow
            label="Discounted Amount"
            value={formatCurrency(discountedAmount || 0)}
          />
          <DetailRow
            label="GST Amount"
            value={formatCurrency(gstAmount || 0)}
          />
          <DetailRow
            label="Total Amount"
            value={formatCurrency(
              paymentData["Total Amount"] || transactionAmount || 0,
            )}
          />
          <DetailRow
            label="Transaction Amount"
            value={formatCurrency(transactionAmount || 0)}
          />
          <DetailRow
            label="Payment Mode"
            value={paymentData["Payment Mode"] || "N/A"}
          />
          <DetailRow
            label="Service Tax Amount"
            value={formatCurrency(paymentData["Service Tax Amount"] || 0)}
          />
          <DetailRow
            label="Processing Fee Amount"
            value={formatCurrency(paymentData["Processing Fee Amount"] || 0)}
          />
          <DetailRow
            label="Reference Number"
            value={paymentData["ReferenceNo"] || "N/A"}
          />
          <DetailRow
            label="Unique Ref Number"
            value={paymentData["Unique Ref Number"] || "N/A"}
          />
          <DetailRow
            label="Response Code"
            value={paymentData["Response Code"] || "N/A"}
          />
          <DetailRow label="TDR" value={paymentData["TDR"] || "N/A"} />
          <DetailRow label="TPS" value={paymentData["TPS"] || "N/A"} />
          <DetailRow
            label="Sub Merchant ID"
            value={paymentData["SubMerchantId"] || "N/A"}
          />
        </section>

        {/* Contact Info */}
        <section className="mb-6 text-center text-sm text-gray-700 dark:text-gray-400">
          <p className="mb-2 flex items-center justify-center gap-2">
            <FaEnvelope />{" "}
            <a
              href="mailto:support@hopingminds.com"
              className="hover:text-green-500"
            >
              support@hopingminds.com
            </a>
          </p>
          <p className="flex items-center justify-center gap-2">
            <FaPhone />{" "}
            <a href="tel:+917657922600" className="hover:text-green-500">
              +91 76579 22600
            </a>
            ,
            <a href="tel:+919193100050" className="ml-1 hover:text-green-500">
              +91 91931 00050
            </a>
          </p>
        </section>

        {/* Actions */}
        <div className="flex justify-between gap-3">
          <button
            onClick={printReceipt}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 sm:w-auto"
          >
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="w-full rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}
const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <p className="flex justify-between border-b border-gray-300 py-1 dark:border-gray-600">
    <span className="font-semibold text-gray-600 dark:text-gray-300">{label}:</span>
    <span>{value}</span>
  </p>
);

export default PaymentModal;
