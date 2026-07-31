/**
 * -----------------------------------------------------------------------------
 * Home.jsx
 * -----------------------------------------------------------------------------
 * Pantalla principal de la aplicación MambaPDF.
 *
 * Actúa como menú de navegación, proporcionando acceso a las principales
 * funcionalidades de la aplicación mediante una serie de botones.
 *
 * Opciones disponibles:
 * - Crear una nueva plantilla.
 * - Crear una nueva orden de trabajo.
 * - Consultar las órdenes almacenadas.
 * - Configurar la apariencia del PDF generado.
 * -----------------------------------------------------------------------------
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Constants from "expo-constants";


const versionActual = Constants.expoConfig.version;

console.log(versionActual);

/**
 * -----------------------------------------------------------------------------
 * Home
 * -----------------------------------------------------------------------------
 * Pantalla de inicio de la aplicación.
 *
 * Presenta un menú principal desde el cual el usuario puede navegar hacia
 * las distintas pantallas de la aplicación.
 *
 * @param {Object} navigation Objeto de navegación proporcionado por React Navigation.
 *
 * @returns {JSX.Element}
 * -----------------------------------------------------------------------------
 */
export default function Home({ navigation }) {

    /**
     * -------------------------------------------------------------------------
     * Botón reutilizable del menú principal.
     *
     * Recibe el texto que se mostrará y el nombre de la pantalla a la que
     * debe navegar cuando el usuario presione el botón.
     *
     * @param {Object} props Propiedades del componente.
     * @param {string} props.titulo Texto mostrado en el botón.
     * @param {string} props.pantalla Nombre de la pantalla destino.
     *
     * @returns {JSX.Element}
     * -------------------------------------------------------------------------
     */


    const Boton = ({ titulo, pantalla }) => (

        <TouchableOpacity
            style={styles.boton}
            onPress={() => navigation.navigate(pantalla)}
        >

            <Text style={styles.textoBoton}>

                {titulo}

            </Text>

        </TouchableOpacity>

    );

    return (

        <View style={styles.container}>

            {/*--------------------------------------------------------------
                Navega a la creación de una nueva plantilla.
            --------------------------------------------------------------*/}
            <Boton
                titulo="Crear plantilla"
                pantalla="Crear Plantilla"
            />

            {/*--------------------------------------------------------------
                Navega a la selección de plantilla para crear una nueva orden.
            --------------------------------------------------------------*/}
            <Boton
                titulo="Nueva orden"
                pantalla="Seleccionar Plantilla"
            />

            {/*--------------------------------------------------------------
                Navega al historial de órdenes guardadas.
            --------------------------------------------------------------*/}
            <Boton
                titulo="Ordenes guardadas"
                pantalla="Ordenes guardadas"
            />

            {/*--------------------------------------------------------------
                Navega a la configuración del diseño del PDF.
            --------------------------------------------------------------*/}
            <Boton
                titulo="Configurar PDF"
                pantalla="Configurar PDF"
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
 * - Botones del menú.
 * - Texto de los botones.
 * -----------------------------------------------------------------------------
 */
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