// src/components/Payment.tsx

"use client";

import React, { useEffect, useState } from "react";
import PaymentModal from "./PaymentModal";
import { GrDocumentCsv, GrDownload } from "react-icons/gr";
import * as XLSX from "xlsx";
import { jwtDecode } from "jwt-decode";
import { PaymentData } from "@/types";

const Payment: React.FC = () => {
  const [data, setData] = useState<PaymentData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const headers = [
    { label: "S No.", key: "serialNumber" },
    { label: "Course", key: "course" },
    { label: "Purchased By", key: "purchasedBy.name" },
    { label: "Email", key: "purchasedBy.email" },
    { label: "Phone", key: "purchasedBy.phone" },
    { label: "Country", key: "country" },
    { label: "State", key: "state" },
    { label: "ZIP", key: "zip" },
    { label: "Base Price", key: "basePrice" },
    { label: "Discounted Amount", key: "discountedAmount" },
    { label: "GST Amount", key: "gstAmount" },
    { label: "Total Amount", key: "paymentData.Total Amount" },
    { label: "Transaction Amount", key: "transactionAmount" },
    { label: "Payment Mode", key: "paymentData.Payment Mode" },
    { label: "Status", key: "paymentStatus.status" },
    { label: "Date", key: "paymentData.Transaction Date" },
    { label: "Action", key: "action" },
  ];

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const validToken = jwtDecode(token);
      if (!validToken) {
        console.log("Token expired or invalid");
        setLoading(false);
        return;
      }

      const fetchData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/getallorders`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
          }

          const result = await response.json();

          // Normalize keys: payemntData → paymentData and paymentStauts → paymentStatus
          const normalized = result.map((item: any) => ({
            ...item,
            paymentData: item.paymentData || item.payemntData || {},
            paymentStatus: item.paymentStatus || item.paymentStauts || {},
          }));

          setData(normalized);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } catch (err) {
      console.error("Invalid token:", err);
      setLoading(false);
    }
  }, [token]);

  function formatIndianRupees(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // Filter data based on search term (case-insensitive search on purchaser name)
  const filteredData = data.filter((payment) =>
    payment.purchasedBy?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase().trim()),
  );

  const handleDownload = () => {
    const worksheetData = filteredData.map((payment, index) => ({
      serialNumber: index + 1,
      course: payment.courses?.[0]?._id || "N/A",
      name: payment.purchasedBy?.name || "N/A",
      email: payment.purchasedBy?.email || "N/A",
      phone: payment.purchasedBy?.phone || "N/A",
      country: payment.country || "N/A",
      state: payment.state || "N/A",
      zip: payment.zip || "N/A",
      basePrice: payment.basePrice || 0,
      discountedAmount: payment.discountedAmount || 0,
      gstAmount:
        payment.gstAmount !== undefined ? payment.gstAmount.toFixed(2) : "0.00",
      totalAmount: payment.paymentData?.["Total Amount"]
        ? Number(payment.paymentData["Total Amount"]).toFixed(2)
        : "0.00",
      transactionAmount:
        payment.transactionAmount ||
        payment.paymentData?.["Transaction Amount"] ||
        0,
      paymentMode: payment.paymentData?.["Payment Mode"] || "N/A",
      status: payment.paymentStatus?.status || "Unknown",
      transactionDate: payment.paymentData?.["Transaction Date"] || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
      header: headers.map((h) => h.key),
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "payments.xlsx");
  };

  const totalIncome = () => {
    const total = filteredData.reduce((sum, item) => {
      if (item.paymentStatus?.status === "success") {
        return sum + (item.transactionAmount || 0);
      }
      return sum;
    }, 0);
    return total.toFixed(2);
  };

  const totalTransactionAmount = (): number => {
    const total = filteredData.reduce((sum, item) => {
      return sum + (item.transactionAmount || 0);
    }, 0);
    return total;
  };

  const handleViewClick = (payment: PaymentData) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-white p-4 transition-all dark:bg-gray-900">
      <div className="mb-6 flex flex-col space-y-4 border-b pb-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
          Payments Details
        </h1>

        <div className="flex w-full flex-col space-y-2 md:w-auto md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <input
            type="text"
            placeholder="Search by purchaser name..."
            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search change
            }}
          />
          <button
            onClick={handleDownload}
            className="flex items-center justify-center space-x-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <GrDocumentCsv className="text-xl" />
            <GrDownload className="text-xl" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <tr>
                {headers.map((header) => (
                  <th key={header.key} className="px-4 py-2 text-left">
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {currentItems.length > 0 ? (
                currentItems.map((payment, index) => (
                  <tr
                    key={index}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleViewClick(payment)}
                  >
                    <td className="px-4 py-2">
                      {indexOfFirstItem + index + 1}
                    </td>

                    <td className="px-4 py-2">
                      {payment.courses?.[0]?._id || "N/A"}
                    </td>

                    <td className="px-4 py-2">
                      {payment.purchasedBy?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {payment.purchasedBy?.email || "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {payment.purchasedBy?.phone || "N/A"}
                    </td>
                    <td className="px-4 py-2">{payment.country || "N/A"}</td>
                    <td className="px-4 py-2">{payment.state || "N/A"}</td>
                    <td className="px-4 py-2">{payment.zip || "N/A"}</td>
                    <td className="px-4 py-2">{payment.basePrice}</td>
                    <td className="px-4 py-2">{payment.discountedAmount}</td>
                    <td className="px-4 py-2">
                      {payment.gstAmount !== undefined
                        ? payment.gstAmount.toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="px-4 py-2">
                      {payment.paymentData?.["Total Amount"]
                        ? Number(payment.paymentData["Total Amount"]).toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="px-4 py-2">
                      {payment.transactionAmount ||
                        payment.paymentData?.["Transaction Amount"] ||
                        "0"}
                    </td>
                    <td className="px-4 py-2">
                      {payment.paymentData?.["Payment Mode"] || "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {payment.paymentStatus?.status || "Unknown"}
                    </td>
                    <td className="px-4 py-2">
                      {payment.paymentData?.["Transaction Date"] || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-blue-600 dark:text-blue-400">
                      View
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col items-center justify-between md:flex-row">
        <div className="space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded bg-gray-200 px-3 py-1 text-gray-800 disabled:opacity-50 dark:bg-gray-800 dark:text-white"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= filteredData.length}
            className="rounded bg-gray-200 px-3 py-1 text-gray-800 disabled:opacity-50 dark:bg-gray-800 dark:text-white"
          >
            Next
          </button>
        </div>
        <div className="mt-6 flex flex-col items-center space-y-3 rounded-lg bg-white p-5 shadow-md dark:bg-gray-800 md:flex-row md:justify-center md:space-x-8 md:space-y-0">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Total Payments:{" "}
            <span className="text-blue-600">{filteredData.length}</span>
          </div>
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Total Income:{" "}
            <span className="text-green-600">
              {formatIndianRupees(totalTransactionAmount())}
            </span>
          </div>
        </div>
      </div>

      {showModal && selectedPayment && (
        <PaymentModal
          show={showModal}
          onClose={handleCloseModal}
          payment={{
            ...selectedPayment,
            paymentStatus: {
              status: selectedPayment.paymentStatus?.status || "Unknown",
              message: selectedPayment.paymentStatus?.message || "No message",
            },
            courses: selectedPayment.courses || [],
          }}
        />
      )}
    </div>
  );
};

export default Payment;
