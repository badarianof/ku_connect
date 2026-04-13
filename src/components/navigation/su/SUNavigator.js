import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import SUHomeScreen from "../../screens/su/SUHomeScreen";
import { colors, tabBarStyle } from "../../../theme";

const Tab = createBottomTabNavigator();

// Icon mapping for SU staff bottom navigation
const icons = {
  Home: "home",
};

export default function SUNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primaryText,
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
        tabBarStyle,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.white,
        tabBarIcon: ({ focused, color }) => (
          <Ionicons
            name={focused ? icons[route.name] : `${icons[route.name]}-outline`}
            size={22}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={SUHomeScreen} />
    </Tab.Navigator>
  );
}
