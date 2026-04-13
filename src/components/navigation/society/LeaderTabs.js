import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import SocietyHomeScreen from "../../screens/society/SocietytHomeScreen";
import SocietyDashboard from "../../screens/society/SocietyDashboard";
import CreateEventsScreen from "../../screens/society/CreateEventsScreen";
import SocietyProfile from "../../screens/society/SocietyProfile";
import { colors, tabBarStyle } from "../../../theme";

const Tab = createBottomTabNavigator();

// Icon mapping for society leader bottom navigation
const icons = {
  Home: "home",
  Dashboard: "grid",
  Events: "add-circle",
  Profile: "person",
};

export default function LeaderTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: colors.neutral },
        headerTintColor: colors.primaryText,
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
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
      <Tab.Screen name="Home" component={SocietyHomeScreen} />
      <Tab.Screen name="Dashboard" component={SocietyDashboard} />
      <Tab.Screen name="Events" component={CreateEventsScreen} />
      <Tab.Screen name="Profile" component={SocietyProfile} />
    </Tab.Navigator>
  );
}
