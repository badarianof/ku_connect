import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SUHomeScreen from "../../screens/su/SUHomeScreen";

const Tab = createBottomTabNavigator();

export default function SUNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={SUHomeScreen} />
    </Tab.Navigator>
  );
}
