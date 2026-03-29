import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../../api/supabase";
import { useSociety } from "../../../context/SocietyContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function SocietyHomeScreen() {
  const { society } = useSociety();
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [pastEvent, setPastEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useFocusEffect(
    useCallback(() => {
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

        if (!error) setUpcomingEvent(data);

        const { data: pastData, error: pastError } = await supabase
          .from("event")
          .select("*")
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

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Past Event</Text>
        {pastEvent ? (
          <>
            <Text style={styles.eventTitle}>{pastEvent.title}</Text>
            <Text>{pastEvent.event_date}</Text>
          </>
        ) : (
          <Text>No past events</Text>
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
