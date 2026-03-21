import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SocietyHomeScreen from "../../screens/society/SocietytHomeScreen";
import SocietyDashboard from "../../screens/society/SocietyDashboard";
import CreateEventsScreen from "../../screens/society/CreateEventsScreen";
import SocietyProfile from "../../screens/society/SocietyProfile";

const Tab = createBottomTabNavigator();

export default function LeaderTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={SocietyHomeScreen} />

      <Tab.Screen name="Dashboard" component={SocietyDashboard} />

      <Tab.Screen name="Events" component={CreateEventsScreen} />

      <Tab.Screen name="Profile" component={SocietyProfile} />
    </Tab.Navigator>
  );
}
