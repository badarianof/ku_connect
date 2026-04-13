import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../../api/supabase";
import EventCard from "../../UI/EventCard";
import { colors, spacing } from "../../../theme";

export default function EventListScreen({ route, navigation }) {
  // Get society passed via navigation params
  const { society } = route.params;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all events for this society on mount
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("event")
        .select("*")
        .eq("society_id", society.society_id)
        .order("event_date", { ascending: true });

      if (!error) setEvents(data);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading)
    return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  // Empty state when society has no events
  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyTitle}>No events yet</Text>
        <Text style={styles.emptyText}>
          This society hasn't posted any events yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{society.society_name} Events</Text>
      {/* Render each event using the reusable EventCard component */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.event_id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => navigation.navigate("EventDetail", { event: item })}
          />
        )}
      />
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
    color: colors.primaryText,
    marginBottom: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: colors.background,
  },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: spacing.sm,
    color: colors.primaryText,
  },
  emptyText: { color: colors.grey, textAlign: "center" },
});
