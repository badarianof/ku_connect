import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { useSociety } from "../../../context/SocietyContext";
import { useState, useEffect } from "react";
import { supabase } from "../../../api/supabase";

export default function SocietySelectScreen({ navigation }) {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const { setSociety } = useSociety();

  useEffect(() => {
    const fetchSocieties = async () => {
      const { data, error } = await supabase.from("society").select("*");
      if (!error) setSocieties(data);
      setLoading(false);
    };
    fetchSocieties();
  }, []);

  const handleContinue = () => {
    if (!selected) return;

    setSociety(selected); // ✅ store globally
    navigation.navigate("LeaderFlow"); // ✅ no params needed
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Society</Text>

      <FlatList
        data={societies}
        keyExtractor={(item) => item.society_id}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              selected?.society_id === item.society_id && styles.selectedCard,
            ]}
            onPress={() => setSelected(item)}
          >
            <Text style={styles.name}>{item.society_name}</Text>
          </Pressable>
        )}
      />

      <Pressable
        style={[styles.button, !selected && styles.disabled]}
        onPress={handleContinue}
        disabled={!selected}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedCard: {
    backgroundColor: "#cce5ff",
  },
  name: {
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "black",
    borderRadius: 8,
    alignItems: "center",
  },
  disabled: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
