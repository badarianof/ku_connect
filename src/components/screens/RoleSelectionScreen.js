import { View, Button, StyleSheet, Text, Pressable } from "react-native";

export default function RoleSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Role</Text>

      <Button
        title="Student"
        onPress={() => navigation.navigate("StudentLogin")}
      />

      <Button
        title="Society"
        onPress={() => navigation.navigate("SocietySelectScreen")}
      />

      <Pressable
        style={styles.suLink}
        onPress={() => navigation.navigate("SUTabs")}
      >
        <Text style={styles.suText}>SU Staff Access</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  title: { fontSize: 22, textAlign: "center", marginBottom: 20 },
  suLink: { alignItems: "center", marginTop: 20 },
  suText: { color: "#aaa", fontSize: 12 },
});
