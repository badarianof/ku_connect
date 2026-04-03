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
  Modal,
} from "react-native";
import { useState } from "react";
import { supabase } from "../../../api/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function StudentProfile({ navigation }) {
  const [student, setStudent] = useState(null);
  const [followedSocieties, setFollowedSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventNotifications, setEventNotifications] = useState(false);
  const [societyUpdates, setSocietyUpdates] = useState(false);
  const [questionNotifications, setQuestionNotifications] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState(null);

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop";

  useFocusEffect(
    useCallback(() => {
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

          if (!error) {
            setStudent(data);
            setEventNotifications(data.event_notifications ?? false);
            setSocietyUpdates(data.society_updates ?? false);
            setQuestionNotifications(data.question_notifications ?? false);
          }

          const { data: followsData, error: followsError } = await supabase
            .from("follows")
            .select("society(society_id, society_name, image_url, description)")
            .eq("student_id", user.id);

          if (!followsError)
            setFollowedSocieties(followsData.map((f) => f.society));
        }

        setLoading(false);
      };

      fetchProfile();
    }, [])
  );

  const handleSavePreferences = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("student")
      .update({
        event_notifications: eventNotifications,
        society_updates: societyUpdates,
        question_notifications: questionNotifications,
      })
      .eq("auth_id", user.id);

    if (error) {
      alert("Error saving preferences");
    } else {
      alert("Preferences saved!");
    }
  };

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
              onPress={() => setSelectedSociety(item)}
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

      <Pressable style={styles.saveButton} onPress={handleSavePreferences}>
        <Text style={styles.saveText}>Save Preferences</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>

      <Modal
        visible={!!selectedSociety}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedSociety(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Image
              source={{ uri: selectedSociety?.image_url || DEFAULT_IMAGE }}
              style={styles.modalImage}
              resizeMode="cover"
            />
            <Text style={styles.modalTitle}>
              {selectedSociety?.society_name}
            </Text>
            <Text style={styles.modalDescription}>
              {selectedSociety?.description}
            </Text>
            <Pressable
              style={styles.closeButton}
              onPress={async () => {
                const {
                  data: { user },
                } = await supabase.auth.getUser();
                await supabase
                  .from("follows")
                  .delete()
                  .eq("student_id", user.id)
                  .eq("society_id", selectedSociety.society_id);
                setFollowedSocieties((prev) =>
                  prev.filter(
                    (s) => s.society_id !== selectedSociety.society_id
                  )
                );
                setSelectedSociety(null);
              }}
            >
              <Text style={styles.closeText}>
                Following ✓ (tap to unfollow)
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  saveButton: {
    backgroundColor: "#9D8B77",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  saveText: { color: "white", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  modalDescription: { color: "#333", lineHeight: 20, marginBottom: 20 },
  closeButton: {
    backgroundColor: "#032D39",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  closeText: { color: "white", fontWeight: "bold" },
});
