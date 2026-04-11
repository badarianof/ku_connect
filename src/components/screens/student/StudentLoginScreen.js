import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { supabase } from "../../../api/supabase";
import ScreenWrapper from "../../../components/layout/ScreenWrapper";
import Button from "../../../components/layout/Button";
import { colors, spacing, radius } from "../../../theme";

export default function StudentLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please fill in all fields");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login failed", error.message);
      return;
    }

    navigation.navigate("StudentTabs");
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in with your KU email</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="k1234567@kingston.ac.uk"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.neutral}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          placeholderTextColor={colors.neutral}
        />

        <Button title="Log In" onPress={handleLogin} />

        <Text
          style={styles.link}
          onPress={() => navigation.navigate("StudentSignup")}
        >
          Don't have an account? Sign up
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flex: 1, justifyContent: "center" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: { color: colors.grey, fontSize: 14 },
  form: { marginBottom: spacing.xl, gap: spacing.sm },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primaryText,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    color: colors.primaryText,
  },
  link: { textAlign: "center", color: colors.primary, marginTop: spacing.md },
});
