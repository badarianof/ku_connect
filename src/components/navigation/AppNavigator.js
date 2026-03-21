import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RoleSelectScreen from "../screens/RoleSelectionScreen";
import StudentTabs from "./student/StudentTabs";
import LeaderTabs from "./society/LeaderTabs";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      {/* START HERE */}
      <Stack.Screen
        name="RoleSelect"
        component={RoleSelectScreen}
        options={{ headerShown: false }}
      />

      {/* STUDENT SIDE */}
      <Stack.Screen
        name="StudentTabs"
        component={StudentTabs}
        options={{ headerShown: false }}
      />

      {/* LEADER SIDE */}
      <Stack.Screen
        name="LeaderTabs"
        component={LeaderTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
