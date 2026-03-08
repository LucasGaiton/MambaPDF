import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { guardarOrden, listarOrdenes } from "../storage/storage";
import { TouchableOpacity } from "react-native";

export default function HistoyOrders({ navigation }) {
    useEffect(() => {
        cargarOrdenes()
    }, [])
    const [ordenes, setOrdenes] = useState([])

    const cargarOrdenes = async () => {
        let data = await listarOrdenes()
        setOrdenes(data)
    }
    const renderOrden = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("DetalleOrden", { orden: item })}
        >
            <View style={styles.card}>
                <Text style={styles.titulo}>{item.plantillaId}</Text>
                <Text>ID: {item.id}</Text>
                <Text>
                    {new Date(item.fechaCreacion).toLocaleString()}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <Text>Historial de Ordenes</Text>
            <FlatList
                data={ordenes}
                keyExtractor={(item) => item.id}
                renderItem={renderOrden}
                ListEmptyComponent={<Text>No hay órdenes guardadas</Text>}
            />


        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
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
    }
});