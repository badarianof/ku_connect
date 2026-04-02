import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../../../api/supabase";

const CATEGORIES = [
  "All",
  "Academic",
  "Cultural",
  "Faith",
  "Arts & Activities",
  "Liberation & Campaigns",
];
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

  useEffect(() => {
    const fetchData = async () => {
      const { data: socData, error: socError } = await supabase
        .from("society")
        .select(`*, society_category(category_name)`)
        .order("society_name", { ascending: true });

      if (!socError) setSocieties(socData);

      const { data: evData, error: evError } = await supabase
        .from("event")
        .select("*")
        .order("title", { ascending: true });

      if (!evError) setEvents(evData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredSocieties = societies.filter((s) => {
    const matchesQuery = s.society_name
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      s.society_category?.category_name === selectedCategory;
    return matchesQuery && matchesCategory;
  });

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

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="What are you looking for?"
        value={query}
        onChangeText={setQuery}
        style={styles.searchBar}
      />

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

      {activeTab === "Society" && (
        <FlatList
          data={filteredSocieties}
          keyExtractor={(item) => item.society_id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate("SocietyDetail", { society: item })
              }
            >
              <Text style={styles.societyName} numberOfLines={2}>
                {item.society_name}
              </Text>
            </Pressable>
          )}
        />
      )}

      {activeTab === "Events" && (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.event_id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate("EventDetail", { event: item })
              }
            >
              <Text style={styles.societyName} numberOfLines={2}>
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
  container: { flex: 1, padding: 20 },
  searchBar: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 25,
    marginBottom: 16,
  },
  tabs: { flexDirection: "row", gap: 10, marginBottom: 20 },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#032D39",
  },
  activeTab: { backgroundColor: "#032D39" },
  tabText: { color: "#032D39" },
  activeTabText: { color: "white" },
  browseTitle: { fontWeight: "bold", marginBottom: 12 },
  row: { gap: 8, marginBottom: 8 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  societyName: { fontSize: 12, textAlign: "center", fontWeight: "500" },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#032D39",
    marginRight: 8,
    height: 32,
    justifyContent: "center",
  },
  chipSelected: { backgroundColor: "#032D39" },
  chipText: { color: "#032D39", fontSize: 12 },
  chipTextSelected: { color: "white", fontSize: 12 },
});
