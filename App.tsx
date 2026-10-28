import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import InicioScreen from "./screens/InicioScreen";
import CamaraScreen from "./screens/CamaraScreen";
import UbicacionScreen from "./screens/UbicacionScreen";
import BrujulaScreen from "./screens/BrujulaScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen name="Inicio" component={InicioScreen} options={{ title: "Inicio" }} />
        <Stack.Screen name="Camara" component={CamaraScreen} options={{ title: "Cámara" }} />
        <Stack.Screen name="Ubicacion" component={UbicacionScreen} options={{ title: "Ubicación" }} />
        <Stack.Screen name="Brujula" component={BrujulaScreen} options={{ title: "Brújula" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}