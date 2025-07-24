"use client";

// pages/add-freelancing.tsx
import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import FreelanceForm from "@/components/freelancing/FreelanceForm";
import { FreelancePost } from "@/types"; // ✅ Use shared type only

const initialFreelanceState: FreelancePost = {
  position: "",
  employment_type: "",
  key_skills: [],
  company: "",
  role_category: "",
  work_mode: "",
  location: "",
  work_experience: {
    isFresher: false,
    from: "", // ✅ Match type `string | number`
    to: "",
  },
  annual_salary_range: {
    from: 0,
    to: 0,
  },
  company_industry: "",
  educational_qualification: [],
  interview_mode: "",
  job_description: "",
  job_url: "",
  about_company: "",
  company_website_link: "",
  company_address: "",
  logoUrl: "",
  publishStatus: "",
  publishDate: "",
  lastDate: "",
  company_logo: "", // ✅ Match type `string`
};

const AddFreelancing: React.FC = () => {
  const [freelancePost, setFreelancePost] = useState<FreelancePost>(
    initialFreelanceState,
  );
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    const requiredFields: (keyof FreelancePost)[] = [
      "position",
      "company",
      "job_description",
      "employment_type",
    ];

    for (const field of requiredFields) {
      if (
        !freelancePost[field] ||
        (typeof freelancePost[field] === "string" &&
          freelancePost[field].trim() === "")
      ) {
        toast.error(`Please fill in the ${field.replace(/_/g, " ")} field.`);
        return false;
      }
    }

    return true;
  };

  const isFreelancePostChanged = () => {
    return (
      JSON.stringify(freelancePost) !== JSON.stringify(initialFreelanceState)
    );
  };

  const handleSubmit = async () => {
    if (!isFreelancePostChanged()) {
      toast.error("No changes made to the post.");
      return;
    }

    if (!validateFields()) {
      return;
    }

    setLoading(true);

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("adminToken") : "";

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/createFreelancerOpening`,
        freelancePost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        toast.success("Freelance post submitted successfully!");
        setFreelancePost(initialFreelanceState);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <FreelanceForm
        freelancePost={freelancePost}
        setFreelancePost={setFreelancePost}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </>
  );
};

export default AddFreelancing;
