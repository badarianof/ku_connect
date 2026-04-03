import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useSociety } from "../../../context/SocietyContext";

export default function SocietyProfile({ navigation }) {
  const { society } = useSociety();

  if (!society) return <ActivityIndicator style={{ flex: 1 }} />;

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Image
        source={{ uri: society.image_url || DEFAULT_IMAGE }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.card}>
        <View style={styles.nameRow}>
          <Text style={styles.societyName}>{society.society_name}</Text>
          <Pressable onPress={() => navigation.navigate("EditSocietyProfile")}>
            <Text style={styles.editIcon}>✏️</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>About us:</Text>
        <Text style={styles.description}>{society.description}</Text>
      </View>

      <View style={styles.eventsHeader}>
        <Text style={styles.sectionTitle}>Our Events</Text>
        <Pressable onPress={() => navigation.navigate("Dashboard")}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  image: { width: "100%", height: 180, borderRadius: 12, marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  societyName: { fontSize: 18, fontWeight: "bold" },
  editIcon: { fontSize: 18 },
  label: { fontWeight: "600", marginBottom: 4, color: "#666" },
  description: { color: "#333", lineHeight: 20 },
  eventsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold" },
  viewAll: { color: "#032D39", fontWeight: "600" },
});
