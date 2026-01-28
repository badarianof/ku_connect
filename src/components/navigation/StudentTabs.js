import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudentHomeScreen from '../screens/student/StudentHomeScreen.js';
import StudentSearch from '../screens/student/StudentSearch.js';
import StudentEventsScreen from '../screens/student/StudentEventsScreen.js';
import StudentProfile from '../screens/student/StudentProfile.js';

const Tab = createBottomTabNavigator();

export default function StudentTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={StudentHomeScreen} />
      <Tab.Screen name="Search" component={StudentSearch} />
      <Tab.Screen name="Events" component={StudentEventsScreen} />
      <Tab.Screen name="Profile" component={StudentProfile} />
    </Tab.Navigator>
  );
}


