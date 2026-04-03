import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  Image,
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
      const { data, error } = await supabase
        .from("society")
        .select("society_id, society_name, image_url")
        .order("society_name", { ascending: true });
      if (!error) setSocieties(data);
      setLoading(false);
    };
    fetchSocieties();
  }, []);

  const handleContinue = () => {
    if (!selected) return;
    setSociety(selected);
    navigation.navigate("LeaderFlow");
  };

  if (loading) return <ActivityIndicator />;

  return (
    <SafeAreaView style={styles.container}>
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
            <Image
              source={{
                uri:
                  item.image_url ||
                  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop",
              }}
              style={styles.societyImage}
              resizeMode="cover"
            />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  selectedCard: { backgroundColor: "#cce5ff" },
  name: { fontSize: 16 },
  societyImage: { width: 45, height: 45, borderRadius: 22 },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "black",
    borderRadius: 8,
    alignItems: "center",
  },
  disabled: { backgroundColor: "#aaa" },
  buttonText: { color: "white", fontWeight: "bold" },
});
