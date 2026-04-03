import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../../../api/supabase";

export default function StudentProfile({ navigation }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [eventNotifications, setEventNotifications] = useState(false);
  const [societyUpdates, setSocietyUpdates] = useState(false);
  const [questionNotifications, setQuestionNotifications] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("student")
          .select("*")
          .eq("auth_id", user.id)
          .single();

        console.log("student:", data);
        console.log("error:", error);

        if (!error) setStudent(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.navigate("RoleSelect");
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>
            {student ? `${student.first_name} ${student.surname}` : "N/A"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>Student</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{student?.email ?? "N/A"}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Preferences</Text>

      <View style={styles.card}>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceText}>Receive event notifications</Text>
          <Switch
            value={eventNotifications}
            onValueChange={setEventNotifications}
            trackColor={{ true: "#032D39" }}
          />
        </View>

        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceText}>
            Receive updates from followed societies
          </Text>
          <Switch
            value={societyUpdates}
            onValueChange={setSocietyUpdates}
            trackColor={{ true: "#032D39" }}
          />
        </View>

        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceText}>
            Receive notifications for responses to questions
          </Text>
          <Switch
            value={questionNotifications}
            onValueChange={setQuestionNotifications}
            trackColor={{ true: "#032D39" }}
          />
        </View>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  label: { fontWeight: "600", width: 60 },
  value: { flex: 1, color: "#333" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  preferenceText: { flex: 1, marginRight: 10, color: "#333" },
  logoutButton: {
    backgroundColor: "#032D39",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: { color: "white", fontWeight: "bold" },
});
