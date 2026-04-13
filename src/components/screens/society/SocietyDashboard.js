import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { useState, useCallback } from "react";
import { supabase } from "../../../api/supabase";
import { useSociety } from "../../../context/SocietyContext";
import { useFocusEffect } from "@react-navigation/native";
import { colors, spacing, radius } from "../../../theme";

// Default image for events without a cover image
const DEFAULT_IMAGE =
  "https://thumbs.dreamstime.com/b/have-fun-brush-lettering-hand-inspiring-quote-stain-background-motivating-modern-calligraphy-can-be-used-photo-overlays-75591520.jpg?w=768";

export default function SocietyDashboard({ navigation }) {
  // Get current society from global context
  const { society } = useSociety();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refetch events every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchEvents = async () => {
        // Fetch all events for this society including like count
        const { data, error } = await supabase
          .from("event")
          .select("*, likes(count)")
          .eq("society_id", society.society_id)
          .order("event_date", { ascending: true });

        if (!error) setEvents(data);
        setLoading(false);
      };
      fetchEvents();
    }, [])
  );

  // Show confirmation alert before deleting an event
  const handleDelete = async (eventId) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("event")
              .delete()
              .eq("event_id", eventId);

            if (error) {
              alert("Error deleting event");
            } else {
              // Remove deleted event from local state
              setEvents(events.filter((e) => e.event_id !== eventId));
            }
          },
        },
      ]
    );
  };

  if (loading)
    return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No events yet</Text>
          <Text style={styles.emptyText}>
            Create your first event using the + button below
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.event_id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.row}>
              {/* Event thumbnail image */}
              <Image
                source={{ uri: item.image_url || DEFAULT_IMAGE }}
                style={styles.eventImage}
                resizeMode="cover"
              />

              <View style={styles.eventInfo}>
                {/* Event title and metadata */}
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.date}>📅 {item.event_date}</Text>

                {/* Event status badge */}
                <View
                  style={[
                    styles.statusBadge,
                    item.event_status === "Published"
                      ? styles.publishedBadge
                      : styles.pendingBadge,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {item.event_status ?? "Published"}
                  </Text>
                </View>

                {/* Like count */}
                <Text style={styles.likes}>
                  ❤️ {item.likes?.[0]?.count ?? 0} likes
                </Text>

                {/* Edit and delete action buttons */}
                <View style={styles.buttons}>
                  <Pressable
                    style={styles.editButton}
                    onPress={() =>
                      navigation.navigate("EditEvent", { event: item })
                    }
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </Pressable>
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.event_id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: spacing.lg,
    color: colors.primaryText,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: spacing.sm,
  },
  emptyText: { color: colors.grey, textAlign: "center" },
  row: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  eventImage: { width: 90, height: "100%", minHeight: 100 },
  eventInfo: { flex: 1, padding: spacing.md },
  eventTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primaryText,
    marginBottom: spacing.xs,
  },
  date: { fontSize: 12, color: colors.grey, marginBottom: spacing.xs },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginBottom: spacing.xs,
  },
  publishedBadge: { backgroundColor: colors.accent },
  pendingBadge: { backgroundColor: "#FEF3C7" },
  statusText: { fontSize: 11, fontWeight: "600", color: colors.primaryText },
  likes: { fontSize: 12, color: colors.error, marginBottom: spacing.sm },
  buttons: { flexDirection: "row", gap: spacing.sm },
  editButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.error,
    padding: spacing.sm,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  buttonText: { color: colors.white, fontWeight: "600", fontSize: 13 },
});
