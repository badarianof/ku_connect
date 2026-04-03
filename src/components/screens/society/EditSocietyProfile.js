import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { supabase } from "../../../api/supabase";
import { useSociety } from "../../../context/SocietyContext";

export default function EditSocietyProfile({ navigation }) {
  const { society, setSociety } = useSociety();

  const [name, setName] = useState(society.society_name);
  const [description, setDescription] = useState(society.description);
  const [imageUrl, setImageUrl] = useState(society.image_url || "");

  const handleSave = async () => {
    const { error } = await supabase
      .from("society")
      .update({
        society_name: name,
        description,
        image_url: imageUrl,
      })
      .eq("society_id", society.society_id);

    if (error) {
      alert("Error updating profile");
      return;
    }

    setSociety({
      ...society,
      society_name: name,
      description,
      image_url: imageUrl,
    });
    alert("Profile updated!");
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Society Profile</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Society name"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.multiline]}
        placeholder="Society description"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Image URL (cover image)</Text>
      <TextInput
        value={imageUrl}
        onChangeText={setImageUrl}
        style={styles.input}
        placeholder="Image URL"
      />

      <View style={styles.buttonRow}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </Pressable>
        <Pressable
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Discard Changes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 4, color: "#666" },
  input: { borderWidth: 1, padding: 10, borderRadius: 6, marginBottom: 12 },
  multiline: { height: 100, textAlignVertical: "top" },
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
