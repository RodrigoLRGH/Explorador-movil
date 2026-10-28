import { View, Text, Pressable, Linking, StyleSheet } from "react-native";

type Props = {
    titulo: string;
    mensaje: string;
    puedePreguntar?: boolean;
    onSolicitar: () => void;
}

export default function PermisoDenegado({
    titulo,
    mensaje,
    puedePreguntar = true,
    onSolicitar }: Props) {
    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>{titulo}</Text>
            <Text style={styles.mensaje}>{mensaje}</Text>

            {puedePreguntar ? (
                <Pressable style={styles.boton} onPress={onSolicitar}>
                    <Text style={styles.textoBoton}>Conceder permiso</Text>
                </Pressable>
            ) : (
                <>
                    <Text style={styles.nota}>
                        El permiso fue bloqueado. Actívalo manualmente desde los ajustes del
                        teléfono.
                    </Text>
                    <Pressable style={styles.boton} onPress={() => Linking.openSettings()}>
                        <Text style={styles.textoBoton}>Abrir ajustes</Text>
                    </Pressable>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        gap: 12,
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center"
    },
    mensaje: {
        fontSize: 16,
        color: "#4b5563",
        textAlign: "center",
        lineHeight: 22
    },
    nota: {
        fontSize: 13,
        color: "#FF0000",
        textAlign: "center"
    },
    boton: {
        backgroundColor: "#4169E1",
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 10,
        marginTop: 4,
    },
    textoBoton: {
        color: "#fff",
        fontSize: 16,
    },
});
