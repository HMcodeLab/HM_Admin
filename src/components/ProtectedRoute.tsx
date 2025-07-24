"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    const hasAccess = user.roles.some((role) => allowedRoles.includes(role));
    if (!hasAccess) {
      router.replace("/not-authorized");
    }
  }, [user, allowedRoles, router]);

  if (!user || !user.roles.some((role) => allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
