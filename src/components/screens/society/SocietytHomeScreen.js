import { View, Text } from "react-native";

export default function SocietyHomeScreen() {
  return (
    <View>
      <Text>Society Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  greeting: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionTitle: { fontWeight: "bold", marginBottom: 10 },
  eventTitle: { fontSize: 16, fontWeight: "600" },
});
