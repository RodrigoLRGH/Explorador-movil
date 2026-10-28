import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Magnetometer, MagnetometerMeasurement } from "expo-sensors";

type EstadoSensor = "cargando" | "listo" | "noDisponible" | "error";
type Suscripcion = ReturnType<typeof Magnetometer.addListener>;

const PUNTOS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"] as const;

function calcularRumbo({ x, y }: MagnetometerMeasurement): number {
    const grados = Math.atan2(y, x) * (180 / Math.PI) - 90;
    return (grados + 360) % 360;
}

function nombreDireccion(grados: number): (typeof PUNTOS)[number] {
    return PUNTOS[Math.round(grados / 45) % 8];
}

export default function BrujulaScreen() {
    const [estado, setEstado] = useState<EstadoSensor>("cargando");
    const [rumbo, setRumbo] = useState<number>(0);
    const [mensaje, setMensaje] = useState<string | null>(null);

    useEffect(() => {
        let suscripcion: Suscripcion | null = null;
        let activo = true;

        async function iniciar(): Promise<void> {
            try {
                const disponible = await Magnetometer.isAvailableAsync();
                if (!activo) return;
                if (!disponible) {
                    setEstado("noDisponible");
                    return;
                }

                const permiso = await Magnetometer.requestPermissionsAsync();
                if (!activo) return;
                if (!permiso.granted) {
                    setMensaje("Se denegó el permiso para leer el sensor de movimiento.");
                    setEstado("error");
                    return;
                }

                Magnetometer.setUpdateInterval(200);
                suscripcion = Magnetometer.addListener((datos) => {
                    setRumbo(calcularRumbo(datos));
                    setEstado("listo");
                });
            } catch (error: unknown) {
                setMensaje("Ocurrió un error al intentar leer el sensor de movimiento.");
                setEstado("error");
            }
        }

        iniciar();
        return () => {
            activo = false;
            suscripcion?.remove();
        }
    }, []);

    if (estado === "cargando") {
        return (
            <View style={styles.centro}>
                <ActivityIndicator size="large" color="#4169E1" />
                <Text style={styles.texto}>Cargando brújula…</Text>
            </View>
        );
    }

    if (estado === "noDisponible") {
        return (
            <View style={styles.centro}>
                <Text style={styles.titulo}>El sensor de movimiento no está disponible en este dispositivo.</Text>
                <Text style={styles.texto}>Este dispositivo no tiene magnetómetro.</Text>
            </View>
        );
    }

    if (estado === "error") {
        return (
            <View style={styles.centro}>
                <Text style={styles.titulo}>Ocurrió un error al intentar leer el sensor de movimiento.</Text>
                <Text style={styles.texto}>{mensaje}</Text>
            </View>
        );
    }

    return (
        <View style={styles.centro}>
            <Text style={styles.titulo}>Brújula</Text>
            <Text style={styles.texto}>Rumbo: {rumbo.toFixed(1)}°</Text>
            <Text style={styles.texto}>Dirección: {nombreDireccion(rumbo)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    centro: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        gap: 12
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
        textAlign: "center",
        lineHeight: 22
    },
    error: {
        backgroundColor: "#FF0000",
        color: "#991b1b",
        padding: 12,
        borderRadius: 10,
        textAlign: "center",
    },
});