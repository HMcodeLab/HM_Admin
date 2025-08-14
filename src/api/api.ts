// src/api/api.ts

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_SERVER_DOMAIN;

if (!API_URL) {
  console.error("❌ API base URL is missing from environment variables.");
}

const getAuthHeaders = (adminToken: string) => ({
  headers: {
    Authorization: `Bearer ${adminToken}`,
  },
});

// export const verifyadminuser = async (adminToken: string) => {
//   try {
//     const headers = getAuthHeaders(adminToken);
//     console.log("🔐 Auth Headers:", headers);

//     const response = await axios.get(
//       `${API_URL}/verifyadminuser/dashboard`,
//       headers,
//     );

//     console.log("✅ User verified:", response);
//     return response?.data || [];
//   } catch (error: any) {
//     console.error("❌ Error fetching verifyadminuser:", error.message || error);
//     toast.error("Failed to fetch verifyadminuser");
//     return [];
//   }
// };

// 🔹 Fetch Enquiries
export const fetchEnquiries = async (adminToken: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/getAllEnquiry`,
      getAuthHeaders(adminToken),
    );
    return response.data.enquiries || [];
  } catch (error: any) {
    console.error("❌ Error fetching enquiries:", error.message || error);
    toast.error("Failed to fetch enquiries");
    return [];
  }
};

// 🔹 Fetch Courses
export const fetchCoursesForAdmin = async (adminToken: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/coursesforadmin`,
      getAuthHeaders(adminToken),
    );
    return response.data || [];
  } catch (error: any) {
    console.error("❌ Error fetching courses:", error.message || error);
    toast.error("Failed to fetch courses");
    return [];
  }
};

// 🔹 Fetch Universities
export const fetchUniversityCount = async (adminToken: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/collegeUsers`,
      getAuthHeaders(adminToken),
    );
    return response?.data?.data || [];
  } catch (error: any) {
    console.error("❌ Error fetching universities:", error.message || error);
    toast.error("Failed to fetch universities");
    return [];
  }
};
// 🔹 Fetch Payments
export const fetchPayments = async (adminToken: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/getallorders`,
      getAuthHeaders(adminToken),
    );
    return response?.data || [];
  } catch (error: any) {
    console.error("❌ Error fetching payments:", error.message || error);
    toast.error("Failed to fetch payments");
    return [];
  }
};

// 🔹 Fetch Course by Admin Email
export const fetchCourseID = async (adminToken: string, adminEmail: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin?email=${encodeURIComponent(adminEmail)}`,
      getAuthHeaders(adminToken),
    );
    // console.log("🔍 Fetching course ID for admin email:", response);
    return response?.data|| [];
  } catch (error: any) {
    console.error("❌ Error fetching id:", error.message || error);
    toast.error("Failed to fetch id");
    return [];
  }
};

