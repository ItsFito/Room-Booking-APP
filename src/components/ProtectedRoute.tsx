"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authService } from "@/services/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authService.getCurrentUser();
      if (!user) {
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
}
