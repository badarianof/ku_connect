// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import SocietyListScreen from "./src/components/screens/student/SocietyListScreen";

// const Stack = createNativeStackNavigator();

// export const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="SocietyListScreen">
//         <Stack.Screen
//           name="SocietyListScreen"
//           component={SocietyListScreen}
//           options={{ title: "Society" }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

import { NavigationContainer } from "@react-navigation/native";
import StudentNavigator from "./src/components/navigation/StudentNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <StudentNavigator />
    </NavigationContainer>
  );
}
