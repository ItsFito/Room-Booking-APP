import { supabase } from "@/lib/supabase";
import { User } from "@/types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export const authService = {
  async register(email: string, password: string, fullName: string) {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role: "user",
        });

        if (profileError) throw profileError;
      }

      return { success: true, user: authData?.user };
    } catch (error) {
      throw error;
    }
  },

  async login(email: string, password: string) {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, user: data?.user };
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    if (!supabase) return null;
    try {
      const { data } = await supabase.auth.getUser();
      return data?.user;
    } catch {
      return null;
    }
  },

  async getUserProfile(userId: string): Promise<User | null> {
    if (!supabase) return null;
    try {
      const { data } = await supabase.from("users").select("*").eq("id", userId).single();
      return data;
    } catch {
      return null;
    }
  },

  async onAuthStateChange(callback: (user: SupabaseUser | null) => void) {
    if (!supabase) return undefined;
    const { data } = supabase.auth.onAuthStateChange((event: string, session) => {
      callback(session?.user || null);
    });

    return data?.subscription;
  },
};
