import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../../api/supabase";
import { useSociety } from "../../../context/SocietyContext";

export default function SocietyDashboard() {
  const { society } = useSociety();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("event")
        .select("*")
        .eq("society_id", society.society_id)
        .order("event_date", { ascending: true });

      console.log("events:", data);
      console.log("error:", error);

      if (!error) setEvents(data);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {events.length === 0 ? (
        <Text>No events yet</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.event_id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.date}>{item.event_date}</Text>
              <Text style={styles.status}>
                {item.event_status ?? "Published"}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  row: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventTitle: { fontSize: 16, fontWeight: "600" },
  date: { color: "#666", marginTop: 4 },
  status: { color: "#032D39", marginTop: 4, fontWeight: "500" },
});
