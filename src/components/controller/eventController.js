import { createEvent } from "../../api/eventService";

export async function handleCreateEvent(formData) {
  const eventData = {
    society_id: "f968cdfe-3264-45a7-b1a3-e4ae6643e948",
    title: formData.title,
    event_date: formData.date,
    time: formData.time,
    location: formData.location,
    description: formData.description,
    additional_link: formData.additional_link,
    image_url: formData.image_url,
    category: formData.category || "General",
    // event_status: "pending",
  };

  return await createEvent(eventData);
}
