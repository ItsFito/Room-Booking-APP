import { supabase } from "@/lib/supabase";
import { Booking } from "@/types";
import { generateToken } from "@/lib/utils";

export const bookingService = {
  async createBooking(booking: Omit<Booking, "id" | "created_at" | "updated_at">) {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { data, error } = await supabase.from("bookings").insert([booking]).select().single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from("bookings").select("*").eq("user_id", userId).order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async getAllBookings(): Promise<Booking[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async getBookingById(id: string): Promise<Booking | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from("bookings").select("*").eq("id", id).single();

      if (error) throw error;
      return data;
    } catch {
      return null;
    }
  },

  async updateBookingStatus(id: string, status: string) {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { data, error } = await supabase.from("bookings").update({ status, updated_at: new Date().toISOString() }).eq("id", id).select().single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async approveBooking(id: string, expiresAt: string) {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const token = generateToken();

      const { data, error } = await supabase
        .from("bookings")
        .update({
          status: "approved",
          token,
          token_expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async rejectBooking(id: string) {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({
          status: "rejected",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getUnavailableSlots(roomId: string, date: string) {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from("bookings").select("start_time, end_time").eq("room_id", roomId).eq("start_date", date).in("status", ["approved", "pending"]);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async deleteBooking(id: string) {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};
