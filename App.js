import { NavigationContainer } from "@react-navigation/native";
import StudentNavigator from "./src/components/navigation/StudentNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <StudentNavigator />
    </NavigationContainer>
  );
}
