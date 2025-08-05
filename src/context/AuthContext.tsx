"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";

type User = {
  name: string;
  email: string;
  profilePhoto: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (token: string, remember: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLoggedOut, setHasLoggedOut] = useState(false); // 🔹 Prevent multiple logout calls

  useEffect(() => {
    const token = Cookies.get("adminToken");
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const email = decoded?.email;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/admin?email=${encodeURIComponent(email)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data?.success) {
        setUser({
          name: data.data.firstName || "Super Admin",
          email: data.data.email || "",
          profilePhoto: data.data.profile || "",
        });
      } else {
        logout(); // token invalid
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (token: string, remember: boolean) => {
    localStorage.setItem("adminToken", token);
    Cookies.set("adminToken", token, {
      expires: remember ? 7 : 1,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    fetchUserData(token);
  };

  const logout = () => {
    if (hasLoggedOut) return; // 🔹 Avoid multiple toasts
    setHasLoggedOut(true);
    toast.error("Session expired or invalid token");
    localStorage.removeItem("adminToken");
    Cookies.remove("adminToken");
    setUser(null);
    router.replace("/auth/sign-in"); // 🔹 replace to avoid back navigation
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <span className="loader" /> {/* 🔹 Show loader until auth check finishes */}
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
