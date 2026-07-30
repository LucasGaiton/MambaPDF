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

            const cambioMayor = esCambioMayor(
                versionActual,
                ultimaVersion.version
            );

            const mensaje = cambioMayor
                ? `Hay una nueva versión disponible.

                    Versión instalada: ${versionActual}
                    Nueva versión: ${ultimaVersion.version}

                    ⚠ Esta actualización contiene cambios incompatibles con versiones anteriores.

                    Para evitar errores es necesario borrar los datos de la aplicación (o desinstalarla) antes de instalar la nueva versión.

                    Novedades:
                    • ${ultimaVersion.changes.join("\n• ")}`
                
                : `Hay una nueva versión disponible.

                    Versión instalada: ${versionActual}
                    Nueva versión: ${ultimaVersion.version}

                    Descargá la nueva APK para actualizar la aplicación.

                    Novedades:
                    • ${ultimaVersion.changes.join("\n• ")}`;

            Alert.alert(
                "Nueva actualización",
                mensaje,
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

function esCambioMayor(actual, remota) {
    const majorActual = Number(actual.split(".")[0]);
    const majorRemota = Number(remota.split(".")[0]);

    return majorRemota > majorActual;
}