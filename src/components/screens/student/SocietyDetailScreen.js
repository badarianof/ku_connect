import { View, Text, StyleSheet } from "react-native";

export default function SocietyDetailScreen({ route }) {
  const { society } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{society.society_name}</Text>
  
      <Text style={styles.category}>
        {society.society_category?.category_name}
      </Text>
  
      <Text style={styles.description}>
        {society.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  category: {
    fontStyle: "italic",
    marginBottom: 20,
  },

  description: {
    fontSize: 16,
    lineHeight: 22,
  },
});
