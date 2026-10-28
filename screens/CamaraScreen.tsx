import { useRef, useState } from "react";
import { View, Text, Image, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import PermisoDenegado from "../components/PermisoDenegado";

export default function CamaraScreen() {
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [fotoUri, setFotoUri] = useState<string | null>(null);
    const [camaraLista, setCamaraLista] = useState<boolean>(false);
    const [capturando, setCapturando] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    if (!permission) {
        return (
            <View style={styles.centro}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.texto}>Comprobando permisos de cámara…</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <PermisoDenegado
                titulo="Se requiere acceso a la cámara"
                mensaje="No se puede acceder a la cámara. Por favor, concede el permiso en los ajustes de la aplicación."
                onSolicitar={requestPermission}
            />
        );
    }

    async function tomarFoto(): Promise<void> {
        if (!cameraRef.current || capturando || !camaraLista) return;
        setError(null);
        setCapturando(true);
        try {
            const foto = await cameraRef.current.takePictureAsync();
            if (foto?.uri) {
                setFotoUri(foto.uri);
            } else {
                setError("No se pudo capturar la foto. Intenta nuevamente.");
            }
        } catch (error) {
            setError("Ocurrió un error al capturar la foto. Intenta nuevamente.");
        } finally {
            setCapturando(false);
        }
    }

    if (fotoUri) {
        return (
            <View style={styles.foto}>
                <Image source={{ uri: fotoUri }} style={styles.foto} resizeMode="contain" />
                <View style={styles.barra}>
                    <Pressable
                        style={[styles.boton, capturando && styles.botonInactivo]}
                        onPress={() => {
                            setFotoUri(null);
                            setCamaraLista(false);
                        }}
                    >
                        <Text style={styles.textoBoton}>Tomar otra foto</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.contenedor}>
            <CameraView
                ref={cameraRef}
                style={styles.camara}
                facing="back"
                onCameraReady={() => setCamaraLista(true)}
                onMountError={() => setError("Error al iniciar la cámara: ")}
            />

            {!camaraLista && !error && (
                <View style={styles.centro}>
                    <ActivityIndicator size="large" color="#2563eb" />
                    <Text style={styles.textoClaro}>Cargando cámara…</Text>
                </View>
            )}

            {error && <Text style={styles.error}>{error}</Text>}

            <View style={styles.barra}>
                <Pressable
                    style={[styles.boton, (!camaraLista || capturando) && styles.botonInactivo]}
                    onPress={tomarFoto}
                    disabled={!camaraLista || capturando}
                >
                    <Text style={styles.textoBoton}>Tomar foto</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: "#000"
    },
    camara: {
        flex: 1
    },
    foto: {
        flex: 1,
        backgroundColor: "#000"
    },
    centro: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12
    },
    texto: {
        fontSize: 16,
        color: "#4b5563"
    },
    textoClaro: {
        color: "#fff",
        marginTop: 8
    },
    cargando: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
    },
    barra: {
        padding: 16,
        alignItems: "center",
        backgroundColor: "#000",
    },
    boton: {
        backgroundColor: "#4169E1",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
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
    error: {
        backgroundColor: "#FF0000",
        color: "#991b1b",
        padding: 10,
        textAlign: "center",
    },
});

