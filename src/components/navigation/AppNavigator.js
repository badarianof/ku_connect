import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RoleSelectScreen from "../screens/RoleSelectionScreen";
import StudentNavigator from "./student/StudentNavigator";
import SocietySelectScreen from "../screens/society/SocietySelectScreen";
import LeaderNavigator from "./society/LeaderNavigator";
import StudentLoginScreen from "../screens/student/StudentLoginScreen";
import StudentSignupScreen from "../screens/student/SignUpScreen";
import StudentHomeScreen from "../screens/student/StudentHomeScreen";

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

      {/* STUDENT AUTH */}
      {/* <Stack.Screen
        name="StudentHomeScreen"
        component={StudentHomeScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="StudentLogin"
        component={StudentLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudentSignup"
        component={StudentSignupScreen}
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
