import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../../api/supabase.js";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

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

        // get followed societies
        const { data: follows, error: followError } = await supabase
          .from("follows")
          .select("society_id")
          .eq("student_id", user.id);

        console.log("follows:", follows);

        if (!follows || follows.length === 0) {
          setHasFollows(false);
          setLoading(false);
          return;
        }

        setHasFollows(true);

        const societyIds = follows.map((f) => f.society_id);

        // get events from followed societies
        const { data: eventsData, error: eventsError } = await supabase
          .from("event")
          .select("*, society(society_name)")
          .in("society_id", societyIds)
          .order("event_date", { ascending: true });

        // console.log("events:", eventsData);
        if (!eventsError) setEvents(eventsData);
        setLoading(false);
      };

      fetchFollowedEvents();
    }, [])
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (!hasFollows) {
    return (
      <View style={styles.emptyContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: { color: "#666", textAlign: "center" },
  row: { justifyContent: "space-between", marginBottom: 12 },
  card: { width: "48%", backgroundColor: "#fff", borderRadius: 10 },
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
