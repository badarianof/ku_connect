import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../../../api/supabase";
import { colors, spacing, radius } from "../../../theme";

export default function EventDetailScreen({ route }) {
  const { event } = route.params;

  // State for like functionality
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // State for organiser name fetched from society table
  const [societyName, setSocietyName] = useState("");

  // Fetch likes and society name on mount
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Fetch society name using society_id from event
      const { data: societyData } = await supabase
        .from("society")
        .select("society_name")
        .eq("society_id", event.society_id)
        .single();

      if (societyData) setSocietyName(societyData.society_name);

      // Get total like count for this event
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact" })
        .eq("event_id", event.event_id);

      setLikeCount(count || 0);

      // Check if the current user has already liked this event
      if (user) {
        const { data } = await supabase
          .from("likes")
          .select("*")
          .eq("event_id", event.event_id)
          .eq("student_id", user.id)
          .single();

        setIsLiked(!!data);
      }
    };

    fetchData();
  }, []);

  // Handle like and unlike toggle
  const handleLike = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to like events");
      return;
    }

    if (isLiked) {
      // Remove like from database
      await supabase
        .from("likes")
        .delete()
        .eq("event_id", event.event_id)
        .eq("student_id", user.id);

      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      // Add like to database
      await supabase
        .from("likes")
        .insert({ event_id: event.event_id, student_id: user.id });

      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Event cover image */}
      {event.image_url ? (
        <Image
          source={{ uri: event.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}

      {/* Title row with like button */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{event.title}</Text>
        <Pressable onPress={handleLike} style={styles.likeButton}>
          <Text style={styles.heart}>{isLiked ? "❤️" : "🤍"}</Text>
          <Text style={styles.likeCount}>{likeCount}</Text>
        </Pressable>
      </View>

      {/* Event details card */}
      <View style={styles.detailsCard}>
        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{event.event_date}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{event.time}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{event.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Organiser</Text>
          <Text style={styles.value}>{societyName || "Unknown"}</Text>
        </View>

        {/* Only show additional link if it exists */}
        {event.additional_link ? (
          <View style={styles.section}>
            <Text style={styles.label}>Additional Link</Text>
            <Text style={styles.link}>{event.additional_link}</Text>
          </View>
        ) : null}

        {/* Event description */}
        {event.description ? (
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{event.description}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl, backgroundColor: colors.background },
  image: {
    width: "100%",
    height: 200,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    color: colors.primaryText,
  },
  likeButton: { alignItems: "center" },
  heart: { fontSize: 24 },
  likeCount: { fontSize: 12, color: colors.grey },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  section: { marginBottom: spacing.md },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: colors.primaryText,
    fontSize: 13,
  },
  value: { color: colors.primaryText, lineHeight: 22 },
  link: { color: colors.primary, textDecorationLine: "underline" },
});
