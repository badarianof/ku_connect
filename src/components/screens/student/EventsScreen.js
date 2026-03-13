import { View, FlatList } from "react-native";
import { events } from "../../../data/events";
import EventCard from "../../UI/EventCard";
import { useNavigation } from "@react-navigation/native";

export default function EventListScreen() {

  const navigation = useNavigation();

  return (
    <View>
      <FlatList
        data={events}
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
    </View>
  );
}