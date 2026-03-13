import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SocietyListScreen from "../screens/student/SocietyListScreen";
import SocietyDetailScreen from "../screens/student/SocietyDetailScreen";

const Stack = createNativeStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Societies"
        component={SocietyListScreen}
      />

      <Stack.Screen
        name="SocietyDetail"
        component={SocietyDetailScreen}
      />
    </Stack.Navigator>
  );
}