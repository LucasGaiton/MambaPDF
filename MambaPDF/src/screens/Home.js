import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Home({ navigation }) {

    const Boton = ({ titulo, pantalla }) => (
        <TouchableOpacity
            style={styles.boton}
            onPress={() => navigation.navigate(pantalla)}
        >
            <Text style={styles.textoBoton}>{titulo}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>

            <Boton
                titulo="Crear plantilla"
                pantalla="Crear Plantilla"
            />

            <Boton
                titulo="Nueva orden"
                pantalla="Seleccionar Plantilla"
            />

            <Boton
                titulo="Ordenes guardadas"
                pantalla="Ordenes guardadas"
            />

            <Boton
                titulo="Configurar PDF"
                pantalla="Configurar PDF"
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#33302D",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },

    boton: {
        width: "100%",
        backgroundColor: "#B67A26",
        padding: 16,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3
    },

    textoBoton: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    }

});