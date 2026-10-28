import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import * as Location from "expo-location";
import PermisoDenegado from "../components/PermisoDenegado";

type EstadoPermiso = {
    granted: boolean;
    canAskAgain: boolean
};

type Coordenadas = {
    latitud: number;
    longitud: number;
    precision: number | null;
    altitud: number | null;
    hora: string;
};

export default function UbicacionScreen() {
    const [permiso, setPermiso] = useState<EstadoPermiso | null>(null);
    const [coords, setCoords] = useState<Coordenadas | null>(null);
    const [cargando, setCargando] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function obtenerUbicacion(): Promise<void> {
        setError(null);
        setCargando(true);

        try {
            const resp = await Location.requestForegroundPermissionsAsync();
            setPermiso({ granted: resp.granted, canAskAgain: resp.canAskAgain });
            if (!resp.granted) return;

            const activos = await Location.hasServicesEnabledAsync();
            if (!activos) {
                setError("Los servicios de ubicación están desactivados. Actívalos en los ajustes del teléfono.");
                return;
            }

            const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            setCoords({
                latitud: pos.coords.latitude,
                longitud: pos.coords.longitude,
                precision: pos.coords.accuracy,
                altitud: pos.coords.altitude,
                hora: new Date(pos.timestamp).toLocaleTimeString(),
            });
        } catch (error: unknown) {
            const detalle = error instanceof Error ? error.message : "error desconocido";
            setError("No se pudo obtener la ubicación: " + detalle);
        } finally {
            setCargando(false);
        }
    }

    if (permiso && !permiso.granted) {
        return (
            <PermisoDenegado
                titulo="Se requiere acceso a la ubicación"
                mensaje="No se puede acceder a la ubicación. Por favor, concede el permiso en los ajustes de la aplicación."
                puedePreguntar={permiso.canAskAgain}
                onSolicitar={obtenerUbicacion}
            />
        );
    }

    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>Ubicación actual</Text>

            <Pressable
                style={[styles.boton, cargando && styles.botonInactivo]}
                onPress={obtenerUbicacion}
                disabled={cargando}
            >
                <Text style={styles.textoBoton}>
                    {coords ? "Actualizar ubicación" : "Obtener mi ubicación"}
                </Text>
            </Pressable>

            {cargando && (
                <View style={styles.fila}>
                    <ActivityIndicator size="large" color="#4169E1" />
                    <Text style={styles.texto}>Obteniendo ubicación…</Text>
                </View>
            )}

            {error && <Text style={styles.error}>{error}</Text>}

            {coords && !cargando && (
                <View style={styles.tarjeta}>
                    <View style={styles.dato}>
                        <Text style={styles.etiqueta}>Latitud:</Text>
                        <Text style={styles.valor}>{coords.latitud.toFixed(6)}</Text>
                    </View>
                    <View style={styles.dato}>
                        <Text style={styles.etiqueta}>Longitud:</Text>
                        <Text style={styles.valor}>{coords.longitud.toFixed(6)}</Text>
                    </View>
                    <View style={styles.dato}>
                        <Text style={styles.etiqueta}>Precisión:</Text>
                        <Text style={styles.valor}>
                            {coords.precision != null ? `± ${coords.precision.toFixed(1)} m` : "-"}
                        </Text>
                    </View>
                    <View style={styles.dato}>
                        <Text style={styles.etiqueta}>Altitud:</Text>
                        <Text style={styles.valor}>
                            {coords.altitud != null ? `${Math.round(coords.altitud)} m` : "-"}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        padding: 24,
        gap: 12,
        justifyContent: "center"
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center"
    },
    texto: {
        fontSize: 16,
        color: "#4b5563",
        textAlign: "center"
    },
    fila: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "center",
        alignItems: "center"
    },
    error: {
        backgroundColor: "#FF0000",
        color: "#991b1b",
        padding: 10,
        textAlign: "center",
    },
    tarjeta: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 12,
        gap: 12,
    },
    dato: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    etiqueta: {
        fontSize: 16,
        color: "#6b7280"
    },
    valor: {
        fontSize: 16,
        color: "#000"
    },
    boton: {
        backgroundColor: "#4169E1",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    botonInactivo: {
        opacity: 0.5
    },
    textoBoton: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },
});
