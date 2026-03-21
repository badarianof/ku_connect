import { createEvent } from "../../api/eventService";

// Controller handles logic between UI and data
export async function handleCreateEvent(eventData) {
  try {
    const result = await createEvent(eventData);
    return result;
  } catch (error) {
    console.error("Controller Error:", error);
    throw error;
  }
}