import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import StudentHomeScreen from "../../screens/student/StudentHomeScreen";
import SocietyListScreen from "../../screens/student/SocietyListScreen";
import Search from "../../screens/student/Search";
import Profile from "../../screens/student/Profile";
// import { Ionicons } from "@expo/vector-icons";
// import { colors } from "../../theme";

const Tab = createBottomTabNavigator();

export default function StudentTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={StudentHomeScreen} />

      <Tab.Screen name="Societies" component={SocietyListScreen} />

      <Tab.Screen name="Search" component={Search} />

      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
