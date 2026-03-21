import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LeaderTabs from "./LeaderTabs";

const Stack = createNativeStackNavigator();

export default function LeaderNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={LeaderTabs}
        options={{ headerShown: false }}
      />
      {/* 
      <Stack.Screen name="Home" component={SocietyHomeScreen} />

      <Stack.Screen name="Dashboard" component={SocietyDashboard} />

      <Stack.Screen name="Events" component={CreateEventsScreen} />

      <Stack.Screen name="Profile" component={SocietyProfile} /> */}
    </Stack.Navigator>
  );
}
