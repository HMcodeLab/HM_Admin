// src/api/api.ts

import axios from "axios";
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
