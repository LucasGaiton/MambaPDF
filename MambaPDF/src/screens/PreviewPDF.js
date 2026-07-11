import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { WebView } from "react-native-webview";

import { obtenerConfigPDF } from "../storage/storage";
import { generarHTMLPDF } from "../services/pdfService";
import * as WebBrowser from "expo-web-browser";

export function PreviewPDF({ route }) {
    const { uri } = route.params;

    const abrirPDF = async () => {
        console.log("Entra");
        try {
            await WebBrowser.openBrowserAsync(uri);
            
        } catch (error) {
            console.log(error);
            
        }
        
    };


    return (
        <View style={styles.container}>

            <Text style={styles.texto}>
                Vista previa del PDF
            </Text>

            <TouchableOpacity
                style={styles.boton}
                onPress={abrirPDF}
            >
                <Text style={styles.textoBoton}>
                    Abrir PDF
                </Text>
            </TouchableOpacity>

        </View>
    );
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F6F3EF",
        padding: 20,
    },

    texto: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#8B6734",
        marginBottom: 25,
    },

    boton: {
        backgroundColor: "#E1890A",
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
    },

    textoBoton: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    }

})