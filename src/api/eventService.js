import { supabase } from "./supabase";

// Handles database interaction
export async function createEvent(eventData) {
  const { data, error } = await supabase
    .from("event")
    .insert([eventData]);

  if (error) {
    console.error("Supabase Error:", error);
    throw error;
  }

  return data;
}