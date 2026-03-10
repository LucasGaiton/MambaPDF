import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";

import { listarPlantillas, eliminarPlantilla } from "../storage/storage";

export default function SelectTemplate({ navigation }) {

    const [plantillas, setPlantillas] = useState([]);

    useEffect(() => {
        cargarPlantillas();
    }, []);

    const cargarPlantillas = async () => {

        const data = await listarPlantillas();
        setPlantillas(data || []);

    };

    const seleccionarPlantilla = (plantilla) => {
        navigation.navigate("CrearOrden", { plantilla });
    };

    const borrarPlantilla = async (id) => {

        // Alert.alert(
        //     "Eliminar plantilla",
        //     "¿Seguro que quieres eliminar esta plantilla?",
        //     [
        //         { text: "Cancelar" },
        //         {
        //             text: "Eliminar",
        //             style: "destructive",
        //             onPress: async () => {
        //                 await eliminarPlantilla(id);
        //                 cargarPlantillas();
        //             }
        //         }
        //     ]
        // );
        await eliminarPlantilla(id);
        cargarPlantillas();

    };

    const contarCampos = (plantilla) => {

        if (!plantilla.secciones) return 0;

        return plantilla.secciones.reduce((total, seccion) => {
            return total + (seccion.campos?.length || 0);
        }, 0);

    };

    const renderPlantilla = ({ item }) => {

        const totalCampos = contarCampos(item);
        const totalSecciones = item.secciones?.length || 0;

        return (

            <View style={styles.card}>

                <TouchableOpacity
                    onPress={() => seleccionarPlantilla(item)}
                >

                    <Text style={styles.titulo}>
                        {item.nombre}
                    </Text>

                    <Text style={styles.info}>
                        {totalSecciones} secciones
                    </Text>

                    <Text style={styles.info}>
                        {totalCampos} campos
                    </Text>

                </TouchableOpacity>

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
        fontSize: 18,
        marginBottom: 5
    },

    info: {
        fontSize: 14,
        color: "#555"
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