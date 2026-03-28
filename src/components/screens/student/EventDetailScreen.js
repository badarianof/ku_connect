import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

export default function EventDetailScreen({ route }) {
  const { event } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {event.image_url ? (
        <Image
          source={{ uri: event.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}

      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Date</Text>
        <Text>{event.event_date}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Time</Text>
        <Text>{event.time}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Location</Text>
        <Text>{event.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Category</Text>
        <Text>{event.category}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <Text>{event.description}</Text>
      </View>

      {event.additional_link ? (
        <View style={styles.section}>
          <Text style={styles.label}>Additional Link</Text>
          <Text>{event.additional_link}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  section: { marginBottom: 15 },
  label: { fontWeight: "bold", marginBottom: 4, color: "#666" },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
});
