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

    return (

        <View style={styles.container}>


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
        padding: 20,
        backgroundColor: "#F6F3EF"
    },

    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#8B6734",
        marginBottom: 20
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
    }

});