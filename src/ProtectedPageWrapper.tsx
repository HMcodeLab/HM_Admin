"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

type Props = { children: ReactNode };

export default function ProtectedPageWrapper({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/auth/sign-in");
    }
  }, [router]);

  return <>{children}</>;
}
