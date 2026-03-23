import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LeaderTabs from "./LeaderTabs";

const Stack = createNativeStackNavigator();

export default function LeaderNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={LeaderTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
