import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { supabase } from "../../../api/supabase";
import { useSociety } from "../../../context/SocietyContext";
import { colors, spacing, radius } from "../../../theme";

export default function EditSocietyProfile({ navigation }) {
  // Get current society and setter from global context
  const { society, setSociety } = useSociety();

  // Form fields pre-populated with existing society data
  const [name, setName] = useState(society.society_name);
  const [description, setDescription] = useState(society.description ?? "");
  const [imageUrl, setImageUrl] = useState(society.image_url ?? "");

  // Save updated society info to Supabase and update context
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

    // Update global context so other screens reflect changes immediately
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Society name field */}
        <Text style={styles.label}>Society Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Society name"
          placeholderTextColor={colors.neutral}
        />

        {/* Description field */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.multiline]}
          placeholder="Tell students about your society"
          multiline
          numberOfLines={4}
          placeholderTextColor={colors.neutral}
        />

        {/* Cover image URL field */}
        <Text style={styles.label}>Image URL (cover image)</Text>
        <TextInput
          value={imageUrl}
          onChangeText={setImageUrl}
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor={colors.neutral}
        />

        {/* Save and discard buttons */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>
          <Pressable
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Discard</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    backgroundColor: colors.background,
    flexGrow: 1,
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
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    color: colors.primaryText,
  },
  multiline: { height: 100, textAlignVertical: "top" },
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
