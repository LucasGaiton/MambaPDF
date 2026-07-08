import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { listarOrdenes, listarPlantillas, eliminarOrden } from "../storage/storage";
import SearchBar from "../components/SearchBar";


export default function HistoyOrders({ navigation }) {

    const [ordenes, setOrdenes] = useState([]);
    const [plantillas, setPlantillas] = useState([]);

    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [plantillaSeleccionada, setPlantillaSeleccionada] = useState("");

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {

        const ordenesData = await listarOrdenes();
        const plantillasData = await listarPlantillas();

        setOrdenes(ordenesData || []);
        setPlantillas(plantillasData || []);

    };

    const obtenerPlantillaDeOrden = (orden) => {
        return plantillas.find(p => p.id === orden.plantillaId);
    };

    const abrirOrden = (orden) => {

        const plantilla = obtenerPlantillaDeOrden(orden);

        navigation.navigate("Detalle Orden", {
            orden,
            plantilla
        });

    };

    const borrarOrden = async (id) => {

        // Alert.alert(
        //     "Eliminar orden",
        //     "¿Seguro que quieres eliminar esta orden?",
        //     [
        //         { text: "Cancelar" },
        //         {
        //             text: "Eliminar",
        //             style: "destructive",
        //             onPress: async () => {
        //                 await eliminarOrden(id);
        //                 cargarDatos();
        //             }
        //         }
        //     ]
        // );
        await eliminarOrden(id);
        cargarDatos();
    };

    const renderOrden = ({ item }) => (

        <View style={styles.card}>

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

    const ordenesFiltradas = ordenes.filter((orden) => {

        const coincideNombre = orden.nombre
            .toLowerCase()
            .includes(textoBusqueda.toLowerCase());

        const coincidePlantilla =

            plantillaSeleccionada === "" ||

            orden.plantillaId === plantillaSeleccionada;

        return coincideNombre && coincidePlantilla;

    });

    const plantillaActiva = plantillas.find(
        p => p.id === plantillaSeleccionada
    );

    return (

        <View style={styles.container}>

            <SearchBar

                textoBusqueda={textoBusqueda}
                setTextoBusqueda={setTextoBusqueda}

                plantillaSeleccionada={plantillaSeleccionada}
                setPlantillaSeleccionada={setPlantillaSeleccionada}

                plantillas={plantillas}

            />

            {plantillaSeleccionada && (
                <Text style={styles.mensajeFiltro}>
                    Filtrando por: {plantillaActiva?.nombre}
                </Text>
            )}


            <FlatList
                data={ordenesFiltradas}
                keyExtractor={(item) => item.id}
                renderItem={renderOrden}
                ListEmptyComponent={<Text style={styles.mensajeNoEncontrado}>No hay órdenes guardadas</Text>}
            />

        </View>

    );

}

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