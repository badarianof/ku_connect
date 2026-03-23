import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/components/navigation/AppNavigator";
import { SocietyProvider } from "./src/context/SocietyContext"

export default function App() {
  return (
    <SocietyProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SocietyProvider>
  );
}
