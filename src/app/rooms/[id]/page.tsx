"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { roomService } from "@/services/rooms";
import { bookingService } from "@/services/bookings";
import { MainLayout } from "@/components/common/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Room } from "@/types";
import { toast } from "sonner";
import { authService } from "@/services/auth";

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        const roomData = await roomService.getRoomById(roomId);
        setRoom(roomData);
      } catch (error) {
        console.error("Error loading room:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [roomId]);

  const handleBookNow = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    router.push(`/bookings/create?roomId=${roomId}`);
  };

  if (loading)
    return (
      <MainLayout>
        <div className="p-4">Loading...</div>
      </MainLayout>
    );
  if (!room)
    return (
      <MainLayout>
        <div className="p-4">Room not found</div>
      </MainLayout>
    );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button onClick={() => router.back()} className="mb-6 text-blue-600 hover:text-blue-700 font-medium">
            ← Back
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {room.image_url && (
              <div className="w-full h-64 bg-gray-200 overflow-hidden">
                <img src={room.image_url} alt={room.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{room.name}</h1>

              <p className="text-gray-600 text-lg mb-6">{room.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Capacity</p>
                  <p className="text-2xl font-bold text-gray-900">{room.capacity} persons</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Price per Hour</p>
                  <p className="text-2xl font-bold text-gray-900">Rp {room.price_per_hour.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="text-lg font-semibold text-gray-900">{room.location}</p>
                </div>
              </div>

              <button onClick={handleBookNow} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Book This Room
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
