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

export default function StudentSignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");

  const handleSignup = async () => {
    if (!firstName || !surname || !email || !password) {
      Alert.alert("Please fill in all required fields");
      return;
    }

    if (!email.endsWith("@kingston.ac.uk")) {
      Alert.alert(
        "Please use your Kingston University email (@kingston.ac.uk)"
      );
      return;
    }

    try {
      // create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert("Signup failed", error.message);
        return;
      }

      // 2. insert into student table
      const { error: profileError } = await supabase.from("student").insert({
        auth_id: data.user.id,
        first_name: firstName,
        surname,
        email,
        course,
        year_of_study: yearOfStudy ? parseInt(yearOfStudy) : null,
      });

      if (profileError) {
        Alert.alert("Error saving profile", profileError.message);
        return;
      }

      Alert.alert("Account created!", "You can now log in.");
      navigation.navigate("StudentLogin");
    } catch (err) {
      console.log(err);
      Alert.alert("Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Kingston University students only</Text>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
        style={styles.input}
      />
      <TextInput
        placeholder="KU Email (@kingston.ac.uk)"
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
      <TextInput
        placeholder="Course (optional)"
        value={course}
        onChangeText={setCourse}
        style={styles.input}
      />
      <TextInput
        placeholder="Year of Study (optional)"
        value={yearOfStudy}
        onChangeText={setYearOfStudy}
        style={styles.input}
        keyboardType="numeric"
      />

      <Pressable style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("StudentLogin")}>
        <Text style={styles.link}>Already have an account? Log in</Text>
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
