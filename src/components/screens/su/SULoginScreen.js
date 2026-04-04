import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";

export default function SULoginScreen({ navigation }) {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "sustaff2026") {
      navigation.navigate("SUTabs");
    } else {
      Alert.alert("Incorrect password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SU Staff Access</Text>
      <Text style={styles.subtitle}>Enter your access code</Text>

      <TextInput
        placeholder="Access code"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Enter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: { color: "#666", textAlign: "center", marginBottom: 30 },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 16 },
  button: {
    backgroundColor: "#032D39",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
});
