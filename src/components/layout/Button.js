import { Pressable, Text, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../../theme";

export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
}) {
  return (
    <Pressable
      style={[styles.button, styles[variant], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[styles.text, variant === "secondary" && styles.secondaryText]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: spacing.lg,
    borderRadius: radius.full,
    alignItems: "center",
  },
  primary: { backgroundColor: colors.primary },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  danger: { backgroundColor: colors.error },
  disabled: { backgroundColor: colors.neutral },
  text: { color: colors.white, fontWeight: "bold", fontSize: 16 },
  secondaryText: { color: colors.primary },
});
