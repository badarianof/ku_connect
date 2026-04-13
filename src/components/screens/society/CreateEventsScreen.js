import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { useState } from "react";
import { useSociety } from "../../../context/SocietyContext";
import { handleCreateEvent } from "../../controller/eventController";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, spacing, radius } from "../../../theme";
import { KeyboardAvoidingView, Platform } from "react-native";

// Available event categories for multi-select
const CATEGORIES = [
  "On Campus",
  "Off Campus",
  "Free",
  "Members Only",
  "Open to All",
  "Online",
];

// Default image used when no image URL is provided
const DEFAULT_IMAGE =
  "https://thumbs.dreamstime.com/b/have-fun-brush-lettering-hand-inspiring-quote-stain-background-motivating-modern-calligraphy-can-be-used-photo-overlays-75591520.jpg?w=768";

export default function CreateEventsScreen() {
  // Get current society from global context
  const { society } = useSociety();

  // Form field states
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
  const [category, setCategory] = useState([]);

  // Toggle a category on or off in the selection
  const toggleCategory = (item) => {
    setCategory((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  // Submit new event to Supabase via event controller
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
        // Use default image if no URL provided
        image_url: image_url || DEFAULT_IMAGE,
        category: category.join(","),
      });

      if (result?.error) {
        alert("Error creating event");
      } else {
        alert("Event created!");
        // Reset all form fields after successful submission
        setTitle("");
        setDate("");
        setTime("");
        setLocation("");
        setDescription("");
        setAdditional_link("");
        setImage_url("");
        setCategory([]);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  if (!society) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No society selected</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}      >
        <Text style={styles.title}>Create Event</Text>

        {/* Title field */}
        <Text style={styles.label}>Title *</Text>
        <TextInput
          placeholder="Event title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholderTextColor={colors.neutral}
        />

        {/* Description field */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="What is this event about?"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.multiline]}
          multiline
          numberOfLines={3}
          placeholderTextColor={colors.neutral}
        />

        {/* Date picker */}
        <Text style={styles.label}>Date *</Text>
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
        <Text style={styles.label}>Time *</Text>
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
        <Text style={styles.label}>Location *</Text>
        <TextInput
          placeholder="Where is this event?"
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
          placeholder="Ticket link, sign up form, etc."
          value={additional_link}
          onChangeText={setAdditional_link}
          style={styles.input}
          placeholderTextColor={colors.neutral}
        />

        {/* Image URL field */}
        <Text style={styles.label}>Image URL</Text>
        <TextInput
          placeholder="Cover image URL"
          value={image_url}
          onChangeText={setImage_url}
          style={styles.input}
          placeholderTextColor={colors.neutral}
        />

        {/* Submit button */}
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Create Event</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: colors.grey },
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
  submitButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.full,
    alignItems: "center",
    marginTop: spacing.md,
  },
  submitText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
});
