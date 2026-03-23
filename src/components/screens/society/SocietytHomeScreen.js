import { View, Text } from "react-native";
import { useSociety } from "../../../context/SocietyContext";

export default function SocietyHomeScreen() {
  const { society } = useSociety();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>
        {getGreeting()}, {society?.society_name}
      </Text>
    </View>
  );
}
