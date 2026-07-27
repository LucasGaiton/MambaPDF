/**
 * -----------------------------------------------------------------------------
 * SearchBar.jsx
 * -----------------------------------------------------------------------------
 * Componente reutilizable que permite buscar y filtrar órdenes de trabajo.
 *
 * Funcionalidades:
 * - Buscar órdenes por nombre.
 * - Filtrar órdenes según la plantilla utilizada.
 * - Mostrar un modal con las opciones de filtrado disponibles.
 *
 * El componente no almacena el estado de búsqueda ni de la plantilla
 * seleccionada, sino que recibe dichos valores y sus funciones
 * actualizadoras desde el componente padre.
 * -----------------------------------------------------------------------------
 */

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

/**
 * -----------------------------------------------------------------------------
 * SearchBar
 * -----------------------------------------------------------------------------
 * Barra de búsqueda con filtro por plantilla.
 *
 * @param {Object} props Propiedades del componente.
 * @param {string} props.textoBusqueda Texto ingresado por el usuario.
 * @param {Function} props.setTextoBusqueda Función que actualiza el texto de búsqueda.
 * @param {string} props.plantillaSeleccionada Identificador de la plantilla filtrada.
 * @param {Function} props.setPlantillaSeleccionada Función que actualiza la plantilla seleccionada.
 * @param {Array<Object>} props.plantillas Listado de plantillas disponibles.
 *
 * @returns {JSX.Element}
 * -----------------------------------------------------------------------------
 */
export default function SearchBar({

    textoBusqueda,
    setTextoBusqueda,

    plantillaSeleccionada,
    setPlantillaSeleccionada,

    plantillas

}) {

    /**
     * -------------------------------------------------------------------------
     * Estado del modal de filtros.
     * -------------------------------------------------------------------------
     * true  -> El modal se encuentra visible.
     * false -> El modal permanece oculto.
     * -------------------------------------------------------------------------
     */
    const [modalVisible, setModalVisible] = useState(false);

    /**
     * -------------------------------------------------------------------------
     * Renderiza un selector (Picker) con las plantillas disponibles.
     *
     * Actualmente no se utiliza dentro del JSX principal, ya que el filtrado
     * se realiza mediante un Modal con botones seleccionables.
     *
     * Puede reutilizarse en futuras versiones para plataformas donde el Picker
     * resulte más conveniente.
     *
     * @returns {JSX.Element}
     * -------------------------------------------------------------------------
     */
    const mostrarFiltros = () => (

        <View style={styles.pickerContainer}>

            <Picker
                selectedValue={plantillaSeleccionada}
                onValueChange={setPlantillaSeleccionada}
            >

                {/* Opción para eliminar el filtro */}
                <Picker.Item
                    label="Todas las plantillas"
                    value=""
                />

                {/* Plantillas registradas */}
                {plantillas.map((p) => (

                    <Picker.Item
                        key={p.id}
                        label={p.nombre}
                        value={p.id}
                    />

                ))}

            </Picker>

        </View>

    );

    return (

        <View style={styles.container}>

            {/*--------------------------------------------------------------
                Campo de búsqueda
            --------------------------------------------------------------*/}
            <TextInput
                style={styles.input}
                placeholder="Buscar por nombre..."
                placeholderTextColor="#8C8C8C"
                value={textoBusqueda}
                onChangeText={setTextoBusqueda}
            />

            {/*--------------------------------------------------------------
                Botón para abrir el modal de filtros
            --------------------------------------------------------------*/}
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

            {/*--------------------------------------------------------------
                Modal de selección de plantilla
            --------------------------------------------------------------*/}
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

                        {/* Mostrar todas las órdenes */}
                        <TouchableOpacity
                            style={[
                                styles.opcion,
                                plantillaSeleccionada === "" &&
                                styles.opcionSeleccionada
                            ]}
                            onPress={() => {
                                setPlantillaSeleccionada("");
                                setModalVisible(false);
                            }}
                        >
                            <Text>Todas las plantillas</Text>
                        </TouchableOpacity>

                        {/* Mostrar cada plantilla registrada */}
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

/**
 * -----------------------------------------------------------------------------
 * Estilos del componente.
 *
 * Contiene la configuración visual de:
 * - Barra de búsqueda.
 * - Botón de filtros.
 * - Modal de selección.
 * - Opciones disponibles.
 * -----------------------------------------------------------------------------
 */
const styles = StyleSheet.create({

    container: {
        width: "100%",
        flexDirection: "row",
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