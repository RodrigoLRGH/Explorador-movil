import { View, Text, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Inicio">;

export default function InicioScreen({ navigation }: Props) {
    return (
        <View style={styles.inicio}>
            <Text style={styles.titulo}>Explorador móvil</Text>

            <Pressable style={styles.boton} onPress={() => navigation.navigate("Camara")}>
                <Text style={styles.botonTitulo}>Cámara</Text>
                <Text style={styles.botonDesc}>Toma y visualiza una foto</Text>
            </Pressable>

            <Pressable style={styles.boton} onPress={() => navigation.navigate("Ubicacion")}>
                <Text style={styles.botonTitulo}>Ubicación</Text>
                <Text style={styles.botonDesc}>Consulta tus coordenadas GPS</Text>
            </Pressable>

            <Pressable style={styles.boton} onPress={() => navigation.navigate("Brujula")}>
                <Text style={styles.botonTitulo}>Brújula</Text>
                <Text style={styles.botonDesc}>Orientación aproximada</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    inicio: {
        flex: 1,
        padding: 24,
        gap: 12,
        justifyContent: "center",
        backgroundColor: "#fff",
        fontWeight: "bold",
    },
    titulo: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        color: "#000",
        marginBottom: 12
    },
    boton: {
        backgroundColor: "#4169E1",
        borderRadius: 12,
        padding: 12
    },
    botonTitulo: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700"
    },
    botonDesc: {
        color: "#fff",
        fontSize: 16,
        marginTop: 4
    },
});
