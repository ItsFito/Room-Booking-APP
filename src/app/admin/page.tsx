"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { roomService } from "@/services/rooms";
import { bookingService } from "@/services/bookings";
import { MainLayout } from "@/components/common/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const profileData = await authService.getUserProfile(currentUser.id);

          // Check if user is admin
          if (profileData?.role !== "admin") {
            window.location.href = "/dashboard";
            return;
          }

          setProfile(profileData);

          // Load statistics
          const allRooms = await roomService.getAllRooms();
          const allBookings = await bookingService.getAllBookings();
          const pendingBookings = allBookings.filter((b) => b.status === "pending");

          setStats({
            totalRooms: allRooms.length,
            totalBookings: allBookings.length,
            pendingBookings: pendingBookings.length,
          });
        }
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading)
    return (
      <MainLayout>
        <div className="p-4">Loading...</div>
      </MainLayout>
    );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Panel</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Total Rooms</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRooms}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Pending Approvals</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/rooms">
              <div className="bg-blue-50 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Manage Rooms</h2>
                <p className="text-gray-600 mb-4">Add, edit, or delete meeting rooms</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">Go to Rooms →</button>
              </div>
            </Link>

            <Link href="/admin/bookings">
              <div className="bg-green-50 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow border border-green-200">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Manage Bookings</h2>
                <p className="text-gray-600 mb-4">Approve or reject booking requests</p>
                <button className="text-green-600 hover:text-green-700 font-medium">Go to Bookings →</button>
              </div>
            </Link>

            <Link href="/admin/analytics">
              <div className="bg-purple-50 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow border border-purple-200 md:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-2">📊 Analytics Dashboard</h2>
                <p className="text-gray-600 mb-4">View insights and facility usage trends</p>
                <button className="text-purple-600 hover:text-purple-700 font-medium">View Reports →</button>
              </div>
            </Link>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
