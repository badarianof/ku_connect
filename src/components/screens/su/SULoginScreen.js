import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { colors, spacing, radius } from "../../../theme";

export default function SULoginScreen({ navigation }) {
  const [password, setPassword] = useState("");

  // Validate access code and navigate to SU tabs
  const handleLogin = () => {
    if (password === "sustaff2026") {
      navigation.navigate("SUTabs");
    } else {
      Alert.alert("Incorrect access code", "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.header}>
        <Text style={styles.title}>SU Staff Access</Text>
        <Text style={styles.subtitle}>Enter your access code to continue</Text>
      </View>

      {/* Access code input */}
      <View style={styles.form}>
        <Text style={styles.label}>Access Code</Text>
        <TextInput
          placeholder="Enter access code"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          placeholderTextColor={colors.neutral}
        />

        {/* Login button */}
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Enter</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  header: { marginBottom: spacing.xxl, alignItems: "center" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: { color: colors.grey, textAlign: "center", fontSize: 14 },
  form: { gap: spacing.sm },
  label: { fontSize: 13, fontWeight: "600", color: colors.primaryText },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral,
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    color: colors.primaryText,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.full,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
});
