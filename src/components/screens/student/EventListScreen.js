import { View, Text, FlatList } from "react-native";
import { events } from "../../../data/events";
import EventCard from "../../UI/EventCard";

export default function EventListScreen({ route, navigation }) {

  const { society } = route.params;

  const filteredEvents = events.filter(
    (event) => event.society_id === society.society_id
  );

  if (filteredEvents.length === 0) {
    return (
      <View>
        <Text>No events for this society yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredEvents}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EventCard
          event={item}
          onPress={() =>
            navigation.navigate("EventDetail", { event: item })
          }
        />
      )}
    />
  );
}