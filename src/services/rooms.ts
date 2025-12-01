import { supabase } from "@/lib/supabase";
import { Room } from "@/types";

export const roomService = {
  async getAllRooms(): Promise<Room[]> {
    try {
      const { data, error } = await supabase?.from("rooms").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async getRoomById(id: string): Promise<Room | null> {
    try {
      const { data, error } = await supabase?.from("rooms").select("*").eq("id", id).single();

      if (error) throw error;
      return data;
    } catch (error) {
      return null;
    }
  },

  async createRoom(room: Omit<Room, "id" | "created_at" | "updated_at">) {
    try {
      const { data, error } = await supabase?.from("rooms").insert([room]).select().single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async updateRoom(id: string, room: Partial<Room>) {
    try {
      const { data, error } = await supabase?.from("rooms").update(room).eq("id", id).select().single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async deleteRoom(id: string) {
    try {
      const { error } = await supabase?.from("rooms").delete().eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};
