import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateEventScreen from "../../screens/society/CreateEventsScreen";

const Stack = createNativeStackNavigator();

export default function LeaderNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
    </Stack.Navigator>
  );
}