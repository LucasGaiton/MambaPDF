/**
 * -----------------------------------------------------------------------------
 * PreviewPDF.jsx
 * -----------------------------------------------------------------------------
 * Pantalla encargada de visualizar un documento PDF generado por la aplicación.
 *
 * Recibe la ubicación (URI) del archivo PDF mediante los parámetros de
 * navegación y lo renderiza utilizando el componente Pdf de la librería
 * react-native-pdf.
 *
 * Esta pantalla permite al usuario revisar el documento antes de compartirlo,
 * descargarlo o simplemente consultarlo nuevamente.
 * -----------------------------------------------------------------------------
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import Pdf from "react-native-pdf";

/**
 * -----------------------------------------------------------------------------
 * PreviewPDF
 * -----------------------------------------------------------------------------
 * Pantalla destinada a mostrar la vista previa de un documento PDF.
 *
 * Recibe la URI del archivo desde la pantalla anterior y la utiliza como
 * origen del documento que será renderizado.
 *
 * @param {Object} route Parámetros recibidos mediante React Navigation.
 *
 * @returns {JSX.Element}
 * -----------------------------------------------------------------------------
 */
export function PreviewPDF({ route }) {

    /**
     * -------------------------------------------------------------------------
     * URI del documento PDF generado.
     *
     * Corresponde a la ubicación del archivo dentro del dispositivo y es
     * utilizada por el componente Pdf para cargar y visualizar el documento.
     * -------------------------------------------------------------------------
     */
    const { pdfUri } = route.params;

    return (

        <View style={styles.container}>

            {/*--------------------------------------------------------------
                Visualizador del documento PDF.
            --------------------------------------------------------------*/}
            <Pdf

                source={{ uri: pdfUri }}

                style={styles.pdf}

                /**
                 * Se deshabilita la confianza automática en certificados SSL.
                 *
                 * En este caso el documento se carga desde el almacenamiento
                 * local del dispositivo, por lo que no es necesario aceptar
                 * certificados de servidores externos.
                 */
                trustAllCerts={false}

            />

        </View>

    );

}

/**
 * -----------------------------------------------------------------------------
 * Estilos de la pantalla.
 *
 * Define la apariencia visual de:
 * - Contenedor principal.
 * - Área destinada a la visualización del PDF.
 * -----------------------------------------------------------------------------
 */
const styles = StyleSheet.create({

    /**
     * Contenedor principal que ocupa toda la pantalla.
     */
    container: {
        flex: 1,
        backgroundColor: "#F6F3EF"
    },

    /**
     * Visor del documento PDF.
     *
     * Se expande para ocupar completamente el espacio disponible.
     */
    pdf: {
        flex: 1,
        width: "100%"
    }

});