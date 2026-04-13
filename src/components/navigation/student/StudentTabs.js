import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StudentHomeScreen from "../../screens/student/StudentHomeScreen";
import SocietyListScreen from "../../screens/student/SocietyListScreen";
import Search from "../../screens/student/Search";
import Profile from "../../screens/student/Profile";

import { Ionicons } from "@expo/vector-icons";
import { colors, tabBarStyle } from "../../../theme";

const Tab = createBottomTabNavigator();

// Icon mapping for student bottom navigation
const icons = {
  Home: "home",
  Societies: "people",
  Search: "search",
  Profile: "person",
};

export default function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: colors.neutral },
        tabBarStyle,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.primary,
        tabBarIcon: ({ focused, color }) => (
          <Ionicons
            name={focused ? icons[route.name] : `${icons[route.name]}-outline`}
            size={22}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={StudentHomeScreen} />
      <Tab.Screen name="Societies" component={SocietyListScreen} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
