import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useState, useCallback } from "react";
import { useSociety } from "../../../context/SocietyContext";
import { supabase } from "../../../api/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { colors, spacing, radius } from "../../../theme";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop";

export default function SocietyProfile({ navigation }) {
  // Get current society from global context
  const { society } = useSociety();
  const [events, setEvents] = useState([]);
  // Full society data fetched from Supabase including description
  const [fullSociety, setFullSociety] = useState(null);

  // Refetch society and events every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        // Fetch full society details including description and category
        const { data: societyData } = await supabase
          .from("society")
          .select("*, society_category(category_name)")
          .eq("society_id", society.society_id)
          .single();

        if (societyData) setFullSociety(societyData);

        // Fetch up to 6 most recent events for this society
        const { data, error } = await supabase
          .from("event")
          .select("*")
          .eq("society_id", society.society_id)
          .order("event_date", { ascending: true })
          .limit(6);

        if (!error) setEvents(data);
      };

      fetchData();
    }, [])
  );

  if (!society)
    return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Society cover image */}
      <Image
        source={{
          uri: fullSociety?.image_url || society.image_url || DEFAULT_IMAGE,
        }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Society info card with edit button */}
      <View style={styles.card}>
        <View style={styles.nameRow}>
          <Text style={styles.societyName}>{society.society_name}</Text>
          <Pressable onPress={() => navigation.navigate("EditSocietyProfile")}>
            <Text style={styles.editIcon}>✏️</Text>
          </Pressable>
        </View>

        {/* Category badge */}
        {fullSociety?.society_category?.category_name && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {fullSociety.society_category.category_name}
            </Text>
          </View>
        )}

        <Text style={styles.label}>About us</Text>
        <Text style={styles.description}>
          {fullSociety?.description ?? "No description yet"}
        </Text>
      </View>

      {/* Events section header */}
      <View style={styles.eventsHeader}>
        <Text style={styles.sectionTitle}>Our Events</Text>
        <Pressable onPress={() => navigation.navigate("Dashboard")}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      {/* Events grid - tappable to edit */}
      {events.length === 0 ? (
        <Text style={styles.emptyText}>No events yet</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.event_id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.eventCard}
              onPress={() => navigation.navigate("EditEvent", { event: item })}
            >
              <Image
                source={{ uri: item.image_url || DEFAULT_IMAGE }}
                style={styles.eventImage}
                resizeMode="cover"
              />
              <Text style={styles.eventTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.eventDate}>{item.event_date}</Text>
            </Pressable>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl, backgroundColor: colors.background },
  image: {
    width: "100%",
    height: 180,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  societyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primaryText,
    flex: 1,
  },
  editIcon: { fontSize: 18 },
  categoryBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: "flex-start",
    marginBottom: spacing.sm,
  },
  categoryText: { fontSize: 12, color: colors.primaryText },
  label: {
    fontWeight: "600",
    marginBottom: spacing.xs,
    color: colors.grey,
    fontSize: 13,
  },
  description: { color: colors.primaryText, lineHeight: 20 },
  eventsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: colors.primaryText },
  viewAll: { color: colors.primary, fontWeight: "600" },
  emptyText: { color: colors.grey, fontStyle: "italic" },
  row: { gap: spacing.xs, marginBottom: spacing.xs },
  eventCard: { flex: 1, alignItems: "center" },
  eventImage: { width: "100%", height: 80, borderRadius: radius.sm },
  eventTitle: {
    fontSize: 10,
    textAlign: "center",
    marginTop: spacing.xs,
    color: colors.primaryText,
  },
  eventDate: { fontSize: 9, color: colors.grey, textAlign: "center" },
});
