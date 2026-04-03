import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../../../api/supabase";

export default function SocietyDetailScreen({ route, navigation }) {
  const society = route?.params?.society;
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFollowing = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
  
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

  const handleFollow = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to follow societies");
      return;
    }

    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("student_id", user.id)
        .eq("society_id", society.society_id);
      setIsFollowing(false);
    } else {
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
    <View style={styles.container}>
      <Text style={styles.title}>{society.society_name}</Text>
      <Text style={styles.category}>
        {society.society_category?.category_name}
      </Text>
      <Text style={styles.description}>{society.description}</Text>

      <Pressable
        style={[styles.followButton, isFollowing && styles.followingButton]}
        onPress={handleFollow}
        disabled={loading}
      >
        <Text style={styles.followText}>
          {loading ? "..." : isFollowing ? "Following" : "Follow"}
        </Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("EventList", { society })}
      >
        <Text style={styles.buttonText}>View Events</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  category: { fontStyle: "italic", marginBottom: 10 },
  description: { marginBottom: 20 },
  followButton: {
    backgroundColor: "#032D39",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 12,
  },
  followingButton: { backgroundColor: "#9D8B77" },
  followText: { color: "white", fontWeight: "bold" },
  button: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { fontWeight: "bold" },
});
