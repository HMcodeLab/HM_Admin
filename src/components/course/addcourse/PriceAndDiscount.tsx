"use client";

import React, { ChangeEvent } from "react";

import { CourseType } from "@/types";
import InputBox from "./InputBox";

interface PriceAndDiscountProps {
  courseDetails: CourseType;
  setCourseDetails: React.Dispatch<React.SetStateAction<CourseType>>;
}

const PriceAndDiscount: React.FC<PriceAndDiscountProps> = ({
  courseDetails,
  setCourseDetails,
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? "" : Number(value);

    setCourseDetails((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  return (
    <div className="mx-12 space-y-4 rounded-2xl border border-gray-300 p-4 shadow-md dark:border-gray-700">
      <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
        Price & Discount
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputBox
          label="Base Price"
          name="base_price"
          type="number"
          placeholder="Enter base price"
          value={courseDetails.base_price}
          onChange={handleInputChange}
        />

        <InputBox
          label="Discount (%)"
          name="discount_percentage"
          type="number"
          placeholder="Enter discount percentage"
          value={courseDetails.discount_percentage}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default PriceAndDiscount;
