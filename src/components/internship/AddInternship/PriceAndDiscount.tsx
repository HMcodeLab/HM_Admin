"use client";

import React, { ChangeEvent } from "react";
import InputBox from "@/utils/InputBox";
import { InternshipData } from "@/types";

interface PriceAndDiscountProps {
  courseDetails: InternshipData;
  setCourseDetails: React.Dispatch<React.SetStateAction<InternshipData>>;
}

const PriceAndDiscount: React.FC<PriceAndDiscountProps> = ({
  courseDetails,
  setCourseDetails,
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const numericFields = [
      "base_price",
      "registration_price",
      "discount_percentage",
    ];
    const updatedValue = numericFields.includes(name) ? Number(value) : value;

    setCourseDetails({
      ...courseDetails,
      [name]: updatedValue,
    });

    console.log(name, updatedValue);
  };

  return (
    <div>
      <fieldset className="flex flex-col gap-4">
        <h1 className="font-Montserrat text-3xl font-semibold text-green-600 dark:text-green-400">
          Course Price and Discount
        </h1>

        <div className="flex flex-row gap-4 rounded-md bg-white px-4 py-4 shadow-md dark:bg-gray-800">
          <InputBox
            label="Base Price"
            type="number"
            placeholder="Base Price"
            name="base_price"
            value={courseDetails.base_price}
            onChange={handleInputChange}
          />
          <InputBox
            label="Registration Price"
            type="number"
            placeholder="Registration Price"
            name="registration_price"
            value={courseDetails.registration_price}
            onChange={handleInputChange}
          />
          <InputBox
            label="Discount Percentage"
            type="number"
            placeholder="Discount Percentage"
            name="discount_percentage"
            value={courseDetails.discount_percentage}
            onChange={handleInputChange}
          />
        </div>
      </fieldset>
    </div>
  );
};

export default PriceAndDiscount;
