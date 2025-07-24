"use client";

import { Company, InternshipData } from "@/types";
import React from "react";
import { FaPlusCircle } from "react-icons/fa";

export interface PlacementAverageSalaryProps {
  courseDetails: InternshipData;
  setCourseDetails: React.Dispatch<React.SetStateAction<InternshipData>>;
}

const PlacementAverageSalary: React.FC<PlacementAverageSalaryProps> = ({
  courseDetails,
  setCourseDetails,
}) => {
  const handleCompanyChange = (
    index: number,
    field: "companyName" | "from" | "to",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const updatedCompanies = [...courseDetails.companies_hiring];
    const updatedCompany = { ...updatedCompanies[index] };

    if (field === "from" || field === "to") {
      const value = Number(e.target.value);
      if (isNaN(value)) {
        alert("Please enter a valid number");
        return;
      }
      updatedCompany.avgpkg = { ...updatedCompany.avgpkg, [field]: value };
    } else if (field === "companyName") {
      updatedCompany.companyName = e.target.value;
    }

    updatedCompanies[index] = updatedCompany;
    setCourseDetails({ ...courseDetails, companies_hiring: updatedCompanies });
  };

  const removeCompany = (index: number) => {
    const updatedCompanies = courseDetails.companies_hiring.filter(
      (_, i) => i !== index,
    );
    setCourseDetails({ ...courseDetails, companies_hiring: updatedCompanies });
  };

  const addCompany = () => {
    setCourseDetails({
      ...courseDetails,
      companies_hiring: [
        ...courseDetails.companies_hiring,
        { companyName: "", avgpkg: { from: 0, to: 0 } },
      ],
    });
  };

  const addPlacementData = () => {
    setCourseDetails({
      ...courseDetails,
      placementOpportunities: [...courseDetails.placementOpportunities, ""],
    });
  };

  const removePlacementData = (indexToRemove: number) => {
    setCourseDetails({
      ...courseDetails,
      placementOpportunities: courseDetails.placementOpportunities.filter(
        (_, index) => index !== indexToRemove,
      ),
    });
  };

  const handlePlacementChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const updatedPlacementData = [...courseDetails.placementOpportunities];
    updatedPlacementData[index] = e.target.value;
    setCourseDetails({
      ...courseDetails,
      placementOpportunities: updatedPlacementData,
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-6">
        <h1 className="font-Montserrat py-4 text-3xl font-semibold text-green-600 dark:text-green-300">
          Average Salary & Placement Opportunities
        </h1>

        <div className="grid grid-cols-1 gap-6 rounded-md bg-gray-100 p-6 shadow-md dark:bg-gray-900 md:grid-cols-2">
          {/* Companies */}
          <fieldset className="flex flex-col gap-4">
            <h2 className="font-Montserrat flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-gray-200">
              Companies
              <FaPlusCircle
                onClick={addCompany}
                className="cursor-pointer text-green-600 transition hover:text-green-800 dark:text-green-400 dark:hover:text-green-600"
                aria-label="Add Company"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") addCompany();
                }}
              />
            </h2>

            <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800 flex max-h-56 flex-col gap-4 overflow-y-auto pr-2">
              {courseDetails?.companies_hiring?.map((company, index) => (
                <div
                  key={index}
                  className="relative flex flex-col gap-3 rounded-md bg-white p-4 shadow-sm dark:bg-gray-800"
                >
                  <input
                    placeholder="Company Name"
                    value={company.companyName}
                    onChange={(e) =>
                      handleCompanyChange(index, "companyName", e)
                    }
                    className="rounded-md border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
                  />

                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Minimum Pay"
                      value={company.avgpkg.from}
                      onChange={(e) => handleCompanyChange(index, "from", e)}
                      className="flex-1 rounded-md border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
                    />
                    <input
                      type="number"
                      placeholder="Maximum Pay"
                      value={company.avgpkg.to}
                      onChange={(e) => handleCompanyChange(index, "to", e)}
                      className="flex-1 rounded-md border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove company ${company.companyName || index + 1}`}
                    onClick={() => removeCompany(index)}
                    className="absolute right-2 top-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Placement Opportunities */}
          <fieldset className="flex flex-col gap-4">
            <h2 className="font-Montserrat flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-gray-200">
              Placement Opportunities
              <FaPlusCircle
                onClick={addPlacementData}
                className="cursor-pointer text-green-600 transition hover:text-green-800 dark:text-green-400 dark:hover:text-green-600"
                aria-label="Add Placement Opportunity"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") addPlacementData();
                }}
              />
            </h2>

            <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800 flex max-h-56 flex-col gap-4 overflow-y-auto pr-2">
              {courseDetails?.placementOpportunities?.map((item, index) => (
                <div
                  key={index}
                  className="relative flex items-center gap-3 rounded-md bg-white p-4 shadow-sm dark:bg-gray-800"
                >
                  <input
                    placeholder="Placement or Company Name"
                    value={item}
                    onChange={(e) => handlePlacementChange(index, e)}
                    className="flex-grow rounded-md border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    aria-label={`Remove placement opportunity ${index + 1}`}
                    onClick={() => removePlacementData(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default PlacementAverageSalary;
