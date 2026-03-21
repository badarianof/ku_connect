import { supabase } from "./supabase";

// CREATE EVENT
export async function createEvent(eventData) {
  const { data, error } = await supabase
    .from("event")
    .insert([eventData]);

  if (error) {
    console.error("Error creating event:", error);
    return { error };
  }

  return { data };
}