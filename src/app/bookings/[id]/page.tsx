"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { bookingService } from "@/services/bookings";
import { roomService } from "@/services/rooms";
import { MainLayout } from "@/components/common/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Booking, Room } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const bookingData = await bookingService.getBookingById(bookingId);
        if (bookingData) {
          setBooking(bookingData);
          const roomData = await roomService.getRoomById(bookingData.room_id);
          setRoom(roomData);
        }
      } catch (error) {
        console.error("Error loading booking:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookingId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return (
      <MainLayout>
        <div className="p-4">Loading...</div>
      </MainLayout>
    );
  if (!booking)
    return (
      <MainLayout>
        <div className="p-4">Booking not found</div>
      </MainLayout>
    );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button onClick={() => router.back()} className="mb-6 text-blue-600 hover:text-blue-700 font-medium">
            ← Back
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{room?.name || "Room"}</h1>
                <p className="text-gray-600">{room?.description}</p>
              </div>
              <span className={`px-4 py-2 rounded-lg font-medium ${getStatusColor(booking.status)}`}>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">Date</p>
                <p className="text-xl font-semibold text-gray-900">{formatDate(booking.start_date)}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">Time</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">Location</p>
                <p className="text-xl font-semibold text-gray-900">{room?.location}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">Capacity</p>
                <p className="text-xl font-semibold text-gray-900">{room?.capacity} persons</p>
              </div>
            </div>

            {booking.token && (
              <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
                <p className="text-gray-600 text-sm mb-2">Booking Token</p>
                <p className="text-lg font-mono font-semibold text-gray-900 break-all">{booking.token}</p>
                {booking.token_expires_at && <p className="text-xs text-gray-600 mt-2">Expires: {formatDate(booking.token_expires_at)}</p>}
              </div>
            )}

            {booking.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-2">Notes</p>
                <p className="text-gray-900">{booking.notes}</p>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
