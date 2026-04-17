import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { supabase } from "../../../api/supabase.js";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { colors, spacing, radius } from "../../../theme";

export default function SocietyListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFollows, setHasFollows] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchFollowedEvents = async () => {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data: follows } = await supabase
          .from("follows")
          .select("society_id")
          .eq("student_id", user.id);

        if (!follows || follows.length === 0) {
          setHasFollows(false);
          setLoading(false);
          return;
        }

        setHasFollows(true);
        const societyIds = follows.map((f) => f.society_id);

        const { data: eventsData, error: eventsError } = await supabase
          .from("event")
          .select("*, society(society_name)")
          .in("society_id", societyIds)
          .order("event_date", { ascending: true });

        if (!eventsError) setEvents(eventsData);
        setLoading(false);
      };

      fetchFollowedEvents();
    }, [])
  );

  if (loading)
    return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  if (!hasFollows) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🏛️</Text>
        <Text style={styles.emptyTitle}>No followed societies yet</Text>
        <Text style={styles.emptyText}>
          Follow some societies to see their events here!
        </Text>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyTitle}>No upcoming events</Text>
        <Text style={styles.emptyText}>
          Your followed societies have no upcoming events.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Societies Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.event_id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate("EventDetail", { event: item })}
          >
            {item.image_url ? (
              <Image
                source={{ uri: item.image_url }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholder} />
            )}
            <View style={styles.cardContent}>
              <Text style={styles.eventTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.date}>Date: {item.event_date}</Text>
              <Text style={styles.society} numberOfLines={1}>
                {item.society?.society_name}
              </Text>
              <Pressable
                style={styles.viewButton}
                onPress={() =>
                  navigation.navigate("EventDetail", { event: item })
                }
              >
                <Text style={styles.viewButtonText}>View Details</Text>
              </Pressable>
            </View>
          </Pressable>
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
    fontSize: 24,
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
    textAlign: "center",
    color: colors.primaryText,
  },
  viewButton: {
    backgroundColor: colors.primary,
    padding: spacing.xs,
    borderRadius: radius.full,
    alignItems: "center",
    marginTop: spacing.sm,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  viewButtonText: { color: colors.white, fontSize: 11, fontWeight: "600" },
  emptyText: { color: colors.grey, textAlign: "center", lineHeight: 22 },
  row: { justifyContent: "space-between", marginBottom: spacing.md },
  card: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: radius.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  image: { width: "100%", height: 120 },
  placeholder: { width: "100%", height: 120, backgroundColor: colors.accent },
  cardContent: { padding: spacing.sm },
  eventTitle: { fontSize: 13, fontWeight: "600", color: colors.primaryText },
  date: { fontSize: 11, color: colors.grey, marginTop: 2 },
  society: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 2,
    paddingBottom: spacing.xs,
  },
});