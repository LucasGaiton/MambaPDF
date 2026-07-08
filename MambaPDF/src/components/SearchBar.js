import { React, useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Text
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

export default function SearchBar({

    textoBusqueda,
    setTextoBusqueda,

    plantillaSeleccionada,
    setPlantillaSeleccionada,

    plantillas

}) {

    const [modalVisible, setModalVisible] = useState(false);

    const mostrarFiltros = () => (

        <View style={styles.pickerContainer}>

            <Picker
                selectedValue={plantillaSeleccionada}
                onValueChange={setPlantillaSeleccionada}
            >

                <Picker.Item
                    label="Todas las plantillas"
                    value=""
                />

                {plantillas.map((p) => (

                    <Picker.Item
                        key={p.id}
                        label={p.nombre}
                        value={p.id}
                    />

                ))}

            </Picker>

        </View>


    )




    return (

        <View style={styles.container}>

            <TextInput
                style={styles.input}
                placeholder="Buscar por nombre..."
                value={textoBusqueda}
                onChangeText={setTextoBusqueda}
            />

            <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons
                    name="options-outline"
                    size={22}
                    color="white"
                />
            </TouchableOpacity>

            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >

                <View style={styles.modalOverlay}>

                    <View style={styles.modal}>

                        <Text style={styles.modalTitulo}>
                            Filtrar órdenes
                        </Text>

                        <Text style={styles.modalSubtitulo}>
                            Tipo de plantilla
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.opcion,
                                plantillaSeleccionada === "" && styles.opcionSeleccionada
                            ]}
                            onPress={() => {
                                setPlantillaSeleccionada("");
                                setModalVisible(false);
                            }}
                        >
                            <Text>Todas las plantillas</Text>
                        </TouchableOpacity>

                        {plantillas.map((p) => (

                            <TouchableOpacity
                                key={p.id}
                                style={[
                                    styles.opcion,
                                    plantillaSeleccionada === p.id &&
                                    styles.opcionSeleccionada
                                ]}
                                onPress={() => {

                                    setPlantillaSeleccionada(p.id);
                                    setModalVisible(false);

                                }}
                            >

                                <Text>{p.nombre}</Text>

                            </TouchableOpacity>

                        ))}

                    </View>

                </View>

            </Modal>


        </View>







    );
}



const styles = StyleSheet.create({

    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 20

    },

    input: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: "#FFFFFF",
        padding: 12,
        marginBottom: 12,
        fontSize: 15,
        height: "100%",
        width: "80%"
    },

    pickerContainer: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        overflow: "hidden"
    },
    filterButton: {
        width: "20%",
        backgroundColor: "#E1890A",
        justifyContent: "center",
        alignItems: "center",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center"
    },

    modal: {
        width: "85%",
        backgroundColor: "#FFF",
        borderRadius: 12,
        padding: 20,
        elevation: 8
    },

    modalTitulo: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#8B6734",
        marginBottom: 20,
        textAlign: "center"
    },

    modalSubtitulo: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
        color: "#444"
    },

    opcion: {
        paddingVertical: 14,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: "#F6F3EF"
    },

    opcionSeleccionada: {
        backgroundColor: "#F4C27A"
    },
});