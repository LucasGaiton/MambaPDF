import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    Alert,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from "react-native";

import { useState, useEffect } from "react";
import { guardarPlantilla } from "../storage/storage";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

export default function TemplateCreator({ navigation, route }) {
    const plantillaEditar = route?.params?.plantilla;

    useEffect(() => {

        navigation.setOptions({
            title: plantillaEditar
                ? "Editar Plantilla"
                : "Crear Plantilla"
        });

    }, [navigation, plantillaEditar]);



    // ======================================
    // ESTADOS DE LA PLANTILLA
    // ======================================

    // Nombre de la plantilla
    const [nombre, setNombre] = useState(
        plantillaEditar?.nombre || ""
    );
    // Secciones que componen la plantilla
    const [secciones, setSecciones] = useState(
        plantillaEditar?.secciones || []
    );

    // Nombre de la nueva sección
    const [nombreSeccion, setNombreSeccion] = useState("");

    // Sección actualmente seleccionada para agregar campos
    const [seccionActiva, setSeccionActiva] = useState(
        plantillaEditar?.secciones?.length
            ? plantillaEditar.secciones[0].id
            : null
    );

    // Nombre del nuevo campo
    const [nuevoCampo, setNuevoCampo] = useState("");

    // Tipo del nuevo campo
    const [tipoCampo, setTipoCampo] = useState("texto");

    // Estados utilizados cuando el campo es de tipo "opciones"
    const [opcionNueva, setOpcionNueva] = useState("");
    const [opcionesPersonalizadas, setOpcionesPersonalizadas] = useState([]);


    // ======================================
    // GESTIÓN DE SECCIONES
    // ======================================

    /**
     * Agrega una nueva sección a la plantilla.
     * Valida que el nombre no esté vacío
     * y que no exista otra sección con el mismo id.
     */
    const agregarSeccion = () => {

        if (!nombreSeccion.trim()) {
            return Alert.alert("Error", "Debe escribir un nombre para la sección");
        }

        if (nombreSeccion.trim().length > 25) {
            return Alert.alert(
                "Error",
                "El nombre de la sección no puede superar los 25 caracteres."
            );
        }

        const id = nombreSeccion.trim().toLowerCase().replace(/\s+/g, "_");

        if (secciones.some(s => s.id === id)) {
            return Alert.alert("Error", "Ya existe una sección con ese nombre");
        }

        const nuevaSeccion = {
            id,
            titulo: nombreSeccion.trim(),
            campos: []
        };

        setSecciones([...secciones, nuevaSeccion]);
        setSeccionActiva(id);
        setNombreSeccion("");

    };

    /**
  * Elimina una sección completa junto con todos sus campos.
  * Si la sección eliminada era la activa,
  * selecciona automáticamente otra o deja ninguna.
  */
    const eliminarSeccion = (idSeccion) => {

        const nuevasSecciones = secciones.filter(
            seccion => seccion.id !== idSeccion
        );

        setSecciones(nuevasSecciones);

        if (seccionActiva === idSeccion) {
            setSeccionActiva(
                nuevasSecciones.length > 0
                    ? nuevasSecciones[0].id
                    : null
            );
        }

    };

    // ======================================
    // GESTIÓN DE OPCIONES
    // ======================================

    /**
     * Agrega una opción a un campo de tipo selección.
     */
    const agregarOpcion = () => {

        if (!opcionNueva.trim()) {
            return Alert.alert("Error", "La opción no puede estar vacía.");
        }

        setOpcionesPersonalizadas([...opcionesPersonalizadas, opcionNueva.trim()]);
        setOpcionNueva("");

    };

    // ======================================
    // GESTIÓN DE CAMPOS
    // ======================================

    /**
     * Agrega un nuevo campo a la sección activa.
     * Valida nombre, sección seleccionada y
     * cantidad mínima de opciones cuando corresponde.
     */
    const agregarCampo = () => {

        if (!seccionActiva) {
            return Alert.alert("Error", "Debe seleccionar una sección");
        }

        if (!nuevoCampo.trim()) {
            return Alert.alert("Error", "Debe escribir un nombre de campo");
        }

        if (nuevoCampo.trim().length > 25) {
            return Alert.alert(
                "Error",
                "El nombre del campo no puede superar los 25 caracteres."
            );
        }

        const idGenerado = nuevoCampo.trim().toLowerCase().replace(/\s+/g, "_");

        if (tipoCampo === "opciones" && opcionesPersonalizadas.length < 2) {
            return Alert.alert("Error", "Debe agregar al menos dos opciones");
        }


        const campoAAgregar = {
            id: idGenerado,
            etiqueta: nuevoCampo.trim(),
            tipo: tipoCampo
        };

        if (tipoCampo === "opciones") {
            campoAAgregar.opciones = opcionesPersonalizadas;
        }

        const nuevasSecciones = secciones.map(seccion => {

            if (seccion.id === seccionActiva) {
                return {
                    ...seccion,
                    campos: [...seccion.campos, campoAAgregar]
                };
            }

            return seccion;

        });

        setSecciones(nuevasSecciones);

        setNuevoCampo("");
        setTipoCampo("texto");
        setOpcionesPersonalizadas([]);
        setOpcionNueva("");

    };

    /**
       * Elimina un campo de una sección determinada.
       */
    const eliminarCampo = (idSeccion, idCampo) => {

        const nuevasSecciones = secciones.map(seccion => {

            if (seccion.id !== idSeccion) {
                return seccion;
            }

            return {
                ...seccion,
                campos: seccion.campos.filter(
                    campo => campo.id !== idCampo
                )
            };

        });

        setSecciones(nuevasSecciones);

    };

    // ======================================
    // GUARDADO DE LA PLANTILLA
    // ======================================

    /**
     * Construye el objeto plantilla,
     * lo almacena en AsyncStorage
     * y vuelve a la pantalla principal.
     */
    const guardar = async () => {

        if (!nombre.trim()) {
            return Alert.alert("Error", "Debe poner un nombre a la plantilla");
        }

        if (secciones.length === 0) {
            return Alert.alert("Error", "Debe agregar al menos una sección");
        }

        const plantilla = {
            id: plantillaEditar
                ? plantillaEditar.id
                : Date.now().toString(),

            nombre: nombre.trim(),
            secciones
        };

        await guardarPlantilla(plantilla.id, plantilla);

        setNombre("");
        setSecciones([]);

        Alert.alert(
            "Éxito",
            plantillaEditar
                ? "Plantilla actualizada"
                : "Plantilla guardada"
        );
        navigation.navigate("Home")

    };

    return (

        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >

                <TextInput
                    placeholder="Nombre de la plantilla"
                    placeholderTextColor="#8C8C8C"
                    value={nombre}
                    onChangeText={setNombre}
                    style={styles.input}
                />

                {/* <Text style={styles.subtitulo}>Nueva Sección</Text> */}

                <TextInput
                    placeholder="Nombre de la sección"
                    placeholderTextColor="#8C8C8C"
                    value={nombreSeccion}
                    onChangeText={setNombreSeccion}
                    style={styles.input}
                />

                <TouchableOpacity
                    style={styles.boton}
                    onPress={agregarSeccion}
                >
                    <Text style={styles.botonTexto}>Agregar Sección</Text>
                </TouchableOpacity>

                {secciones.length > 0 && (

                    <>
                        <Text style={styles.subtitulo}>Agregar campos a:</Text>

                        <View style={styles.pickerContainer}>

                            <Picker
                                style={styles.picker}
                                selectedValue={seccionActiva}
                                onValueChange={(value) => setSeccionActiva(value)}
                            >

                                {secciones.map(s => (
                                    <Picker.Item
                                        key={s.id}
                                        label={s.titulo}
                                        value={s.id}
                                    />
                                ))}

                            </Picker>

                        </View>

                    </>

                )}

                {/* <Text style={styles.subtitulo}>Nuevo Campo</Text> */}
                <Text style={styles.subtitulo}>Tipo de campo:</Text>

                <View style={styles.pickerContainer}>

                    <Picker
                        outlineStyle="none"
                        style={styles.picker}
                        selectedValue={tipoCampo}
                        onValueChange={(value) => setTipoCampo(value)}
                    >

                        <Picker.Item label="Texto" value="texto" />
                        <Picker.Item label="Fecha" value="fecha" />
                        <Picker.Item label="Sí / No" value="boolean" />
                        <Picker.Item label="Selección de Opciones" value="opciones" />

                    </Picker>

                </View>

                <TextInput
                    placeholder="Nombre del campo"
                    placeholderTextColor="#8C8C8C"
                    value={nuevoCampo}
                    onChangeText={setNuevoCampo}
                    style={styles.input}
                />



                {tipoCampo === "opciones" && (

                    <View style={styles.opcionesContainer}>

                        <Text style={styles.subtitulo}>
                            Opciones para "{nuevoCampo || "campo"}"
                        </Text>

                        <TextInput
                            placeholder="Escriba una opción"
                            placeholderTextColor="#8C8C8C"
                            value={opcionNueva}
                            onChangeText={setOpcionNueva}
                            style={styles.input}
                        />

                        <TouchableOpacity
                            style={styles.botonSecundario}
                            onPress={agregarOpcion}
                        >
                            <Text style={styles.botonTexto}>Agregar Opción</Text>
                        </TouchableOpacity>

                        {opcionesPersonalizadas.map((op, index) => (
                            <Text key={index} style={styles.opcionItem}>
                                - {op}
                            </Text>
                        ))}

                    </View>

                )}

                <TouchableOpacity
                    style={styles.boton}
                    onPress={agregarCampo}
                >
                    <Text style={styles.botonTexto}>Agregar Campo</Text>
                </TouchableOpacity>

                {secciones.map(seccion => (

                    <View key={seccion.id} style={styles.seccionContainer}>

                        <View style={styles.headerSeccion}>

                            <Text style={styles.seccionTitulo}>
                                {seccion.titulo}
                            </Text>

                            <TouchableOpacity
                                onPress={() => eliminarSeccion(seccion.id)}
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={22}
                                    color="#C0392B"
                                />
                            </TouchableOpacity>

                        </View>

                        {seccion.campos.map(campo => (

                            <View key={campo.id} style={styles.campoContainer}>

                                <View style={styles.headerCampo}>

                                    <Text style={styles.campo}>
                                        • {campo.etiqueta} ({campo.tipo === "boolean" ? "Si/No" : campo.tipo})
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() => eliminarCampo(seccion.id, campo.id)}
                                    >
                                        <Ionicons
                                            name="close-circle"
                                            size={22}
                                            color="#C0392B"
                                        />
                                    </TouchableOpacity>

                                </View>

                                {campo.tipo === "opciones" && (

                                    <View style={styles.opcionesLista}>

                                        {campo.opciones.map((op, i) => (
                                            <Text key={i} style={styles.opcionItem}>
                                                - {op}
                                            </Text>
                                        ))}

                                    </View>

                                )}
                            </View>

                        ))}

                    </View>

                ))}

                <TouchableOpacity
                    style={styles.boton}
                    onPress={guardar}
                >
                    <Text style={styles.botonTexto}>
                        {plantillaEditar
                            ? "Guardar cambios"
                            : "Guardar plantilla"}
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>

    );

}

const styles = StyleSheet.create({

    scrollContainer: {
        backgroundColor: "#33302D",
        minWidth: 100,
        minHeight: "100%",
        padding: 20,
        backgroundColor: "#F6F3EF",
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#8B6734",
        marginBottom: 20,
        textAlign: "center"
    },

    input: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        backgroundColor: "white",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 15,
        outlineStyle: "none",// web
    },

    pickerContainer: {
        minHeight: 56,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 8,
        justifyContent: "center",
        outlineStyle: "none"
    },
    picker: {
        minHeight: 56,
        color: "#333",
        outlineStyle: "none" // web

    },

    subtitulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#8B6734",
        marginTop: 10,
        marginBottom: 10
    },

    boton: {
        backgroundColor: "#E1890A",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 12,
        elevation: 3
    },

    botonSecundario: {
        backgroundColor: "#B67A26",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10
    },

    botonTexto: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15
    },

    seccionContainer: {
        backgroundColor: "#FFFFFF",
        padding: 15,
        marginTop: 15,
        marginBottom: 13,
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: "#E1890A",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },

    seccionTitulo: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#B67A26",
        marginBottom: 8
    },

    campoContainer: {
        marginLeft: 10,
        marginBottom: 6
    },

    campo: {
        fontWeight: "600",
        color: "#333"
    },

    opcionesContainer: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        backgroundColor: "#FFF9F2",
        padding: 12,
        marginBottom: 15,
        borderRadius: 8
    },

    opcionesLista: {
        marginLeft: 15
    },

    opcionItem: {
        fontStyle: "italic",
        color: "#555"
    },
    headerSeccion: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
    },

    headerCampo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    botonEliminar: {
        color: "#C0392B",
        fontSize: 22,
        fontWeight: "bold",
        paddingHorizontal: 4
    },

    botonEliminarCampo: {
        color: "#C0392B",
        fontSize: 18,
        fontWeight: "bold",
        paddingHorizontal: 4
    },

});