import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { useState } from "react";
import { supabase } from "../../../api/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, spacing, radius } from "../../../theme";

// Available event categories for multi-select
const CATEGORIES = [
  "On Campus",
  "Off Campus",
  "Free",
  "Members Only",
  "Open to All",
  "Online",
];

export default function EditEventScreen({ route, navigation }) {
  // Get event passed via navigation params
  const { event } = route.params;

  // Form field states pre-populated with existing event data
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

  // Parse saved category string back into array, filtering only valid values
  const [category, setCategory] = useState(() => {
    if (!event?.category) return [];
    if (Array.isArray(event.category)) return event.category;
    return event.category
      .split(",")
      .map((c) => c.trim())
      .filter((c) => CATEGORIES.includes(c));
  });

  // Toggle a category on or off in the selection
  const toggleCategory = (item) => {
    setCategory((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  // Save updated event data to Supabase
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
          category: category.join(","),
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

      {/* Title field */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholderTextColor={colors.neutral}
      />

      {/* Description field */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.multiline]}
        multiline
        numberOfLines={3}
        placeholderTextColor={colors.neutral}
      />

      {/* Date picker */}
      <Text style={styles.label}>Date</Text>
      <Pressable onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text style={{ color: date ? colors.primaryText : colors.neutral }}>
          {date ? date : "Select Date"}
        </Text>
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

      {/* Time picker */}
      <Text style={styles.label}>Time</Text>
      <Pressable onPress={() => setShowTimePicker(true)} style={styles.input}>
        <Text style={{ color: time ? colors.primaryText : colors.neutral }}>
          {time ? time : "Select Time"}
        </Text>
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

      {/* Location field */}
      <Text style={styles.label}>Location</Text>
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
        placeholderTextColor={colors.neutral}
      />

      {/* Multi-select category chips */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {CATEGORIES.map((item) => (
          <Pressable
            key={item}
            style={[
              styles.chip,
              category.includes(item) && styles.chipSelected,
            ]}
            onPress={() => toggleCategory(item)}
          >
            <Text
              style={[
                styles.chipText,
                category.includes(item) && styles.chipTextSelected,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Additional link field */}
      <Text style={styles.label}>Additional Link</Text>
      <TextInput
        placeholder="Additional Link"
        value={additional_link}
        onChangeText={setAdditional_link}
        style={styles.input}
        placeholderTextColor={colors.neutral}
      />

      {/* Image URL field */}
      <Text style={styles.label}>Image URL</Text>
      <TextInput
        placeholder="Image URL"
        value={image_url}
        onChangeText={setImage_url}
        style={styles.input}
        placeholderTextColor={colors.neutral}
      />

      {/* Save and cancel buttons */}
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
  container: {
    padding: spacing.xl,
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: spacing.lg,
    color: colors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: spacing.xs,
    color: colors.grey,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    color: colors.primaryText,
  },
  multiline: { height: 80, textAlignVertical: "top" },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipSelected: { backgroundColor: colors.primary },
  chipText: { color: colors.primary, fontSize: 13 },
  chipTextSelected: { color: colors.white },
  buttonRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: "center",
  },
  buttonText: { color: colors.white, fontWeight: "bold" },
});
