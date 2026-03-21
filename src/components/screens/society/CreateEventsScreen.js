import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { handleCreateEvent } from "../../controller/eventController";

export default function CreateEventScreen() {
  // STATE (UI only for now)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Event</Text>

      {/* Event Title Input */}
      <TextInput
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      {/* Event Description Input */}
      <TextInput
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <Button
        title="Create Event"
        onPress={async () => {
          const newEvent = {
            title: title,
            description: description,
            society_id: "PUT_REAL_ID_HERE", // temporary
          };

          try {
            await handleCreateEvent(newEvent);
            alert("Event created!");
          } catch (error) {
            alert("Error creating event");
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
});
