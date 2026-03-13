import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/student/HomeScreen";
import SocietyListScreen from "../screens/student/SocietyListScreen";
import Search from "../screens/student/Search";
import Profile from "../screens/student/Profile";

const Tab = createBottomTabNavigator();

export default function StudentTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen name="Societies" component={SocietyListScreen} />

      <Tab.Screen name="Search" component={Search} />

      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
