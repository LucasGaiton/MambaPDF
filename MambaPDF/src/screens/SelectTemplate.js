/**
 * -----------------------------------------------------------------------------
 * SelectTemplate.jsx
 * -----------------------------------------------------------------------------
 * Pantalla encargada de mostrar todas las plantillas de órdenes de trabajo
 * almacenadas en la aplicación.
 *
 * Funcionalidades principales:
 * - Listar las plantillas disponibles.
 * - Seleccionar una plantilla para crear una nueva orden.
 * - Editar una plantilla existente.
 * - Eliminar una plantilla.
 *
 * Además, muestra información resumida de cada plantilla, indicando la
 * cantidad de secciones y campos que la componen.
 * -----------------------------------------------------------------------------
 */

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";

import {
    listarPlantillas,
    eliminarPlantilla
} from "../storage/storage";

import { Ionicons } from "@expo/vector-icons";

/**
 * -----------------------------------------------------------------------------
 * SelectTemplate
 * -----------------------------------------------------------------------------
 * Pantalla utilizada para seleccionar una plantilla existente.
 *
 * Desde esta pantalla el usuario puede:
 * - Crear una nueva orden utilizando una plantilla.
 * - Editar una plantilla.
 * - Eliminar una plantilla almacenada.
 *
 * @param {Object} navigation Objeto de navegación proporcionado por React Navigation.
 *
 * @returns {JSX.Element}
 * -----------------------------------------------------------------------------
 */
export default function SelectTemplate({ navigation }) {

    /**
     * -------------------------------------------------------------------------
     * Lista de plantillas almacenadas.
     * -------------------------------------------------------------------------
     */
    const [plantillas, setPlantillas] = useState([]);

    /**
     * -------------------------------------------------------------------------
     * Carga inicial de las plantillas almacenadas.
     * -------------------------------------------------------------------------
     */
    useEffect(() => {

        cargarPlantillas();

    }, []);

    /**
     * -------------------------------------------------------------------------
     * Recupera todas las plantillas desde el almacenamiento local y actualiza
     * el estado de la pantalla.
     * -------------------------------------------------------------------------
     */
    const cargarPlantillas = async () => {

        const data = await listarPlantillas();

        setPlantillas(data || []);

        console.log(data);

    };

    /**
     * -------------------------------------------------------------------------
     * Navega hacia la pantalla de creación de órdenes utilizando la plantilla
     * seleccionada.
     *
     * @param {Object} plantilla Plantilla seleccionada.
     * -------------------------------------------------------------------------
     */
    const seleccionarPlantilla = (plantilla) => {

        navigation.navigate("Crear Orden", {

            plantilla

        });

    };

    /**
     * -------------------------------------------------------------------------
     * Elimina una plantilla del almacenamiento local y vuelve a cargar la lista
     * de plantillas disponibles.
     *
     * @param {string} id Identificador de la plantilla.
     * -------------------------------------------------------------------------
     */
    const borrarPlantilla = async (id) => {

        await eliminarPlantilla(id);

        cargarPlantillas();

    };

    /**
     * -------------------------------------------------------------------------
     * Calcula la cantidad total de campos pertenecientes a una plantilla.
     *
     * Recorre todas las secciones y suma la cantidad de campos presentes
     * en cada una.
     *
     * @param {Object} plantilla Plantilla a analizar.
     *
     * @returns {number} Cantidad total de campos.
     * -------------------------------------------------------------------------
     */
    const contarCampos = (plantilla) => {

        if (!plantilla.secciones) return 0;

        return plantilla.secciones.reduce((total, seccion) => {

            return total + (seccion.campos?.length || 0);

        }, 0);

    };

    /**
     * -------------------------------------------------------------------------
     * Renderiza una tarjeta correspondiente a una plantilla.
     *
     * Cada tarjeta permite:
     * - Seleccionar la plantilla para crear una orden.
     * - Editar la plantilla.
     * - Visualizar la cantidad de secciones y campos.
     * - Eliminar la plantilla.
     *
     * @param {Object} item Plantilla a renderizar.
     *
     * @returns {JSX.Element}
     * -------------------------------------------------------------------------
     */
    const renderPlantilla = ({ item }) => {

        const totalCampos = contarCampos(item);

        const totalSecciones = item.secciones?.length || 0;

        return (

            <View style={styles.card}>

                {/*----------------------------------------------------------
                    Información principal de la plantilla
                ----------------------------------------------------------*/}
                <TouchableOpacity
                    onPress={() => seleccionarPlantilla(item)}
                >

                    <View style={styles.contTitulo}>

                        <Text style={styles.titulo}>
                            {item.nombre}
                        </Text>

                        {/*--------------------------------------------------
                            Botón para editar la plantilla
                        --------------------------------------------------*/}
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate(
                                    "Crear Plantilla",
                                    {
                                        plantilla: item
                                    }
                                )
                            }
                        >

                            <Ionicons
                                name="create-outline"
                                size={20}
                                color="#8B6734"
                            />

                        </TouchableOpacity>

                    </View>

                    <Text style={styles.info}>
                        {totalSecciones} secciones
                    </Text>

                    <Text style={styles.info}>
                        {totalCampos} campos
                    </Text>

                </TouchableOpacity>

                {/*----------------------------------------------------------
                    Botón para eliminar la plantilla
                ----------------------------------------------------------*/}
                <TouchableOpacity
                    style={styles.botonEliminar}
                    onPress={() => borrarPlantilla(item.id)}
                >

                    <Text style={styles.textoEliminar}>
                        Eliminar
                    </Text>

                </TouchableOpacity>

            </View>

        );

    };

    return (

        <View style={styles.container}>

            {/*--------------------------------------------------------------
                Listado de plantillas disponibles
            --------------------------------------------------------------*/}
            <FlatList

                data={plantillas}

                keyExtractor={(item) => item.id}

                renderItem={renderPlantilla}

                ListEmptyComponent={

                    <Text style={styles.mensajeNoEncontrado}>

                        No hay plantillas guardadas

                    </Text>

                }

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
 * - Tarjetas de plantillas.
 * - Información mostrada.
 * - Botones de edición y eliminación.
 * - Mensaje cuando no existen plantillas.
 * -----------------------------------------------------------------------------
 */
const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F6F3EF"
    },

    card: {
        backgroundColor: "#FFFFFF",
        padding: 18,
        marginBottom: 15,
        borderRadius: 10,
        borderLeftWidth: 6,
        borderLeftColor: "#E1890A",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3
    },

    contTitulo: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },

    titulo: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#8B6734",
        marginBottom: 6
    },

    info: {
        fontSize: 14,
        color: "#555"
    },

    botonEliminar: {
        marginTop: 12,
        backgroundColor: "#8B6734",
        padding: 10,
        borderRadius: 6,
        alignItems: "center"
    },

    textoEliminar: {
        color: "white",
        fontWeight: "bold"
    },

    mensajeNoEncontrado: {
        marginTop: 50,
        textAlign: "center",
        color: "#777",
        fontSize: 16,
        fontWeight: "500",
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2
    },

});