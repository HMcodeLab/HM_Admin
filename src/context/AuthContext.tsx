// contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

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
        },
      );

      const data = await res.json();
      if (data?.success) {
        setUser({
          name: data.data.firstName || "Super Admin",
          email: data.data.email || "",
          profilePhoto: data.data.profile || "",
        });
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
    localStorage.removeItem("adminToken");
    Cookies.remove("adminToken");
    setUser(null);
    router.push("/auth/sign-in");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
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
