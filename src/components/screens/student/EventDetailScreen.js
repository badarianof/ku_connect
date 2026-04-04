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

export default function EventDetailScreen({ route }) {
  const { event } = route.params;
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [societyName, setSocietyName] = useState("");

  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [isPastEvent, setIsPastEvent] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: societyData } = await supabase
        .from("society")
        .select("society_name")
        .eq("society_id", event.society_id)
        .single();

      if (societyData) setSocietyName(societyData.society_name);

      // get total like count
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact" })
        .eq("event_id", event.event_id);

      setLikeCount(count || 0);

      const today = new Date().toISOString().split("T")[0];
      setIsPastEvent(event.event_date < today);

      // check if current user liked it
      if (user) {
        const { data } = await supabase
          .from("likes")
          .select("*")
          .eq("event_id", event.event_id)
          .eq("student_id", user.id)
          .single();

        setIsLiked(!!data);
      }

      if (user) {
        const { data: ratingData } = await supabase
          .from("feedback")
          .select("rating")
          .eq("event_id", event.event_id)
          .eq("student_id", user.id)
          .single();

        if (ratingData) {
          setUserRating(ratingData.rating);
          setHasRated(true);
        }
      }
    };

    fetchLikes();
  }, []);

  const handleRating = async (rating) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to rate events");
      return;
    }

    const { error } = await supabase.from("feedback").upsert(
      {
        event_id: event.event_id,
        student_id: user.id,
        rating,
      },
      { onConflict: "event_id,student_id" }
    );

    if (!error) {
      setUserRating(rating);
      setHasRated(true);
    }
  };

  const handleLike = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to like events");
      return;
    }

    if (isLiked) {
      await supabase
        .from("likes")
        .delete()
        .eq("event_id", event.event_id)
        .eq("student_id", user.id);

      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      await supabase
        .from("likes")
        .insert({ event_id: event.event_id, student_id: user.id });

      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {event.image_url ? (
        <Image
          source={{ uri: event.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.titleRow}>
        <Text style={styles.title}>{event.title}</Text>
        <Pressable onPress={handleLike} style={styles.likeButton}>
          <Text style={styles.heart}>{isLiked ? "❤️" : "🤍"}</Text>
          <Text style={styles.likeCount}>{likeCount}</Text>
        </Pressable>
      </View>

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
        <Text style={styles.label}>Organiser</Text>
        <Text>{societyName || "Unknown"}</Text>
      </View>

      {event.additional_link ? (
        <View style={styles.section}>
          <Text style={styles.label}>Additional Link</Text>
          <Text style={styles.link}>{event.additional_link}</Text>
        </View>
      ) : null}

      <Text style={styles.description}>{event.description}</Text>

      {isPastEvent && (
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>
            {hasRated ? "Your Rating" : "Rate this Event"}
          </Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => !hasRated && handleRating(star)}
              >
                <Text style={styles.star}>
                  {star <= userRating ? "⭐" : "☆"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", flex: 1 },
  likeButton: { alignItems: "center" },
  heart: { fontSize: 24 },
  likeCount: { fontSize: 12, color: "#666" },
  section: { marginBottom: 15 },
  label: { fontWeight: "bold", marginBottom: 4, color: "#666" },
  image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 20 },
  description: { marginTop: 10, lineHeight: 22 },
  link: { color: "#032D39", textDecorationLine: "underline" },
  ratingSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  ratingTitle: { fontWeight: "bold", marginBottom: 10 },
  stars: { flexDirection: "row", gap: 8 },
  star: { fontSize: 28 },
});
