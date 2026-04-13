import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../../../api/supabase";
import { colors, spacing, radius } from "../../../theme";

// Category options for society filtering
const CATEGORIES = [
  "All",
  "Academic",
  "Cultural",
  "Faith",
  "Arts & Activities",
  "Liberation & Campaigns",
];

// Category options for event filtering
const EVENT_CATEGORIES = [
  "All",
  "On Campus",
  "Off Campus",
  "Free",
  "Members Only",
  "Open to All",
  "Online",
];

export default function StudentSearch({ navigation }) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Society");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [societies, setSocieties] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all societies and events on mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch societies with their category
      const { data: socData, error: socError } = await supabase
        .from("society")
        .select(`*, society_category(category_name)`)
        .order("society_name", { ascending: true });

      if (!socError) setSocieties(socData);

      // Fetch all events ordered by title
      const { data: evData, error: evError } = await supabase
        .from("event")
        .select("*")
        .order("title", { ascending: true });

      if (!evError) setEvents(evData);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Filter societies by search query and selected category
  const filteredSocieties = societies.filter((s) => {
    const matchesQuery = s.society_name
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      s.society_category?.category_name === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  // Filter events by search query and selected category
  const filteredEvents = events.filter((e) => {
    const matchesQuery = e.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      e.category
        ?.split(",")
        .map((c) => c.trim())
        .includes(selectedCategory);
    return matchesQuery && matchesCategory;
  });

  if (loading)
    return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <View style={styles.container}>
      {/* Search input */}
      <TextInput
        placeholder="What are you looking for?"
        value={query}
        onChangeText={setQuery}
        style={styles.searchBar}
        placeholderTextColor={colors.neutral}
      />

      {/* Society / Events tab toggle */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === "Society" && styles.activeTab]}
          onPress={() => {
            setActiveTab("Society");
            setSelectedCategory("All");
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Society" && styles.activeTabText,
            ]}
          >
            Society
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "Events" && styles.activeTab]}
          onPress={() => {
            setActiveTab("Events");
            setSelectedCategory("All");
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Events" && styles.activeTabText,
            ]}
          >
            Events
          </Text>
        </Pressable>
      </View>

      <Text style={styles.browseTitle}>Browse by category</Text>

      {/* Horizontal category chips - changes based on active tab */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, height: 44 }}
        contentContainerStyle={{ flexDirection: "row", paddingBottom: 12 }}
      >
        {(activeTab === "Society" ? CATEGORIES : EVENT_CATEGORIES).map(
          (item) => (
            <Pressable
              key={item}
              style={[
                styles.chip,
                selectedCategory === item && styles.chipSelected,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === item && styles.chipTextSelected,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )
        )}
      </ScrollView>

      {/* Society results grid */}
      {activeTab === "Society" && (
        <FlatList
          style={{ marginTop: spacing.sm }}
          data={filteredSocieties}
          keyExtractor={(item) => item.society_id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate("SocietyDetail", { society: item })
              }
            >
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.cardImagePlaceholder} />
              )}
              <Text style={styles.cardName} numberOfLines={2}>
                {item.society_name}
              </Text>
            </Pressable>
          )}
        />
      )}

      {/* Events results grid */}
      {activeTab === "Events" && (
        <FlatList
          style={{ marginTop: spacing.sm }}
          data={filteredEvents}
          keyExtractor={(item) => item.event_id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate("EventDetail", { event: item })
              }
            >
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.cardImagePlaceholder} />
              )}
              <Text style={styles.cardName} numberOfLines={2}>
                {item.title}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
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
  tabs: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  activeTab: { backgroundColor: colors.primary },
  tabText: { color: colors.primary, fontWeight: "500" },
  activeTabText: { color: colors.white },
  browseTitle: {
    fontWeight: "bold",
    marginBottom: spacing.sm,
    color: colors.primaryText,
  },
  row: { gap: spacing.sm, marginBottom: spacing.sm },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 90 },
  cardImagePlaceholder: {
    width: "100%",
    height: 90,
    backgroundColor: colors.accent,
  },
  cardName: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    padding: spacing.sm,
    color: colors.primaryText,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: spacing.sm,
    height: 32,
    justifyContent: "center",
  },
  chipSelected: { backgroundColor: colors.primary },
  chipText: { color: colors.primary, fontSize: 12 },
  chipTextSelected: { color: colors.white, fontSize: 12 },
});
