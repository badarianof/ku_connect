import { View, Text, StyleSheet } from "react-native";
import ScreenWrapper from "../layout/ScreenWrapper";
import Button from "../layout/Button";
import { colors, spacing } from "../../theme";

export default function RoleSelectScreen({ navigation }) {
  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.appName}>KU Connect</Text>
        <Text style={styles.tagline}>
          Your university societies, all in one place
        </Text>
      </View>

      <View style={styles.buttons}>
        <Button
          title="I'm a Student"
          onPress={() => navigation.navigate("StudentLogin")}
        />
        <Button
          title="I'm a Society"
          variant="secondary"
          onPress={() => navigation.navigate("SocietySelectScreen")}
        />
        <Text
          style={styles.suText}
          onPress={() => navigation.navigate("SULogin")}
        >
          SU Staff Access
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { justifyContent: "space-between" },
  header: { flex: 1, justifyContent: "center", alignItems: "center" },
  appName: {
    fontSize: 42,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: 15,
    color: colors.grey,
    textAlign: "center",
    lineHeight: 22,
  },
  buttons: { gap: spacing.md, marginBottom: spacing.xl },
  suText: {
    color: colors.neutral,
    fontSize: 12,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});
