import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StudentTabs from "./StudentTabs";
import SocietyDetailScreen from "../screens/student/SocietyDetailScreen";
import EventDetailScreen from "../screens/student/EventDetailScreen";
import EventListScreen from "../screens/student/EventListScreen";

const Stack = createNativeStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={StudentTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="SocietyDetail" component={SocietyDetailScreen} />

      <Stack.Screen name="EventList" component={EventListScreen} />

      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    </Stack.Navigator>
  );
}
