import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { listarOrdenes, listarPlantillas, eliminarOrden } from "../storage/storage";

export default function HistoyOrders({ navigation }) {

    const [ordenes, setOrdenes] = useState([]);
    const [plantillas, setPlantillas] = useState([]);

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

        navigation.navigate("DetalleOrden", {
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
                    {item.plantillaId}
                </Text>

                <Text>ID: {item.id}</Text>

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

    return (

        <View style={styles.container}>

            <Text style={styles.header}>
                Historial de Ordenes
            </Text>

            <FlatList
                data={ordenes}
                keyExtractor={(item) => item.id}
                renderItem={renderOrden}
                ListEmptyComponent={<Text>No hay órdenes guardadas</Text>}
            />

        </View>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20
    },

    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },

    card: {
        backgroundColor: "#eee",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8
    },

    titulo: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 5
    },

    botonEliminar: {
        marginTop: 10,
        backgroundColor: "#ff4d4d",
        padding: 8,
        borderRadius: 5,
        alignItems: "center"
    },

    textoEliminar: {
        color: "white",
        fontWeight: "bold"
    }

});