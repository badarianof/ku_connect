import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../../api/supabase";
import EventCard from "../../UI/EventCard";

export default function EventListScreen({ route, navigation }) {
  const { society } = route.params;
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

  if (events.length === 0) {
    return (
      <View>
        <Text>No events for this society yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.event_id}
      renderItem={({ item }) => (
        <EventCard
          event={item}
          onPress={() => navigation.navigate("EventDetail", { event: item })}
        />
      )}
    />
  );
}
