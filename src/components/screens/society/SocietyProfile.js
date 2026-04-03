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

export default function SocietyProfile({ navigation }) {
  const { society } = useSociety();
  const [events, setEvents] = useState([]);

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop";

  useFocusEffect(
    useCallback(() => {
      const fetchEvents = async () => {
        const { data, error } = await supabase
          .from("event")
          .select("*")
          .eq("society_id", society.society_id)
          .order("event_date", { ascending: true })
          .limit(6);

        if (!error) setEvents(data);
      };

      fetchEvents();
    }, [])
  );

  if (!society) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Image
        source={{ uri: society.image_url || DEFAULT_IMAGE }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.card}>
        <View style={styles.nameRow}>
          <Text style={styles.societyName}>{society.society_name}</Text>
          <Pressable onPress={() => navigation.navigate("EditSocietyProfile")}>
            <Text style={styles.editIcon}>✏️</Text>
          </Pressable>
        </View>
        <Text style={styles.label}>About us:</Text>
        <Text style={styles.description}>{society.description}</Text>
      </View>

      <View style={styles.eventsHeader}>
        <Text style={styles.sectionTitle}>Our Events</Text>
        <Pressable onPress={() => navigation.navigate("Dashboard")}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

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
  container: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  image: { width: "100%", height: 180, borderRadius: 12, marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  societyName: { fontSize: 18, fontWeight: "bold" },
  editIcon: { fontSize: 18 },
  label: { fontWeight: "600", marginBottom: 4, color: "#666" },
  description: { color: "#333", lineHeight: 20 },
  eventsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold" },
  viewAll: { color: "#032D39", fontWeight: "600" },
  emptyText: { color: "#666" },
  row: { gap: 6, marginBottom: 6 },
  eventCard: { flex: 1, alignItems: "center" },
  eventImage: { width: "100%", height: 80, borderRadius: 8 },
  eventTitle: { fontSize: 10, textAlign: "center", marginTop: 4 },
  eventDate: { fontSize: 9, color: "#666", textAlign: "center" },
});
