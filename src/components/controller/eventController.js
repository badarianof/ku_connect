import { createEvent } from "../../api/eventService";

export async function handleCreateEvent(formData) {
  const eventData = {
    society_id: formData.society_id,
    title: formData.title,
    event_date: formData.date,
    time: formData.time,
    location: formData.location,
    description: formData.description,
    additional_link: formData.additional_link,
    image_url: formData.image_url,
    category: formData.category || "General",
  };

  return await createEvent(eventData);
}
