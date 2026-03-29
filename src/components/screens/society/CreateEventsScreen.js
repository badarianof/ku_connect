import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useSociety } from "../../../context/SocietyContext";
import { handleCreateEvent } from "../../controller/eventController";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Pressable } from "react-native";

export default function CreateEventsScreen() {
  const { society } = useSociety();

  if (!society) {
    return (
      <View>
        <Text>No society selected</Text>
      </View>
    );
  }

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [time, setTime] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [additional_link, setAdditional_link] = useState("");
  const [image_url, setImage_url] = useState("");
  const default_image =
    "https://thumbs.dreamstime.com/b/have-fun-brush-lettering-hand-inspiring-quote-stain-background-motivating-modern-calligraphy-can-be-used-photo-overlays-75591520.jpg?w=768";

  const CATEGORIES = [
    "On Campus",
    "Off Campus",
    "Free",
    "Members Only",
    "Open to All",
    "Online",
  ];

  const [category, setCategory] = useState(
    event?.category ? event.category.split(",") : []
  );

  const toggleCategory = (item) => {
    setCategory((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const handleSubmit = async () => {
    if (!title || !date || !time || !location) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const result = await handleCreateEvent({
        title,
        society_id: society.society_id,
        date,
        time,
        location,
        description,
        additional_link,
        image_url,
        category,
      });

      if (result?.error) {
        alert("Error creating event");
      } else {
        alert("Event created!");

        // reset form
        setTitle("");
        setDate("");
        setTime("");
        setLocation("");
        setDescription("");
        setAdditional_link("");
        setImage_url("");
        setCategory("");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Event</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <Pressable onPress={() => setShowDatePicker(true)}>
        <Text style={styles.input}>{date ? date : "Select Date"}</Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, pickedDate) => {
            setShowDatePicker(false);

            if (pickedDate) {
              const formatted = pickedDate.toISOString().split("T")[0];
              setSelectedDate(pickedDate);
              setDate(formatted);
            }
          }}
        />
      )}

      <Pressable onPress={() => setShowTimePicker(true)}>
        <Text style={styles.input}>{time ? time : "Select Time"}</Text>
      </Pressable>

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime || new Date()}
          mode="time"
          display="default"
          onChange={(event, pickedTime) => {
            setShowTimePicker(false);

            if (pickedTime) {
              const timeString = pickedTime.toTimeString().slice(0, 5); // HH:MM
              setSelectedTime(pickedTime);
              setTime(timeString);
            }
          }}
        />
      )}

      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {CATEGORIES.map((item) => (
          <Pressable
            key={item}
            style={[
              styles.categoryChip,
              category.includes(item) && styles.categoryChipSelected,
            ]}
            onPress={() => toggleCategory(item)}
          >
            <Text
              style={[
                styles.categoryChipText,
                category.includes(item) && styles.categoryChipTextSelected,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        placeholder="Additional Link"
        value={additional_link}
        onChangeText={setAdditional_link}
        style={styles.input}
      />

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        placeholder="Image URL"
        value={image_url}
        onChangeText={setImage_url}
        style={styles.input}
      />

      <Button title="Submit Event" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: "#032D39",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryChipSelected: { backgroundColor: "#032D39" },
  categoryChipText: { color: "#032D39" },
  categoryChipTextSelected: { color: "white" },
});
