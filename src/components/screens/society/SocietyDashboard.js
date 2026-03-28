import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
} from "react-native";
import { useState, useCallback } from "react";
import { supabase } from "../../../api/supabase";
import { useSociety } from "../../../context/SocietyContext";
import { useFocusEffect } from "@react-navigation/native";

export default function SocietyDashboard({ navigation }) {
  const { society } = useSociety();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

  const handleDelete = async (eventId) => {
    const { error } = await supabase
      .from("event")
      .delete()
      .eq("event_id", eventId);

    if (error) {
      alert("Error deleting event");
    } else {
      setEvents(events.filter((e) => e.event_id !== eventId));
    }
  };

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

              <View style={styles.buttons}>
                <Pressable
                  style={styles.editButton}
                  onPress={() =>
                    navigation.navigate("EditEvent", { event: item })
                  }
                >
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.event_id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
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
  buttons: { flexDirection: "row", gap: 10, marginTop: 8 },
  deleteButton: {
    backgroundColor: "#cc0000",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
  },
  deleteText: { color: "white", fontWeight: "600" },
  editButton: {
    backgroundColor: "#032D39",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
  },
  editText: { color: "white", fontWeight: "600" },
});
