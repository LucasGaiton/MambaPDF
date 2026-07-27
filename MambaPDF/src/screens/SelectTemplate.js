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
import { Ionicons } from "@expo/vector-icons";

export default function SelectTemplate({ navigation }) {

    const [plantillas, setPlantillas] = useState([]);

    useEffect(() => {
        cargarPlantillas();
    }, []);

    const cargarPlantillas = async () => {

        const data = await listarPlantillas();
        setPlantillas(data || []);
        console.log(data);


    };

    const seleccionarPlantilla = (plantilla) => {
        navigation.navigate("Crear Orden", { plantilla });
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
                    <View style={styles.contTitulo}>

                        <Text style={styles.titulo}>
                            {item.nombre}
                        </Text>
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
                ListEmptyComponent={<Text style={styles.mensajeNoEncontrado}>No hay plantillas guardadas</Text>}
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
    contTitulo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

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