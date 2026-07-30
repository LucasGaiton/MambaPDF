import Constants from "expo-constants";
import { Alert, Linking } from "react-native";

export async function verificarActualizacion() {

    try {

        const versionActual = Constants.expoConfig.version;

        const respuesta = await fetch(
            "https://mambapdf-web.vercel.app/version.json"
        );

        // Verifica que la respuesta sea correcta (200 OK)
        if (!respuesta.ok) {
            throw new Error(
                `Error al obtener version.json (${respuesta.status})`
            );
        }

        const ultimaVersion = await respuesta.json();

        // Verifica que el JSON tenga la estructura esperada
        if (
            !ultimaVersion.version ||
            !ultimaVersion.url ||
            !Array.isArray(ultimaVersion.changes)
        ) {
            throw new Error("version.json tiene un formato inválido.");
        }

        if (hayNuevaVersion(versionActual, ultimaVersion.version)) {

            Alert.alert(
                "Nueva actualización",
                `Ya está disponible la versión ${ultimaVersion.version}.\n\nDescarga la nueva APK para actualizar.\n\nNovedades:\n• ${ultimaVersion.changes.join("\n• ")}`,
                [
                    {
                        text: "Más tarde",
                        style: "cancel",
                    },
                    {
                        text: "Actualizar",
                        onPress: () => Linking.openURL(ultimaVersion.url),
                    },
                ]
            );

        }

    } catch (error) {

        // Solo registrar el error. La aplicación continúa normalmente.
        console.warn(
            "No fue posible comprobar si hay actualizaciones:",
            error.message
        );

    }

}

function hayNuevaVersion(actual, remota) {

    const a = actual.split(".").map(Number);
    const b = remota.split(".").map(Number);

    for (let i = 0; i < 3; i++) {

        if (b[i] > a[i]) return true;
        if (b[i] < a[i]) return false;

    }

    return false;

}