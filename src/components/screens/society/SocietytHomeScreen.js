import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { supabase } from "../../../api/supabase";
import { useSociety } from "../../../context/SocietyContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { colors, spacing, radius } from "../../../theme";

export default function SocietyHomeScreen({ navigation }) {
  // Get current society from global context
  const { society } = useSociety();

  // Upcoming and past event state
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [pastEvent, setPastEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Returns time-based greeting message
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Refetch events every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchEvents = async () => {
        const today = new Date().toISOString().split("T")[0];

        // Fetch nearest upcoming event with like count
        const { data, error } = await supabase
          .from("event")
          .select("*, likes(count)")
          .eq("society_id", society.society_id)
          .gte("event_date", today)
          .order("event_date", { ascending: true })
          .limit(1)
          .single();

        if (!error) setUpcomingEvent(data);

        // Fetch most recent past event with like count
        const { data: pastData, error: pastError } = await supabase
          .from("event")
          .select("*, likes(count)")
          .eq("society_id", society.society_id)
          .lt("event_date", today)
          .order("event_date", { ascending: false })
          .limit(1)
          .single();

        if (!pastError) setPastEvent(pastData);
        setLoading(false);
      };

      fetchEvents();
    }, [])
  );

  if (loading)
    return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Greeting with society name */}
      <Text style={styles.greeting}>
        {getGreeting()}, {society?.society_name} 👋
      </Text>

      {/* Upcoming event card - tappable to edit */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Upcoming Event</Text>
        {upcomingEvent ? (
          <Pressable
            onPress={() =>
              navigation.navigate("EditEvent", { event: upcomingEvent })
            }
          >
            <Text style={styles.eventTitle}>{upcomingEvent.title}</Text>
            <Text style={styles.eventDate}>📅 {upcomingEvent.event_date}</Text>
            <Text style={styles.likes}>
              ❤️ {upcomingEvent.likes?.[0]?.count ?? 0} likes
            </Text>
          </Pressable>
        ) : (
          <Text style={styles.emptyText}>No upcoming events</Text>
        )}
      </View>

      {/* Past event card - tappable to edit */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Past Event</Text>
        {pastEvent ? (
          <Pressable
            onPress={() =>
              navigation.navigate("EditEvent", { event: pastEvent })
            }
          >
            <Text style={styles.eventTitle}>{pastEvent.title}</Text>
            <Text style={styles.eventDate}>📅 {pastEvent.event_date}</Text>
            <Text style={styles.likes}>
              ❤️ {pastEvent.likes?.[0]?.count ?? 0} likes
            </Text>
          </Pressable>
        ) : (
          <Text style={styles.emptyText}>No past events</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: spacing.sm,
    color: colors.primaryText,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primaryText,
    marginBottom: spacing.xs,
  },
  eventDate: {
    fontSize: 13,
    color: colors.grey,
    marginBottom: spacing.xs,
  },
  likes: {
    color: colors.error,
    marginTop: spacing.xs,
    fontSize: 13,
  },
  emptyText: {
    color: colors.grey,
    fontStyle: "italic",
  },
});
