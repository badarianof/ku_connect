import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { supabase } from "../../../api/supabase";

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
    <View style={styles.container}>
      <Text style={styles.title}>Student Login</Text>
      <Text style={styles.subtitle}>Kingston University students only</Text>

      <TextInput
        placeholder="KU Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("StudentSignup")}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 6 },
  subtitle: { color: "#666", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, borderRadius: 6, marginBottom: 12 },
  button: {
    backgroundColor: "#032D39",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  link: { textAlign: "center", color: "#032D39" },
});
