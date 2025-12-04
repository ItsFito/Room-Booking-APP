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

  const baseClasses = "rounded-sm transition-colors duration-200 flex flex-col items-center justify-center";
  const activeClasses = "text-blue-600 bg-blue-50";
  const inactiveClasses = "text-gray-600 hover:text-gray-900 hover:bg-gray-50";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="w-full h-11 px-0 py-0.5">
        <div className="flex justify-between items-center h-full gap-0">
          <Link href="/dashboard" className={`${baseClasses} flex-1 px-0.5 ${pathname === "/dashboard" ? activeClasses : inactiveClasses}`}>
            <span className="text-[8px] font-bold leading-none">Dashboard</span>
          </Link>
          <Link href="/rooms" className={`${baseClasses} flex-1 px-0.5 ${pathname.startsWith("/rooms") ? activeClasses : inactiveClasses}`}>
            <span className="text-[8px] font-bold leading-none">Rooms</span>
          </Link>
          <Link href="/bookings" className={`${baseClasses} flex-1 px-0.5 ${pathname.startsWith("/bookings") ? activeClasses : inactiveClasses}`}>
            <span className="text-[8px] font-bold leading-none">Bookings</span>
          </Link>
          {isAdmin && (
            <Link href="/admin" className={`${baseClasses} flex-1 px-0.5 ${pathname.startsWith("/admin") ? activeClasses : inactiveClasses}`}>
              <span className="text-[8px] font-bold leading-none">Admin</span>
            </Link>
          )}
          <Link href="/profile" className={`${baseClasses} flex-1 px-0.5 ${pathname === "/profile" ? activeClasses : inactiveClasses}`}>
            <span className="text-[8px] font-bold leading-none">Profile</span>
          </Link>
          <button onClick={handleLogout} className={`${baseClasses} flex-1 px-0.5 ${inactiveClasses}`}>
            <span className="text-[8px] font-bold leading-none">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
