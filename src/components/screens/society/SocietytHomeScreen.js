import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../../api/supabase";
import { useSociety } from "../../../context/SocietyContext";

export default function SocietyHomeScreen() {
  const { society } = useSociety();
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("event")
        .select("*")
        .eq("society_id", society.society_id)
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(1)
        .single();

      console.log("upcoming:", data);
      console.log("error:", error);

      if (!error) setUpcomingEvent(data);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        {getGreeting()}, {society?.society_name}
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Upcoming Event</Text>
        {upcomingEvent ? (
          <>
            <Text style={styles.eventTitle}>{upcomingEvent.title}</Text>
            <Text>{upcomingEvent.event_date}</Text>
          </>
        ) : (
          <Text>No upcoming events</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  greeting: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionTitle: { fontWeight: "bold", marginBottom: 10 },
  eventTitle: { fontSize: 16, fontWeight: "600" },
});
