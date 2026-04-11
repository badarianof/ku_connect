import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../../api/supabase";
import { colors, spacing, radius } from "../../../theme";

export default function StudentHomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("event")
        .select("*")
        .gte("event_date", today)
        .order("event_date", { ascending: true });
      if (!error) setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading)
    return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latest Events</Text>

      {events.length === 0 ? (
        <Text style={styles.empty}>No upcoming events</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.event_id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
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
              <View style={styles.cardContent}>
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.date}>{item.event_date}</Text>
              </View>
            </Pressable>
          )}
        />
      )}
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
  empty: { color: colors.grey },
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
});
