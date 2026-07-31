/**
 * -----------------------------------------------------------------------------
 * HistoryOrders.jsx
 * -----------------------------------------------------------------------------
 * Pantalla encargada de visualizar el historial de órdenes de trabajo
 * almacenadas en la aplicación.
 *
 * Funcionalidades principales:
 * - Listar todas las órdenes almacenadas.
 * - Buscar órdenes por nombre.
 * - Filtrar órdenes según la plantilla utilizada.
 * - Abrir el detalle de una orden seleccionada.
 * - Eliminar órdenes existentes.
 *
 * La información se obtiene desde el almacenamiento local mediante las
 * funciones definidas en storage.js.
 * -----------------------------------------------------------------------------
 */

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert
} from "react-native";

import {
    listarOrdenes,
    listarPlantillas,
    eliminarOrden
} from "../storage/storage";

import SearchBar from "../components/SearchBar";

/**
 * -----------------------------------------------------------------------------
 * HistoryOrders
 * -----------------------------------------------------------------------------
 * Pantalla que muestra el historial de órdenes creadas por el usuario.
 *
 * Permite:
 * - Buscar órdenes por nombre.
 * - Filtrar por plantilla.
 * - Abrir el detalle de una orden.
 * - Eliminar órdenes almacenadas.
 *
 * @param {Object} navigation Objeto de navegación proporcionado por React Navigation.
 *
 * @returns {JSX.Element}
 * -----------------------------------------------------------------------------
 */
export default function HistoyOrders({ navigation }) {

    /**
     * -------------------------------------------------------------------------
     * Lista completa de órdenes almacenadas.
     * -------------------------------------------------------------------------
     */
    const [ordenes, setOrdenes] = useState([]);

    /**
     * -------------------------------------------------------------------------
     * Lista de plantillas disponibles.
     * -------------------------------------------------------------------------
     */
    const [plantillas, setPlantillas] = useState([]);

    /**
     * -------------------------------------------------------------------------
     * Texto ingresado en el buscador.
     * -------------------------------------------------------------------------
     */
    const [textoBusqueda, setTextoBusqueda] = useState("");

    /**
     * -------------------------------------------------------------------------
     * Identificador de la plantilla actualmente seleccionada como filtro.
     * -------------------------------------------------------------------------
     */
    const [plantillaSeleccionada, setPlantillaSeleccionada] = useState("");

    /**
     * -------------------------------------------------------------------------
     * Carga inicial de datos.
     *
     * Al montar la pantalla se recuperan las órdenes y plantillas almacenadas.
     * -------------------------------------------------------------------------
     */
    useEffect(() => {
        cargarDatos();
    }, []);

    /**
     * -------------------------------------------------------------------------
     * Recupera las órdenes y plantillas desde el almacenamiento local.
     *
     * Una vez obtenidos los datos, actualiza los estados correspondientes.
     * -------------------------------------------------------------------------
     */
    const cargarDatos = async () => {

        const ordenesData = await listarOrdenes();
        const plantillasData = await listarPlantillas();

        setOrdenes(ordenesData || []);
        setPlantillas(plantillasData || []);

    };

    /**
     * -------------------------------------------------------------------------
     * Obtiene la plantilla asociada a una orden.
     *
     * @param {Object} orden Orden seleccionada.
     *
     * @returns {Object|undefined} Plantilla correspondiente.
     * -------------------------------------------------------------------------
     */
    const obtenerPlantillaDeOrden = (orden) => {

        return plantillas.find(
            p => p.id === orden.plantillaId
        );

    };

    /**
     * -------------------------------------------------------------------------
     * Abre la pantalla de detalle de una orden.
     *
     * Además de enviar la orden seleccionada, también envía la plantilla
     * correspondiente para poder renderizar correctamente toda la información.
     *
     * @param {Object} orden Orden seleccionada.
     * -------------------------------------------------------------------------
     */
    const abrirOrden = (orden) => {

        const plantilla = obtenerPlantillaDeOrden(orden);
        console.log("Esto es lo que se manda a detail", plantilla);
        

        navigation.navigate("Detalle Orden", {
            orden,
            plantilla
        });

    };

    /**
     * -------------------------------------------------------------------------
     * Elimina una orden del almacenamiento.
     *
     * Luego de eliminarla, vuelve a cargar los datos para actualizar la lista.
     *
     * @param {string} id Identificador de la orden.
     * -------------------------------------------------------------------------
     */
    const borrarOrden = async (id) => {

        await eliminarOrden(id);

        cargarDatos();

    };

    /**
     * -------------------------------------------------------------------------
     * Renderiza una tarjeta correspondiente a una orden.
     *
     * Cada tarjeta permite:
     * - Abrir el detalle de la orden.
     * - Eliminarla.
     *
     * @param {Object} item Orden a renderizar.
     *
     * @returns {JSX.Element}
     * -------------------------------------------------------------------------
     */
    const renderOrden = ({ item }) => (

        <View style={styles.card}>

            {/*--------------------------------------------------------------
                Información principal de la orden
            --------------------------------------------------------------*/}
            <TouchableOpacity
                onPress={() => abrirOrden(item)}
            >

                <Text style={styles.titulo}>
                    {item.nombre} ({item.plantillaNombre})
                </Text>

                <Text>
                    {new Date(item.fechaCreacion).toLocaleString()}
                </Text>

            </TouchableOpacity>

            {/*--------------------------------------------------------------
                Botón para eliminar la orden
            --------------------------------------------------------------*/}
            <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => borrarOrden(item.id)}
            >

                <Text style={styles.textoEliminar}>
                    Eliminar
                </Text>

            </TouchableOpacity>

        </View>

    );

    /**
     * -------------------------------------------------------------------------
     * Lista de órdenes filtradas.
     *
     * Se aplican dos filtros:
     * - Nombre de la orden.
     * - Plantilla seleccionada.
     *
     * Ambos filtros son acumulativos.
     * -------------------------------------------------------------------------
     */
    const ordenesFiltradas = ordenes.filter((orden) => {

        const coincideNombre = orden.nombre
            .toLowerCase()
            .includes(textoBusqueda.toLowerCase());

        const coincidePlantilla =

            plantillaSeleccionada === "" ||

            orden.plantillaId === plantillaSeleccionada;

        return coincideNombre && coincidePlantilla;

    });

    /**
     * -------------------------------------------------------------------------
     * Obtiene la plantilla actualmente seleccionada.
     *
     * Se utiliza únicamente para mostrar el nombre del filtro activo.
     * -------------------------------------------------------------------------
     */
    const plantillaActiva = plantillas.find(

        p => p.id === plantillaSeleccionada

    );

    return (

        <View style={styles.container}>

            {/*--------------------------------------------------------------
                Barra de búsqueda y filtros
            --------------------------------------------------------------*/}
            <SearchBar

                textoBusqueda={textoBusqueda}
                setTextoBusqueda={setTextoBusqueda}

                plantillaSeleccionada={plantillaSeleccionada}
                setPlantillaSeleccionada={setPlantillaSeleccionada}

                plantillas={plantillas}

            />

            {/*--------------------------------------------------------------
                Indicador del filtro activo
            --------------------------------------------------------------*/}
            {plantillaSeleccionada && (

                <Text style={styles.mensajeFiltro}>

                    Filtrando por: {plantillaActiva?.nombre}

                </Text>

            )}

            {/*--------------------------------------------------------------
                Listado de órdenes
            --------------------------------------------------------------*/}
            <FlatList

                data={ordenesFiltradas}

                keyExtractor={(item) => item.id}

                renderItem={renderOrden}

                ListEmptyComponent={

                    <Text style={styles.mensajeNoEncontrado}>

                        No hay órdenes guardadas

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
 * - Tarjetas de órdenes.
 * - Botones.
 * - Mensajes informativos.
 * - Indicador del filtro activo.
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

    titulo: {
        fontWeight: "bold",
        fontSize: 17,
        color: "#B67A26",
        marginBottom: 6
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

    filterButton: {
        width: 55,
        height: "100%",
        backgroundColor: "#E1890A",
        justifyContent: "center",
        alignItems: "center"
    },

    mensajeFiltro: {
        alignSelf: "flex-start",
        backgroundColor: "#FFF4E5",
        color: "#8B6734",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#E1890A",
        fontWeight: "600",
        fontSize: 14
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