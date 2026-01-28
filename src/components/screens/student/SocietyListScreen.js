import { View, Text, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../../api/supabase.js";

export default function StudentHomeScreen() {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocieties();
  }, []);

  async function fetchSocieties() {
    console.log("Fetching societies...");

    const { data, error } = await supabase.from("society").select(`
        society_id,
        society_name,
        description,
        society_category (
          category_name
        )
      `);

    if (error) {
      console.error(error);
    } else {
      setSocieties(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading societies...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={societies}
      keyExtractor={(item) => item.society_id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.society_name}</Text>
          <Text>{item.society_category?.category_name}</Text>
          <Text>{item.description}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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
});
