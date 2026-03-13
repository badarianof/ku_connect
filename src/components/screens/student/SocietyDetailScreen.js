import { View, Text, StyleSheet, Pressable } from "react-native";

export default function SocietyDetailScreen({ route, navigation }) {
  const society = route?.params?.society;

  if (!society) {
    return (
      <View>
        <Text>No society data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{society.society_name}</Text>

      <Text style={styles.category}>
        {society.society_category?.category_name}
      </Text>

      <Text style={styles.description}>{society.description}</Text>

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
  button: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { fontWeight: "bold" },
});
