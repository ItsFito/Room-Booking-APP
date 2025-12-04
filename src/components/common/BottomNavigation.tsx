"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { toast } from "sonner";

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const profile = await authService.getUserProfile(currentUser.id);
        setIsAdmin(profile?.role === "admin");
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (!user) return null;

  const baseClasses = "px-3 py-2 rounded-lg transition-colors";
  const activeClasses = "text-blue-600 bg-blue-50";
  const inactiveClasses = "text-gray-600 hover:text-gray-900";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="w-full px-2 py-2 sm:px-4">
        <div className="flex justify-around items-center gap-1 sm:gap-2">
          <Link href="/dashboard" className={`${baseClasses} flex-1 text-center ${pathname === "/dashboard" ? activeClasses : inactiveClasses}`}>
            <span className="text-xs sm:text-sm font-medium block">Dashboard</span>
          </Link>
          <Link href="/rooms" className={`${baseClasses} flex-1 text-center ${pathname.startsWith("/rooms") ? activeClasses : inactiveClasses}`}>
            <span className="text-xs sm:text-sm font-medium block">Rooms</span>
          </Link>
          <Link href="/bookings" className={`${baseClasses} flex-1 text-center ${pathname.startsWith("/bookings") ? activeClasses : inactiveClasses}`}>
            <span className="text-xs sm:text-sm font-medium block">Bookings</span>
          </Link>
          {isAdmin && (
            <Link href="/admin" className={`${baseClasses} flex-1 text-center ${pathname.startsWith("/admin") ? activeClasses : inactiveClasses}`}>
              <span className="text-xs sm:text-sm font-medium block">Admin</span>
            </Link>
          )}
          <Link href="/profile" className={`${baseClasses} flex-1 text-center ${pathname === "/profile" ? activeClasses : inactiveClasses}`}>
            <span className="text-xs sm:text-sm font-medium block">Profile</span>
          </Link>
          <button onClick={handleLogout} className={`${baseClasses} flex-1 text-center ${inactiveClasses}`}>
            <span className="text-xs sm:text-sm font-medium block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

