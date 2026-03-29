import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image
} from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../../api/supabase";

export default function StudentHomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("event")
        .select("*, society(society_name)")
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(5);

      console.log("home events:", data);
      console.log("error:", error);

      if (!error) setEvents(data);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latest Events</Text>

      {events.length === 0 ? (
        <Text>No upcoming events</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.event_id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate("EventDetail", { event: item })
              }
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
              <Text style={styles.eventTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.date}>{item.event_date}</Text>
              <Text style={styles.society} numberOfLines={1}>
                {item.society?.society_name}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  eventTitle: { fontSize: 16, fontWeight: "600" },
  date: { color: "#666", marginTop: 4 },
  society: { color: "#032D39", marginTop: 4 },
  location: { color: "#666", marginTop: 2 },

  row: { justifyContent: "space-between" },
  card: {
    width: "48%",
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  image: { width: "100%", height: 120, borderRadius: 10 },
  placeholder: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  eventTitle: { fontSize: 13, fontWeight: "600", padding: 6 },
  date: { fontSize: 11, color: "#666", paddingHorizontal: 6 },
  society: {
    fontSize: 11,
    color: "#032D39",
    paddingHorizontal: 6,
    paddingBottom: 6,
  },
});
