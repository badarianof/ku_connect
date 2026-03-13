import { View, Text, StyleSheet, Pressable } from "react-native";

export default function EventCard({ event, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.card}>
        <Text style={styles.title}>{event.title}</Text>

        <Text>{event.date}</Text>

        <Text>{event.society}</Text>

        <Text style={styles.link}>View Details</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 10,
    color: "blue",
  },
});