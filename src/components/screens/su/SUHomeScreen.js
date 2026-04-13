import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { useState } from "react";
import { supabase } from "../../../api/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { colors, spacing, radius } from "../../../theme";

export default function SUHomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refetch all upcoming events every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchEvents = async () => {
        const today = new Date().toISOString().split("T")[0];

        // Fetch all upcoming events across all societies with society name
        const { data, error } = await supabase
          .from("event")
          .select("*, society(society_name)")
          .gte("event_date", today)
          .order("event_date", { ascending: true });

        if (!error) setEvents(data);
        setLoading(false);
      };

      fetchEvents();
    }, [])
  );

  if (loading)
    return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <View style={styles.container}>
      {/* Page header */}
      <Text style={styles.title}>Upcoming Events</Text>
      <Text style={styles.subtitle}>All societies</Text>

      {events.length === 0 ? (
        <Text style={styles.empty}>No upcoming events</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.event_id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Event thumbnail or placeholder */}
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholder} />
              )}

              <View style={styles.info}>
                {/* Event title */}
                <Text style={styles.eventTitle}>{item.title}</Text>

                {/* Event metadata */}
                <Text style={styles.detail}>
                  {item.event_date} • {item.time}
                </Text>
                <Text style={styles.detail}>{item.location}</Text>

                {/* Society name */}
                <Text style={styles.society}>{item.society?.society_name}</Text>

                {/* Status badge - styled differently for Published vs Pending */}
                <Text
                  style={[
                    styles.status,
                    item.event_status === "Published" && styles.published,
                    item.event_status === "Pending" && styles.pending,
                  ]}
                >
                  {item.event_status ?? "Published"}
                </Text>
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
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 4,
    color: colors.primaryText,
  },
  subtitle: { color: colors.grey, marginBottom: spacing.xl, fontSize: 13 },
  empty: { color: colors.grey },
  card: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  image: { width: 90, height: 90 },
  placeholder: { width: 90, height: 90, backgroundColor: colors.accent },
  info: { flex: 1, padding: spacing.md },
  eventTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: spacing.xs,
    color: colors.primaryText,
  },
  detail: { fontSize: 12, color: colors.grey, marginBottom: 2 },
  society: {
    fontSize: 12,
    color: colors.primary,
    marginTop: spacing.xs,
    fontWeight: "600",
  },
  status: {
    fontSize: 11,
    marginTop: spacing.xs,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  published: { color: colors.primary, backgroundColor: colors.accent },
  pending: { color: "#92400e", backgroundColor: "#FEF3C7" },
});
