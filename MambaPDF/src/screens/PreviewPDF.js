import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

import { obtenerConfigPDF } from "../storage/storage";
import { generarHTMLPDF } from "../services/pdfService";
import * as WebBrowser from "expo-web-browser";

export function PreviewPDF() {

    const [html, setHtml] = useState("");

    useEffect(() => {
        cargarPreview();
    }, []);

    const cargarPreview = async () => {


        const ordenEjemplo = {
            nombre: "Ejemplo de Orden",
            fechaCreacion: new Date(),
            valores: {
                cliente: "Juan Pérez",
                telefono: "2966 123456",
                descripcion: "Cambio de fuente de alimentación."
            }
        };

        const plantillaPreview = {
            nombre: "Instalación",
            secciones: [
                {
                    titulo: "Cliente",
                    campos: [
                        { id: "cliente", etiqueta: "Cliente" },
                        { id: "telefono", etiqueta: "Teléfono" }
                    ]
                },
                {
                    titulo: "Trabajo",
                    campos: [
                        { id: "descripcion", etiqueta: "Descripción" }
                    ]
                }
            ]
        };

        try {

            const config = await obtenerConfigPDF();

            const htmlGenerado = generarHTMLPDF(
                config,
                ordenEjemplo,
                plantillaPreview
            );

            setHtml(htmlGenerado);

        } catch (e) {
            console.log(e);
        }

    };

    if (!html) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <WebView
            originWhitelist={["*"]}
            source={{ html }}
        />
    );
}