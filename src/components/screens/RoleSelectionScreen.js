import { View, Button, StyleSheet, Text } from "react-native";

export default function RoleSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Role</Text>

      <Button
        title="Student"
        onPress={() => navigation.navigate("StudentLogin")}
        // onPress={() => navigation.navigate("StudentHomeScreen")}
      />

      <Button
        title="Society"
        onPress={() => navigation.navigate("SocietySelectScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", gap: 20 },
  title: { fontSize: 22, textAlign: "center", marginBottom: 20 },
});
