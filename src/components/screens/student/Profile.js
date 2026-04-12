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
import { colors, spacing, radius } from "../../../theme";

export default function StudentProfile({ navigation }) {
  // Student profile data
  const [student, setStudent] = useState(null);
  // List of societies the student follows
  const [followedSocieties, setFollowedSocieties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Notification preference toggles
  const [eventNotifications, setEventNotifications] = useState(false);
  const [societyUpdates, setSocietyUpdates] = useState(false);
  const [questionNotifications, setQuestionNotifications] = useState(false);

  // Selected society for modal popup
  const [selectedSociety, setSelectedSociety] = useState(null);

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop";

  // Refetch profile data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Fetch student profile and load saved preferences
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

          // Fetch societies the student follows
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

  // Save notification preferences to Supabase
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

  // Sign out and navigate back to role selection
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.navigate("RoleSelect");
  };

  if (loading)
    return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      {/* Student info card */}
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

      {/* Followed societies horizontal list */}
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
          style={{ marginBottom: spacing.lg }}
          renderItem={({ item }) => (
            // Tap society chip to open modal with details
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

      {/* Notification preferences */}
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.card}>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceText}>Receive event notifications</Text>
          <Switch
            value={eventNotifications}
            onValueChange={setEventNotifications}
            trackColor={{ true: colors.primary }}
          />
        </View>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceText}>
            Receive updates from followed societies
          </Text>
          <Switch
            value={societyUpdates}
            onValueChange={setSocietyUpdates}
            trackColor={{ true: colors.primary }}
          />
        </View>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceText}>
            Receive notifications for responses to questions
          </Text>
          <Switch
            value={questionNotifications}
            onValueChange={setQuestionNotifications}
            trackColor={{ true: colors.primary }}
          />
        </View>
      </View>

      {/* Save preferences button */}
      <Pressable style={styles.saveButton} onPress={handleSavePreferences}>
        <Text style={styles.saveText}>Save Preferences</Text>
      </Pressable>

      {/* Logout button */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>

      {/* Society detail modal - shown when tapping a followed society */}
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

            {/* Unfollow button inside modal */}
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
  container: { padding: spacing.xl, backgroundColor: colors.background },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.lg,
    color: colors.primaryText,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  label: { fontWeight: "600", width: 60, color: colors.primaryText },
  value: { flex: 1, color: colors.primaryText },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: spacing.md,
    color: colors.primaryText,
  },
  emptyText: { color: colors.grey, marginBottom: spacing.lg },
  societyChip: { width: 100, marginRight: spacing.md, alignItems: "center" },
  societyImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.xs,
  },
  societyName: { fontSize: 11, textAlign: "center", color: colors.primaryText },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  preferenceText: {
    flex: 1,
    marginRight: spacing.sm,
    color: colors.primaryText,
  },
  saveButton: {
    backgroundColor: colors.neutral,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  saveText: { color: colors.white, fontWeight: "bold" },
  logoutButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  logoutText: { color: colors.white, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.xl,
  },
  modalImage: {
    width: "100%",
    height: 150,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: spacing.sm,
    color: colors.primaryText,
  },
  modalDescription: {
    color: colors.primaryText,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  closeButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: "center",
  },
  closeText: { color: colors.white, fontWeight: "bold" },
});
