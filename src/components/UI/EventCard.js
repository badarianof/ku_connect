import { View, Text, StyleSheet, Pressable, Image } from "react-native";

export default function EventCard({ event, onPress }) {
  const default_image = "https://thumbs.dreamstime.com/b/print-206848993.jpg";

  return (
    <Pressable onPress={onPress}>
      <View style={styles.card}>
        <Image
          source={{ uri: event.image_url || default_image }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.title}>{event.title}</Text>
        <Text>{event.event_date}</Text>
        <Text>{event.time}</Text>
        <Text>{event.location}</Text>
        <Text style={styles.link}>View Details</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, margin: 10, backgroundColor: "#eee", borderRadius: 8 },
  image: { width: "100%", height: 150, borderRadius: 8, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "bold" },
  link: { marginTop: 10, color: "blue" },
});
