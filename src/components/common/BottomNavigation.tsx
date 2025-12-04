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

  const baseClasses = "py-1.5 sm:py-2 rounded-md transition-colors duration-200 flex flex-col items-center justify-center min-h-14 sm:min-h-16";
  const activeClasses = "text-blue-600 bg-blue-50";
  const inactiveClasses = "text-gray-600 hover:text-gray-900 hover:bg-gray-50";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="w-full h-14 sm:h-16 px-1 sm:px-2">
        <div className="flex justify-between items-stretch h-full gap-0.5 sm:gap-1">
          <Link href="/dashboard" className={`${baseClasses} flex-1 ${pathname === "/dashboard" ? activeClasses : inactiveClasses}`}>
            <span className="text-[10px] sm:text-xs font-semibold">Dashboard</span>
          </Link>
          <Link href="/rooms" className={`${baseClasses} flex-1 ${pathname.startsWith("/rooms") ? activeClasses : inactiveClasses}`}>
            <span className="text-[10px] sm:text-xs font-semibold">Rooms</span>
          </Link>
          <Link href="/bookings" className={`${baseClasses} flex-1 ${pathname.startsWith("/bookings") ? activeClasses : inactiveClasses}`}>
            <span className="text-[10px] sm:text-xs font-semibold">Bookings</span>
          </Link>
          {isAdmin && (
            <Link href="/admin" className={`${baseClasses} flex-1 ${pathname.startsWith("/admin") ? activeClasses : inactiveClasses}`}>
              <span className="text-[10px] sm:text-xs font-semibold">Admin</span>
            </Link>
          )}
          <Link href="/profile" className={`${baseClasses} flex-1 ${pathname === "/profile" ? activeClasses : inactiveClasses}`}>
            <span className="text-[10px] sm:text-xs font-semibold">Profile</span>
          </Link>
          <button onClick={handleLogout} className={`${baseClasses} flex-1 ${inactiveClasses}`}>
            <span className="text-[10px] sm:text-xs font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}


