import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { supabase } from "../../../api/supabase";
import ScreenWrapper from "../../../components/layout/ScreenWrapper";
import Button from "../../../components/layout/Button";
import { colors, spacing, radius } from "../../../theme";

export default function StudentSignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");

  const handleSignup = async () => {
    if (!firstName || !surname || !email || !password) {
      Alert.alert(
        "Missing fields",
        "Please fill in your name, email and password."
      );
      return;
    }

    if (!email.endsWith("@kingston.ac.uk")) {
      Alert.alert(
        "Invalid email",
        "Please use your Kingston University email address ending in @kingston.ac.uk"
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak password",
        "Your password must be at least 6 characters."
      );
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        Alert.alert("Signup failed", error.message);
        return;
      }

      const { error: profileError } = await supabase.from("student").insert({
        auth_id: data.user.id,
        first_name: firstName,
        surname,
        email,
        course: course || null,
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
    <ScreenWrapper style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Kingston University students only</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            placeholderTextColor={colors.neutral}
          />

          <Text style={styles.label}>Surname</Text>
          <TextInput
            placeholder="Surname"
            value={surname}
            onChangeText={setSurname}
            style={styles.input}
            placeholderTextColor={colors.neutral}
          />

          <Text style={styles.label}>KU Email</Text>
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
            placeholder="Min. 6 characters"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            placeholderTextColor={colors.neutral}
          />

          <Text style={styles.label}>
            Course <Text style={styles.optional}>(optional)</Text>
          </Text>
          <TextInput
            placeholder="e.g. Computer Science"
            value={course}
            onChangeText={setCourse}
            style={styles.input}
            placeholderTextColor={colors.neutral}
          />

          <Text style={styles.label}>
            Year of Study <Text style={styles.optional}>(optional)</Text>
          </Text>
          <TextInput
            placeholder="e.g. 2"
            value={yearOfStudy}
            onChangeText={setYearOfStudy}
            style={styles.input}
            keyboardType="numeric"
            placeholderTextColor={colors.neutral}
          />

          <Button title="Sign Up" onPress={handleSignup} />

          <Text
            style={styles.link}
            onPress={() => navigation.navigate("StudentLogin")}
          >
            Already have an account? Log in
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl, flexGrow: 1 },
  header: { marginTop: spacing.xl, marginBottom: spacing.xl },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: { color: colors.grey, fontSize: 14 },
  form: { gap: spacing.xs },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primaryText,
    marginBottom: 2,
  },
  optional: { fontWeight: "400", color: colors.grey },
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
