import { supabase } from "@/lib/supabase";
import { User } from "@/types";

export const authService = {
  async register(email: string, password: string, fullName: string) {
    try {
      const { data: authData, error: authError } = await supabase?.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        const { error: profileError } = await supabase?.from("users").insert({
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
    try {
      const { data, error } = await supabase?.auth.signInWithPassword({
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
    try {
      const { error } = await supabase?.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const { data, error } = await supabase?.auth.getUser();
      if (error) return null;
      return data?.user;
    } catch (error) {
      return null;
    }
  },

  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase?.from("users").select("*").eq("id", userId).single();

      if (error) return null;
      return data;
    } catch (error) {
      return null;
    }
  },

  async onAuthStateChange(callback: (user: any) => void) {
    const { data } = supabase?.auth.onAuthStateChange((event: string, session: any) => {
      callback(session?.user || null);
    }) || { data: null };

    return data?.subscription;
  },
};
