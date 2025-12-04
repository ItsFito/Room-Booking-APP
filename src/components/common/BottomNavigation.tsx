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

  const baseClasses = "transition-all duration-300 flex flex-col items-center justify-center sm:rounded-md rounded-t-lg";
  const activeClasses = "text-blue-600 bg-blue-100 sm:bg-blue-50 scale-105 sm:scale-100";
  const inactiveClasses = "text-gray-500 hover:text-gray-700 hover:bg-gray-100 sm:hover:bg-gray-100";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-linear-to-t sm:bg-white from-white to-gray-50 sm:to-white border-t-2 sm:border-t border-gray-300 sm:border-gray-200 z-50 shadow-2xl sm:shadow-lg rounded-t-3xl sm:rounded-none">
      <div className="w-full h-11 sm:h-14 px-1 sm:px-4 py-1 sm:py-2">
        <div className="flex justify-between items-center h-full gap-1 sm:gap-2">
          <Link href="/dashboard" className={`${baseClasses} flex-1 sm:px-3 ${pathname === "/dashboard" ? activeClasses : inactiveClasses}`}>
            <span className="text-[8px] sm:text-sm font-bold sm:font-medium leading-none">Dashboard</span>
          </Link>
          <Link href="/rooms" className={`${baseClasses} flex-1 sm:px-3 ${pathname.startsWith("/rooms") ? activeClasses : inactiveClasses}`}>
            <span className="text-[8px] sm:text-sm font-bold sm:font-medium leading-none">Rooms</span>
          </Link>
          <Link href="/bookings" className={`${baseClasses} flex-1 sm:px-3 ${pathname.startsWith("/bookings") ? activeClasses : inactiveClasses}`}>
            <span className="text-[8px] sm:text-sm font-bold sm:font-medium leading-none">Bookings</span>
          </Link>
          {isAdmin && (
            <Link href="/admin" className={`${baseClasses} flex-1 sm:px-3 ${pathname.startsWith("/admin") ? activeClasses : inactiveClasses}`}>
              <span className="text-[8px] sm:text-sm font-bold sm:font-medium leading-none">Admin</span>
            </Link>
          )}
          <Link href="/profile" className={`${baseClasses} flex-1 sm:px-3 ${pathname === "/profile" ? activeClasses : inactiveClasses}`}>
            <span className="text-[8px] sm:text-sm font-bold sm:font-medium leading-none">Profile</span>
          </Link>
          <button onClick={handleLogout} className={`${baseClasses} flex-1 sm:px-3 ${inactiveClasses}`}>
            <span className="text-[8px] sm:text-sm font-bold sm:font-medium leading-none">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
