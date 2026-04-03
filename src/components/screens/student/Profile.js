import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../../../api/supabase";

export default function StudentProfile({ navigation }) {
  const [student, setStudent] = useState(null);
  const [followedSocieties, setFollowedSocieties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [eventNotifications, setEventNotifications] = useState(false);
  const [societyUpdates, setSocietyUpdates] = useState(false);
  const [questionNotifications, setQuestionNotifications] = useState(false);

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop";

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // fetch student profile
        const { data, error } = await supabase
          .from("student")
          .select("*")
          .eq("auth_id", user.id)
          .single();

        if (!error) setStudent(data);

        // fetch followed societies
        const { data: followsData, error: followsError } = await supabase
          .from("follows")
          .select("society(society_id, society_name, image_url)")
          .eq("student_id", user.id);

        console.log("follows:", followsData);
        if (!followsError)
          setFollowedSocieties(followsData.map((f) => f.society));
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
    <ScrollView contentContainerStyle={styles.container}>
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

      <Text style={styles.sectionTitle}>Followed Societies</Text>

      {followedSocieties.length === 0 ? (
        <Text style={styles.emptyText}>
          You haven't followed any societies yet
        </Text>
      ) : (
        <FlatList
          horizontal
          data={followedSocieties}
          keyExtractor={(item) => item.society_id}
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.societyChip}
              onPress={() =>
                navigation.navigate("SocietyDetail", { society: item })
              }
            >
              <Image
                source={{ uri: item.image_url || DEFAULT_IMAGE }}
                style={styles.societyImage}
                resizeMode="cover"
              />
              <Text style={styles.societyName} numberOfLines={2}>
                {item.society_name}
              </Text>
            </Pressable>
          )}
        />
      )}

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
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
  emptyText: { color: "#666", marginBottom: 20 },
  societyChip: { width: 100, marginRight: 12, alignItems: "center" },
  societyImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 6 },
  societyName: { fontSize: 11, textAlign: "center", color: "#333" },
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
