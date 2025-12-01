"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { roomService } from "@/services/rooms";
import { MainLayout } from "@/components/common/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Room } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminRoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: 1,
    location: "",
    price_per_hour: 0,
    image_url: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          const profile = await authService.getUserProfile(currentUser.id);
          if (profile?.role !== "admin") {
            router.push("/dashboard");
            return;
          }
        }

        const allRooms = await roomService.getAllRooms();
        setRooms(allRooms);
      } catch (error) {
        console.error("Error loading rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location) {
      toast.error("Name and location are required");
      return;
    }

    try {
      if (editingRoom) {
        const updated = await roomService.updateRoom(editingRoom.id, formData);
        setRooms(rooms.map((r) => (r.id === updated.id ? updated : r)));
        toast.success("Room updated successfully");
      } else {
        const created = await roomService.createRoom(formData as any);
        setRooms([...rooms, created]);
        toast.success("Room created successfully");
      }

      setFormData({
        name: "",
        description: "",
        capacity: 1,
        location: "",
        price_per_hour: 0,
        image_url: "",
      });
      setEditingRoom(null);
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save room");
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description,
      capacity: room.capacity,
      location: room.location,
      price_per_hour: room.price_per_hour,
      image_url: room.image_url || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      try {
        await roomService.deleteRoom(id);
        setRooms(rooms.filter((r) => r.id !== id));
        toast.success("Room deleted successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete room");
      }
    }
  };

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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Manage Rooms</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingRoom(null);
                setFormData({
                  name: "",
                  description: "",
                  capacity: 1,
                  location: "",
                  price_per_hour: 0,
                  image_url: "",
                });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {showForm ? "Cancel" : "+ Add Room"}
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingRoom ? "Edit Room" : "Create New Room"}</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (persons)</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Hour (Rp)</label>
                    <input
                      type="number"
                      value={formData.price_per_hour}
                      onChange={(e) => setFormData({ ...formData, price_per_hour: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  {editingRoom ? "Update Room" : "Create Room"}
                </button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{room.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>

                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <p className="text-gray-500">Capacity</p>
                    <p className="font-semibold">{room.capacity} persons</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Price/Hour</p>
                    <p className="font-semibold">Rp {room.price_per_hour.toLocaleString()}</p>
                  </div>
                </div>

                <p className="text-gray-500 text-xs mb-4">📍 {room.location}</p>

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(room)} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(room.id)} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {rooms.length === 0 && !showForm && <p className="text-center text-gray-600">No rooms yet. Create one to get started!</p>}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
