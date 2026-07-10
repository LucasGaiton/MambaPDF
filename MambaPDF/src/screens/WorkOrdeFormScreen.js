/**
 * =============================================================================
 * WorkOrderFormScreen
 * =============================================================================
 * Pantalla encargada de la creación y edición de órdenes de trabajo.
 *
 * Funcionalidades principales:
 *  - Generar una nueva orden a partir de una plantilla.
 *  - Editar una orden existente.
 *  - Validar el nombre de la orden.
 *  - Gestionar distintos tipos de campos dinámicos.
 *  - Guardar la orden en el almacenamiento local.
 * =============================================================================
 */

import { useState, useEffect } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    View,
    StyleSheet,
    Button,
    Switch,
    TouchableOpacity,
    Alert
} from "react-native";

import { guardarOrden } from "../storage/storage";
import { Picker } from "@react-native-picker/picker";
import { DatePickerModal } from "react-native-paper-dates";
import { Ionicons } from "@expo/vector-icons";

export default function WorkOrderFormScreen({ route, navigation }) {

    /**
     * Datos recibidos desde la navegación.
     *
     * plantilla → estructura utilizada para generar la orden.
     * orden → solo existe cuando se está editando una orden.
     */
    const { plantilla, orden } = route.params;
    /**
    * Indica si la pantalla está en modo edición.
    */
    const editando = !!orden

    /**
     * Cambia dinámicamente el título de la pantalla dependiendo
     * del caso de uso (crear o editar).
     */
    useEffect(() => {

        navigation.setOptions({
            title: orden
                ? "Editar Orden"
                : "Crear Orden"
        });

    }, [navigation, orden]);

    /**
     * Genera el estado inicial de todos los campos de la plantilla.
     *
     * Cada tipo de campo posee un valor por defecto:
     *  - boolean → false
     *  - opciones → primera opción disponible
     *  - resto → cadena vacía
     */
    const getInitialState = () => {

        const initialState = {};

        plantilla.secciones.forEach(seccion => {

            seccion.campos.forEach(campo => {

                if (campo.tipo === "boolean") {
                    initialState[campo.id] = false;
                }

                else if (campo.tipo === "opciones" && campo.opciones?.length > 0) {
                    initialState[campo.id] = campo.opciones[0];
                }

                else {
                    initialState[campo.id] = "";
                }

            });

        });

        return initialState;

    };
    //==========================================================================
    //                           Estados
    //==========================================================================

    /**
     * Valores de todos los campos dinámicos.
     *
     * Si se está editando una orden se cargan los datos existentes,
     * de lo contrario se inicializan con los valores por defecto.
     */
    const [valores, setValores] = useState(
        orden ? orden.valores : getInitialState()
    );

    /**
     * Nombre identificador de la orden.
     */
    const [nombreOrden, setNombreOrden] = useState(
        orden ? orden.nombre : ""
    );

    /**
     * Estados utilizados por el selector de fechas.
     */
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [currentDateField, setCurrentDateField] = useState(null);
    const [selectedDate, setSelectedDate] = useState(undefined);

    /**
     * Actualiza el valor de un campo dinámico.
     */
    const actualizarValor = (campoId, valor) => {

        setValores(prev => ({
            ...prev,
            [campoId]: valor
        }));

    };

    /**
     * Guarda una nueva orden o actualiza una existente.
     *
     * Validaciones:
     *  - El nombre de la orden es obligatorio.
     *
     * Si se encuentra en modo edición:
     *  - Conserva el ID.
     *  - Conserva la fecha de creación.
     *
     * Caso contrario:
     *  - Genera un nuevo ID.
     *  - Asigna la fecha actual.
     */
    const guardarOrdenHandler = async () => {

        if (!nombreOrden.trim()) {
            Alert.alert(
                "Error",
                "Debe ingresar un nombre para la orden."
            );
            return;
        }

        const nuevaOrden = {

            id: editando
                ? orden.id
                : Date.now().toString(),
            nombre: nombreOrden.trim(),
            plantillaId: plantilla.id,
            plantillaNombre: plantilla.nombre,
            fechaCreacion: editando
                ? orden.fechaCreacion
                : new Date().toISOString(),
            valores: valores

        };


        await guardarOrden(nuevaOrden.id, nuevaOrden);

        console.log(editando ? "Orden editada:" : "Orden guardada:", nuevaOrden);

        Alert.alert(
            "Éxito",
            orden
                ? "Orden actualizada"
                : "Orden guardada"
        );
        navigation.navigate("Home")

    };

     /**
     * Abre el selector de fecha para un campo específico.
     */
    const abrirDatePicker = (campoId) => {
        setCurrentDateField(campoId);
        setOpenDatePicker(true);
    };

    /**
     * Se ejecuta cuando el usuario selecciona una fecha.
     *
     * Guarda la fecha en el campo correspondiente.
     */
    const onConfirmDate = ({ date }) => {

        setOpenDatePicker(false);
        setSelectedDate(date);

        if (date && currentDateField) {

            actualizarValor(
                currentDateField,
                date.toLocaleDateString("es-ES")
            );

        }

    };

    /**
     * Renderiza dinámicamente un campo según su tipo.
     *
     * Tipos soportados:
     *  - texto
     *  - boolean
     *  - fecha
     *  - opciones
     */
    const renderCampo = (campo) => {

        switch (campo.tipo) {

            case "texto":

                return (
                    <TextInput
                        style={styles.input}
                        placeholder={`Ingrese ${campo.etiqueta}`}
                        value={valores[campo.id]}
                        onChangeText={(texto) =>
                            actualizarValor(campo.id, texto)
                        }
                    />
                );

            case "boolean":

                return (
                    <View style={styles.switchContainer}>
                        <Switch
                            value={valores[campo.id]}
                            onValueChange={(valor) =>
                                actualizarValor(campo.id, valor)
                            }
                        />
                    </View>
                );

            case "fecha":

                return (
                    <>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => abrirDatePicker(campo.id)}
                        >
                            <Text
                                style={
                                    valores[campo.id]
                                        ? styles.dateText
                                        : styles.datePlaceholder
                                }
                            >
                                {valores[campo.id] || "Seleccionar fecha"}
                            </Text>
                        </TouchableOpacity>

                        <DatePickerModal
                            locale="es"
                            mode="single"
                            visible={openDatePicker}
                            date={selectedDate}
                            onDismiss={() => setOpenDatePicker(false)}
                            onConfirm={onConfirmDate}
                        />
                    </>
                );

            case "opciones":

                return (
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={valores[campo.id]}
                            onValueChange={(itemValue) =>
                                actualizarValor(campo.id, itemValue)
                            }
                        >

                            {campo.opciones?.map((opcion, index) => (
                                <Picker.Item
                                    key={index}
                                    label={opcion}
                                    value={opcion}
                                />
                            ))}

                        </Picker>
                    </View>
                );

            default:
                return null;

        }

    };

    return (

        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.title}>
                {plantilla.nombre}
            </Text>

            {!editando && (
                <TouchableOpacity
                    style={styles.botonEditar}
                    onPress={() =>
                        navigation.navigate("Crear Plantilla", {
                            plantilla,
                        })
                    }
                >
                    <Ionicons
                        name="create-outline"
                        size={18}
                        color="#8B6734"
                    />

                    <Text style={styles.botonEditarTexto}>
                        Editar plantilla
                    </Text>
                </TouchableOpacity>
            )}

            <View style={styles.inputContainer}>

                <Text style={styles.label}>
                    Nombre de la orden
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ej: Instalación Router - Cliente Pérez"
                    value={nombreOrden}
                    onChangeText={setNombreOrden}
                />

            </View>

            {plantilla.secciones.map((seccion) => (

                <View key={seccion.id} style={styles.seccionContainer}>

                    <Text style={styles.seccionTitulo}>
                        {seccion.titulo}
                    </Text>

                    {seccion.campos.map((campo) => (

                        <View key={campo.id} style={styles.inputContainer}>

                            <Text style={styles.label}>
                                {campo.etiqueta}
                            </Text>

                            {renderCampo(campo)}

                        </View>

                    ))}

                </View>

            ))}
            <TouchableOpacity
                style={styles.boton}
                onPress={guardarOrdenHandler}
            >
                <Text style={styles.botonTexto}>
                    {editando ? "Guardar Cambios" : "Guardar Orden"}
                </Text>
            </TouchableOpacity>

        </ScrollView>

    );

}

const styles = StyleSheet.create({

    container: {
        minHeight: "100%",
        padding: 20,
        backgroundColor: "#F6F3EF"
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#8B6734",
        marginBottom: 25,
        textAlign: "center"
    },

    seccionContainer: {
        marginBottom: 25,
        backgroundColor: "#FFFFFF",
        padding: 18,
        borderRadius: 10,
        borderLeftWidth: 6,
        borderLeftColor: "#E1890A",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3
    },

    seccionTitulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#B67A26",
        marginBottom: 12
    },

    inputContainer: {
        marginBottom: 15
    },

    label: {
        marginBottom: 6,
        fontWeight: "600",
        fontSize: 15,
        color: "#333"
    },

    input: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        backgroundColor: "#FFFFFF",
        justifyContent: "center"
    },

    switchContainer: {
        flexDirection: "row",
        alignItems: "center"
    },

    pickerContainer: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        backgroundColor: "#FFFFFF"
    },

    dateText: {
        fontSize: 15,
        color: "#333"
    },

    datePlaceholder: {
        fontSize: 15,
        color: "#999"
    },
    boton: {
        backgroundColor: "#E1890A",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 12,
        elevation: 3
    },
    botonEditar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#FFF8ED",
        borderWidth: 1,
        borderColor: "#E8C68B",

        paddingVertical: 12,
        borderRadius: 8,

        marginBottom: 25,
    },

    botonEditarTexto: {
        marginLeft: 8,
        fontSize: 15,
        fontWeight: "600",
        color: "#8B6734",
    },

});