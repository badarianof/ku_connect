import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RoleSelectScreen from "../screens/RoleSelectionScreen";
import StudentTabs from "./student/StudentTabs";
import SocietySelectScreen from "../screens/society/SocietySelectScreen";
import LeaderNavigator from "./society/LeaderNavigator";
import StudentNavigator from "./student/StudentNavigator";

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
        component={StudentNavigator}
        options={{ headerShown: false }}
      />

      {/* LEADER SIDE */}
      <Stack.Screen
        name="SocietySelectScreen"
        component={SocietySelectScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="LeaderFlow"
        component={LeaderNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
