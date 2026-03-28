import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { supabase } from "../../../api/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Pressable } from "react-native";

export default function EditEventScreen({ route, navigation }) {
  const { event } = route.params;

  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.event_date);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [time, setTime] = useState(event.time);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [location, setLocation] = useState(event.location);
  const [description, setDescription] = useState(event.description);
  const [additional_link, setAdditional_link] = useState(event.additional_link);
  const [image_url, setImage_url] = useState(event.image_url);
  const [category, setCategory] = useState(event.category);

  const handleUpdate = async () => {
    if (!title || !date || !time || !location) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase
        .from("event")
        .update({
          title,
          event_date: date,
          time,
          location,
          description,
          additional_link,
          image_url,
          category,
        })
        .eq("event_id", event.event_id);

      if (error) {
        alert("Error updating event");
      } else {
        alert("Event updated!");
        navigation.goBack();
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Event</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <Text style={styles.label}>Date</Text>
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

      <Text style={styles.label}>Time</Text>
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
              const timeString = pickedTime.toTimeString().slice(0, 5);
              setSelectedTime(pickedTime);
              setTime(timeString);
            }
          }}
        />
      )}

      <Text style={styles.label}>Location</Text>
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <Text style={styles.label}>Additional Link</Text>
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

      <View style={styles.buttonRow}>
        <Pressable style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 5 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 4, color: "#666" },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  saveButton: {
    flex: 1,
    backgroundColor: "#032D39",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#cc0000",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
});
