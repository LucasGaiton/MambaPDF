import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { listarPlantillas } from "../storage/storage";

export default function SelectTemplate({ navigation }) {

    const [plantillas, setPlantillas] = useState([]);

    useEffect(() => {
        cargarPlantillas();
        console.log(plantillas);
        
    }, []);

    const cargarPlantillas = async () => {
        const data = await listarPlantillas();
        console.log("Esto es la data:",data);
        
        setPlantillas(data || []);
    };

    const seleccionarPlantilla = (plantilla) => {
        navigation.navigate("CrearOrden", { plantilla });
    };

    const renderPlantilla = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => seleccionarPlantilla(item)}
        >
            <Text style={styles.titulo}>{item.nombre}</Text>
            <Text>{item.campos.length} campos</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={plantillas}
                keyExtractor={(item) => item.id}
                renderItem={renderPlantilla}
                ListEmptyComponent={<Text>No hay plantillas</Text>}
            />
        </View>
    );
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
        fontSize: 18
    }
});