"use client";

import React, { useEffect, useState } from "react";
import AddPromoCode from "./AddPromoCode";
import UpdatePromoCode from "./UpdatePromoCode";
import { DeleteModal } from "./DeleteModal";
import axios from "axios";

import { FaEdit, FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/Loader";

interface PromoCode {
  promocode: string;
  quantity: number;
  discountPercentage: number;
  applicableTo: string;
  forCollege: string;
  validTill: string;
}

const SERVER_DOMAIN = process.env.NEXT_PUBLIC_SERVER_DOMAIN;

const Promocode: React.FC = () => {
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const adminToken =
    typeof window !== "undefined"
      ? (localStorage.getItem("adminToken") ?? "")
      : "";

  const handleAddPromoCode = () => {
    setModalAddOpen(!modalAddOpen);
    setModalUpdateOpen(false);
    setModalDeleteOpen(false);
  };

  const handleUpdatePromoCode = (promo: PromoCode) => {
    setSelectedPromoCode(promo);
    setModalUpdateOpen(true);
    setModalAddOpen(false);
    setModalDeleteOpen(false);
  };

  const handleDeletePromoCode = (promo: PromoCode) => {
    setSelectedPromoCode(promo);
    setModalDeleteOpen(true);
    setModalAddOpen(false);
    setModalUpdateOpen(false);
  };

  const fetchPromocode = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER_DOMAIN}/getallpromocodeadmin`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      setPromoCodes(res.data.promocodes);
    } catch (error) {
      console.error("Error in fetching promocode: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromocode();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} , ${hours}:${minutes}`;
  };

  const submitCreatePromoCode = async (promoData: PromoCode) => {
    try {
      await axios.post(`${SERVER_DOMAIN}/createpromocode`, promoData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      toast.success("Promocode Created Successfully");
      setModalAddOpen(false);
      fetchPromocode();
    } catch (error) {
      console.error("Error in Create Promocode", error);
      toast.error("Failed to create promocode");
    }
  };

const submitUpdatePromoCode = async (promoData: PromoCode) => {
  if (!adminToken) {
    toast.error("No admin token found. Please login again.");
    return;
  }

  console.log("Updating Promocode with data:", promoData);

  try {
    const response = await axios.put(
      `${SERVER_DOMAIN}/updatepromocode`,
      promoData,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Update Response:", response.data);

    toast.success("Promocode Updated Successfully");
    setModalUpdateOpen(false);
    fetchPromocode();
  } catch (error: any) {
    console.error(
      "Error in Update Promocode:",
      error.response?.data || error.message || error,
    );

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to update promocode";

    toast.error(errorMessage);
  }
};


  const submitDeletePromoCode = async () => {
    if (!selectedPromoCode) return;
    try {
      await axios.delete(`${SERVER_DOMAIN}/deletepromocode`, {
        data: { promocode: selectedPromoCode.promocode },
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      toast.success("Promocode Deleted Successfully");
      setModalDeleteOpen(false);
      fetchPromocode();
    } catch (error) {
      console.error("Error in Delete Promocode", error);
      toast.error("Failed to delete promocode");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-lg bg-gradient-to-br from-green-50 to-white p-6 text-gray-900 shadow-lg dark:from-gray-900 dark:to-gray-800 dark:text-gray-100 md:p-10">
      <h1 className="mb-6 text-center text-4xl font-extrabold text-green-700 underline drop-shadow-md dark:text-green-400">
        Promocode Management
      </h1>

      <div className="mb-4 flex justify-center">
        <button
          onClick={handleAddPromoCode}
          className="relative inline-block rounded-lg border-2 border-green-700 bg-white px-8 py-3 text-lg font-semibold text-green-700 shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-green-700 hover:text-white active:scale-95 dark:border-green-400 dark:bg-gray-900 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-gray-900"
        >
          Add New Promocode
          <span className="absolute -bottom-1 left-1/2 h-1 w-0 -translate-x-1/2 rounded bg-green-400 transition-all duration-300 hover:w-full"></span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full min-w-[700px] text-left text-sm text-gray-700 dark:text-gray-200 md:text-base">
          <thead className="bg-green-200 text-xs font-semibold uppercase tracking-wide text-green-900 dark:bg-green-900 dark:text-green-200 md:text-sm">
            <tr>
              <th className="px-6 py-3">Promocode</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Discount</th>
              <th className="px-6 py-3">Applicable For</th>
              <th className="px-6 py-3">College</th>
              <th className="px-6 py-3">Expiry Date</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.map((promo, index) => (
              <tr
                key={`promo-${index}`}
                className={`border-b border-green-300 bg-white transition-colors duration-300 hover:bg-green-100 dark:bg-gray-900 dark:hover:bg-green-800 ${
                  index % 2 === 0 ? "bg-green-50 dark:bg-green-900" : ""
                }`}
              >
                <td className="px-6 py-4 font-semibold tracking-wide text-green-700 dark:text-green-400">
                  {promo.promocode}
                </td>
                <td className="px-6 py-4">{promo.quantity}</td>
                <td className="px-6 py-4 font-bold text-green-600 dark:text-green-300">
                  {promo.discountPercentage}%
                </td>
                <td className="px-6 py-4">{promo.applicableTo}</td>
                <td className="px-6 py-4">{promo.forCollege}</td>
                <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(promo.validTill)}
                </td>
                <td className="flex items-center gap-4 px-6 py-4">
                  <FaEdit
                    onClick={() => handleUpdatePromoCode(promo)}
                    className="cursor-pointer text-yellow-600 transition-transform duration-300 hover:scale-110 hover:text-yellow-400"
                    size={20}
                    aria-label="Edit Promo"
                  />
                  <FaTrash
                    onClick={() => handleDeletePromoCode(promo)}
                    className="cursor-pointer text-red-600 transition-transform duration-300 hover:scale-110 hover:text-red-400"
                    size={20}
                    aria-label="Delete Promo"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAddOpen && (
        <AddPromoCode
          handleToggleOpen={handleAddPromoCode}
          submitHandler={(data) =>
            submitCreatePromoCode({
              ...data,
              quantity: parseInt(data.quantity),
              discountPercentage: parseFloat(data.discountPercentage),
            })
          }
        />
      )}

      {modalUpdateOpen && selectedPromoCode && (
        <UpdatePromoCode
          handleToggleOpen={() => setModalUpdateOpen(false)}
          promocode={{
            ...selectedPromoCode,
            quantity: String(selectedPromoCode.quantity),
            discountPercentage: String(selectedPromoCode.discountPercentage),
          }}
          submitHandler={(data) =>
            submitUpdatePromoCode({
              ...data,
              quantity: parseInt(data.quantity),
              discountPercentage: parseFloat(data.discountPercentage),
            })
          }
        />
      )}

      <Toaster position="top-center" />
    </div>
  );
};

export default Promocode;
