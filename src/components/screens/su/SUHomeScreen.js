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

export default function SUHomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchEvents = async () => {
        const today = new Date().toISOString().split("T")[0];

        const { data, error } = await supabase
          .from("event")
          .select("*, society(society_name)")
          .gte("event_date", today)
          .order("event_date", { ascending: true });

        console.log("su events:", data);
        if (!error) setEvents(data);
        setLoading(false);
      };

      fetchEvents();
    }, [])
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      <Text style={styles.subtitle}>All societies</Text>

      {events.length === 0 ? (
        <Text style={styles.empty}>No upcoming events</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.event_id}
          renderItem={({ item }) => (
            <View style={styles.card}>
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
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.detail}>
                  {item.event_date} • {item.time}
                </Text>
                <Text style={styles.detail}>{item.location}</Text>
                <Text style={styles.society}>{item.society?.society_name}</Text>
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
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  subtitle: { color: "#666", marginBottom: 20 },
  empty: { color: "#666" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
  },
  image: { width: 90, height: 90 },
  placeholder: { width: 90, height: 90, backgroundColor: "#eee" },
  info: { flex: 1, padding: 10 },
  eventTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  detail: { fontSize: 12, color: "#666", marginBottom: 2 },
  society: { fontSize: 12, color: "#032D39", marginTop: 4 },
  status: { fontSize: 11, marginTop: 4, fontWeight: "600" },
  published: { color: "green" },
  pending: { color: "orange" },
});
