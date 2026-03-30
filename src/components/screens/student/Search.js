import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export default function StudentSearch({ navigation }) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Society");

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
          onPress={() => setActiveTab("Society")}
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
          onPress={() => setActiveTab("Events")}
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
});
