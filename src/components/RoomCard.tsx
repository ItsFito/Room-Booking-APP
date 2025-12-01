"use client";

import { Room } from "@/types";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Link href={`/rooms/${room.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer">
        {room.image_url && (
          <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden">
            <img src={room.image_url} alt={room.name} className="w-full h-full object-cover" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{room.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Capacity</p>
            <p className="font-semibold text-gray-900">{room.capacity} persons</p>
          </div>
          <div>
            <p className="text-gray-500">Price/Hour</p>
            <p className="font-semibold text-gray-900">Rp {room.price_per_hour.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-2">📍 {room.location}</p>
      </div>
    </Link>
  );
}
