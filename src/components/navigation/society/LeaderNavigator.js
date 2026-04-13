import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LeaderTabs from "./LeaderTabs";
import EditEventScreen from "../../screens/society/EditEventScreen";
import EditSocietyProfile from "../../screens/society/EditSocietyProfile";
import { colors, tabBarStyle } from "../../../theme";

const Stack = createNativeStackNavigator();

export default function LeaderNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={LeaderTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditEvent"
        component={EditEventScreen}
        options={{
          headerShown: false,
          headerShown: true,
          headerTitle: "Edit Event",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { fontWeight: "bold" },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="EditSocietyProfile"
        component={EditSocietyProfile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
