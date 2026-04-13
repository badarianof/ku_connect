import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LeaderTabs from "./LeaderTabs";
import EditEventScreen from "../../screens/society/EditEventScreen";
import EditSocietyProfile from "../../screens/society/EditSocietyProfile";
import { colors } from "../../../theme";

const Stack = createNativeStackNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: colors.neutral },
  headerTintColor: colors.primary,
  headerTitleStyle: { fontWeight: "bold" },
  headerShadowVisible: false,
};

export default function LeaderNavigator() {
  return (
    <Stack.Navigator>
      {/* Main tab navigator - no header since tabs have their own */}
      <Stack.Screen
        name="MainTabs"
        component={LeaderTabs}
        options={{ headerShown: false }}
      />

      {/* Edit event screen */}
      <Stack.Screen
        name="EditEvent"
        component={EditEventScreen}
        options={{ ...headerOptions, headerTitle: "Edit Event" }}
      />

      {/* Edit society profile screen */}
      <Stack.Screen
        name="EditSocietyProfile"
        component={EditSocietyProfile}
        options={{ ...headerOptions, headerTitle: "Edit Society Profile" }}
      />
    </Stack.Navigator>
  );
}
