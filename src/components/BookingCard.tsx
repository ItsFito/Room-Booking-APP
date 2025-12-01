"use client";

import { Booking, Room } from "@/types";
import Link from "next/link";
import { formatDate, formatTime } from "@/lib/utils";

interface BookingCardProps {
  booking: Booking;
  room?: Room;
}

export function BookingCard({ booking, room }: BookingCardProps) {
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

  return (
    <Link href={`/bookings/${booking.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900">{room?.name || "Room"}</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">📅 {formatDate(booking.start_date)}</p>
        <p className="text-sm text-gray-600 mb-2">
          ⏰ {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
        </p>
        {booking.token && <p className="text-xs text-gray-500 mt-2 font-mono">Token: {booking.token.substring(0, 8)}...</p>}
      </div>
    </Link>
  );
}
