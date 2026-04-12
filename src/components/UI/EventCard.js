import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { colors, spacing, radius } from "../../theme";

// Reusable event card component used across society events and search results
export default function EventCard({ event, onPress }) {
  // Default image shown when event has no image URL
  const DEFAULT_IMAGE = "https://thumbs.dreamstime.com/b/print-206848993.jpg";

  return (
    <Pressable onPress={onPress}>
      <View style={styles.card}>
        {/* Event cover image with fallback */}
        <Image
          source={{ uri: event.image_url || DEFAULT_IMAGE }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          {/* Event title */}
          <Text style={styles.title} numberOfLines={1}>
            {event.title}
          </Text>

          {/* Event metadata */}
          <Text style={styles.detail}>📅 {event.event_date}</Text>
          <Text style={styles.detail}>🕐 {event.time}</Text>
          <Text style={styles.detail}>📍 {event.location}</Text>

          {/* View details link */}
          <Text style={styles.link}>View Details →</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF1CF",
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  image: { width: "100%", height: 150 },
  content: { padding: spacing.md },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: spacing.xs,
  },
  detail: { fontSize: 12, color: colors.grey, marginBottom: 2 },
  link: { marginTop: spacing.sm, color: colors.primary, fontWeight: "600" },
});
