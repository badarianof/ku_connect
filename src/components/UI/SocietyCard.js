import { View, Text, StyleSheet, Pressable } from "react-native";

export default function SocietyCard({ society, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.card}>
        <Text style={styles.name}>{society.society_name}</Text>

        <Text style={styles.category}>
          {society.society_category?.category_name}
        </Text>

        <Text style={styles.description}>
          {society.description}
        </Text>

        <Text style={styles.link}>View Society</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  category: {
    fontSize: 13,
    fontStyle: "italic",
  },
  description: {
    marginTop: 6,
  },
  link: {
    marginTop: 10,
    color: "blue",
  },
});