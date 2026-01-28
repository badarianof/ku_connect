import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SocietyListScreen from "./src/components/screens/student/SocietyListScreen";

const Stack = createNativeStackNavigator();

export const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SocietyListScreen">
        <Stack.Screen
          name="SocietyListScreen"
          component={SocietyListScreen}
          options={{ title: "Society" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

// import { View, Text, StyleSheet } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>IT WORKS</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'red',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text: {
//     color: 'white',
//     fontSize: 30,
//     fontWeight: 'bold',
//   },
// });
