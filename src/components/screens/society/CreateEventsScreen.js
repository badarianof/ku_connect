import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { handleCreateEvent } from "../../controller/eventController";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Pressable } from "react-native";

export default function CreateEventsScreen() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [additional_link, setAdditional_link] = useState("");
  const [image_url, setImage_url] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async () => {
    if (!title || !date || !time || !location) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const result = await handleCreateEvent({
        title,
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

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

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

      <TextInput
        placeholder="Time (HH:MM)"
        value={time}
        onChangeText={setTime}
        style={styles.input}
      />

      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <TextInput
        placeholder="Additional Link"
        value={additional_link}
        onChangeText={setAdditional_link}
        style={styles.input}
      />

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
});
