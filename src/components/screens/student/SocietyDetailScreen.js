import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../../../api/supabase";
import { colors, spacing, radius } from "../../../theme";

export default function SocietyDetailScreen({ route, navigation }) {
  const society = route?.params?.society;

  // Follow state and loading indicator
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop";

  // Check if the current user is already following this society
  useEffect(() => {
    const checkFollowing = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("follows")
        .select("*")
        .eq("student_id", user.id)
        .eq("society_id", society.society_id)
        .single();

      setIsFollowing(!!data);
      setLoading(false);
    };

    checkFollowing();
  }, []);

  // Toggle follow/unfollow for this society
  const handleFollow = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to follow societies");
      return;
    }

    if (isFollowing) {
      // Remove follow from database
      await supabase
        .from("follows")
        .delete()
        .eq("student_id", user.id)
        .eq("society_id", society.society_id);
      setIsFollowing(false);
    } else {
      // Add follow to database
      await supabase
        .from("follows")
        .insert({ student_id: user.id, society_id: society.society_id });
      setIsFollowing(true);
    }
  };

  if (!society)
    return (
      <View>
        <Text>No society data found</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Society cover image */}
      <Image
        source={{ uri: society.image_url || DEFAULT_IMAGE }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Society name and category */}
      <View style={styles.header}>
        <Text style={styles.title}>{society.society_name}</Text>
        <Text style={styles.category}>
          {society.society_category?.category_name}
        </Text>
      </View>

      {/* Society description */}
      <View style={styles.card}>
        <Text style={styles.label}>About us</Text>
        <Text style={styles.description}>{society.description}</Text>
      </View>

      {/* Follow/unfollow button - changes appearance based on follow state */}
      <Pressable
        style={[styles.followButton, isFollowing && styles.followingButton]}
        onPress={handleFollow}
        disabled={loading}
      >
        <Text style={styles.followText}>
          {loading ? "..." : isFollowing ? "Following ✓" : "Follow"}
        </Text>
      </Pressable>

      {/* Navigate to event list for this society */}
      <Pressable
        style={styles.eventsButton}
        onPress={() => navigation.navigate("EventList", { society })}
      >
        <Text style={styles.eventsButtonText}>View Events</Text>
      </Pressable>
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
  header: { marginBottom: spacing.lg },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: 13,
    color: colors.neutral,
    fontStyle: "italic",
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  label: {
    fontWeight: "bold",
    marginBottom: spacing.xs,
    color: colors.primaryText,
  },
  description: { color: colors.primaryText, lineHeight: 22 },
  followButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  followingButton: { backgroundColor: colors.neutral },
  followText: { color: colors.white, fontWeight: "bold" },
  eventsButton: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  eventsButtonText: { color: colors.primary, fontWeight: "bold" },
});
