"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Room Booking System</h1>
        <p className="text-xl text-blue-100 mb-8 max-w-md">Modern PWA application for booking meeting rooms and conference halls</p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center">
          <Link href="/auth/login" className="w-full">
            <button className="w-full bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg">
              Sign In
            </button>
          </Link>
          <Link href="/auth/register" className="w-full">
            <button className="w-full bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
              Create Account
            </button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="bg-white rounded-xl p-8 shadow-xl text-gray-900 transform hover:-translate-y-1 transition-transform duration-200">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold mb-2 text-blue-600">Browse Rooms</h3>
            <p className="text-gray-600">Browse available meeting rooms with detailed information</p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-xl text-gray-900 transform hover:-translate-y-1 transition-transform duration-200">
            <div className="text-4xl mb-4">🎫</div>
            <h3 className="text-xl font-bold mb-2 text-blue-600">Book Easily</h3>
            <p className="text-gray-600">Simple booking process with real-time availability</p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-xl text-gray-900 transform hover:-translate-y-1 transition-transform duration-200">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2 text-blue-600">Mobile Ready</h3>
            <p className="text-gray-600">Works offline and installs like a native app</p>
          </div>
        </div>
      </div>
    </div>
  );
}
