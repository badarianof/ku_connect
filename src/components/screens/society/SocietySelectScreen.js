import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../../../api/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSociety } from "../../../context/SocietyContext";
import { colors, spacing, radius } from "../../../theme";

// Fallback image if society has no image
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop";

export default function SocietySelectScreen({ navigation }) {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  // Access global society context to store selected society
  const { setSociety } = useSociety();

  // Filter societies based on search query
  const filteredSocieties = societies.filter((s) =>
    s.society_name.toLowerCase().includes(query.toLowerCase())
  );

  // Fetch all societies from Supabase on mount
  useEffect(() => {
    const fetchSocieties = async () => {
      const { data, error } = await supabase
        .from("society")
        .select("society_id, society_name, image_url")
        .order("society_name", { ascending: true });

      if (!error) setSocieties(data);
      setLoading(false);
    };

    fetchSocieties();
  }, []);

  // Store selected society in context and navigate to leader flow
  const handleContinue = () => {
    if (!selected) return;
    setSociety(selected);
    navigation.navigate("LeaderFlow");
  };

  if (loading) return <ActivityIndicator color={colors.primary} />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select Your Society</Text>
      <Text style={styles.subtitle}>Choose the society you manage</Text>

      {/* Search bar to filter societies */}
      <TextInput
        placeholder="Search societies..."
        value={query}
        onChangeText={setQuery}
        style={styles.searchBar}
        placeholderTextColor={colors.neutral}
      />

      {/* Society list */}
      <FlatList
        data={filteredSocieties}
        keyExtractor={(item) => item.society_id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              selected?.society_id === item.society_id && styles.selectedCard,
            ]}
            onPress={() => setSelected(item)}
          >
            {/* Society logo */}
            <Image
              source={{ uri: item.image_url || DEFAULT_IMAGE }}
              style={styles.societyImage}
              resizeMode="cover"
            />
            <Text
              style={[
                styles.name,
                selected?.society_id === item.society_id && styles.selectedName,
              ]}
            >
              {item.society_name}
            </Text>
          </Pressable>
        )}
      />

      {/* Continue button - disabled until a society is selected */}
      <Pressable
        style={[styles.button, !selected && styles.disabled]}
        onPress={handleContinue}
        disabled={!selected}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.grey,
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: colors.neutral,
    padding: spacing.md,
    borderRadius: radius.full,
    marginBottom: spacing.lg,
    backgroundColor: colors.white,
    color: colors.primaryText,
  },
  card: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.accent,
  },
  societyImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  name: {
    fontSize: 15,
    color: colors.primaryText,
    flex: 1,
  },
  selectedName: {
    fontWeight: "bold",
    color: colors.primary,
  },
  button: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    alignItems: "center",
  },
  disabled: { backgroundColor: colors.neutral },
  buttonText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
});
