import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SocietyListScreen from '../screens/student/SocietyListScreen';

const Stack = createNativeStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Societies"
        component={SocietyListScreen}
      />
    </Stack.Navigator>
  );
}
