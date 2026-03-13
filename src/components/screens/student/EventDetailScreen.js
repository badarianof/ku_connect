import { View, Text, StyleSheet } from "react-native";

export default function EventDetailScreen({ route }) {
  const { event } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>

      <Text>{event.date}</Text>

      <Text>{event.society}</Text>

      <Text style={styles.description}>{event.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  description: {
    marginTop: 20,
  },
});
