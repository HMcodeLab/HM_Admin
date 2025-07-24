"use client";

import { CourseType } from "@/types";
import React from "react";
import { FaPlusCircle } from "react-icons/fa";


interface PlacementAverageSalaryProps {
  courseDetails: CourseType;
  setCourseDetails: React.Dispatch<React.SetStateAction<CourseType>>;
}

const PlacementAverageSalary: React.FC<PlacementAverageSalaryProps> = ({
  courseDetails,
  setCourseDetails,
}) => {
  const handleCompanyChange = (
    index: number,
    field: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const updatedCompanies = [...(courseDetails.companies || [])];
    const updatedCompany = { ...updatedCompanies[index] };

    if (field === "from" || field === "to") {
      const value = Number(e.target.value);
      if (isNaN(value)) {
        alert("Please enter a valid number");
        return;
      }
      updatedCompany.avgpkg[field] = value;
    } else {
      updatedCompany[field] = e.target.value;
    }

    updatedCompanies[index] = updatedCompany;
    setCourseDetails({
      ...courseDetails,
      companies: updatedCompanies,
    });
  };

  const removeCompany = (index: number) => {
    const updatedCompanies = courseDetails.companies?.filter(
      (_, i) => i !== index,
    );
    setCourseDetails({
      ...courseDetails,
      companies: updatedCompanies || [],
    });
  };

  const addCompany = () => {
    setCourseDetails({
      ...courseDetails,
      companies: [
        ...(courseDetails.companies || []),
        { companyName: "", avgpkg: { from: 0, to: 0 } },
      ],
    });
  };

  const addPlacementData = () => {
    setCourseDetails({
      ...courseDetails,
      placementOpportunities: [
        ...(courseDetails.placementOpportunities || []),
        "",
      ],
    });
  };

  const removePlacementData = (indexToRemove: number) => {
    const updated = courseDetails.placementOpportunities?.filter(
      (_, index) => index !== indexToRemove,
    );
    setCourseDetails({
      ...courseDetails,
      placementOpportunities: updated || [],
    });
  };

  const handlePlacementChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const updated = [...(courseDetails.placementOpportunities || [])];
    updated[index] = e.target.value;
    setCourseDetails({
      ...courseDetails,
      placementOpportunities: updated,
    });
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-8 md:px-6 lg:px-16">
      <h1 className="text-2xl font-bold text-green-700 md:text-3xl">
        Average Salary & Placement Opportunities
      </h1>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Average Salary */}
        <fieldset className="flex flex-col gap-4">
          <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            Average Salary
            <FaPlusCircle
              className="cursor-pointer text-green-600"
              onClick={addCompany}
            />
          </h2>
          <div className="flex max-h-[20rem] flex-col gap-4 overflow-y-auto pr-2">
            {courseDetails?.companies?.map((company, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-lg border p-4 shadow-md"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter Domain Name"
                    value={company.companyName}
                    onChange={(e) =>
                      handleCompanyChange(index, "companyName", e)
                    }
                    className="w-full rounded border p-2"
                  />
                  <button onClick={() => removeCompany(index)}>❌</button>
                </div>
                <input
                  type="number"
                  placeholder="Minimum Salary"
                  value={company.avgpkg.from}
                  onChange={(e) => handleCompanyChange(index, "from", e)}
                  className="w-full rounded border p-2"
                />
                <input
                  type="number"
                  placeholder="Maximum Salary"
                  value={company.avgpkg.to}
                  onChange={(e) => handleCompanyChange(index, "to", e)}
                  className="w-full rounded border p-2"
                />
              </div>
            ))}
          </div>
        </fieldset>

        {/* Placement Opportunities */}
        <fieldset className="flex flex-col gap-4">
          <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            Placement Opportunities
            <FaPlusCircle
              onClick={addPlacementData}
              className="cursor-pointer text-green-600"
            />
          </h2>
          <div className="flex max-h-[20rem] flex-col gap-4 overflow-y-auto pr-2">
            {courseDetails?.placementOpportunities?.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Company or Role"
                  value={item}
                  onChange={(e) => handlePlacementChange(index, e)}
                  className="w-full rounded border p-2"
                />
                <button onClick={() => removePlacementData(index)}>❌</button>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default PlacementAverageSalary;
