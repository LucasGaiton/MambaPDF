import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    Alert,
    ScrollView,
    TouchableOpacity
} from "react-native";

import { useState } from "react";
import { guardarPlantilla } from "../storage/storage";
import { Picker } from "@react-native-picker/picker";

export default function TemplateCreator({navigation}) {

    const [nombre, setNombre] = useState("");

    const [secciones, setSecciones] = useState([]);
    const [nombreSeccion, setNombreSeccion] = useState("");
    const [seccionActiva, setSeccionActiva] = useState(null);

    const [nuevoCampo, setNuevoCampo] = useState("");
    const [tipoCampo, setTipoCampo] = useState("texto");

    const [opcionNueva, setOpcionNueva] = useState("");
    const [opcionesPersonalizadas, setOpcionesPersonalizadas] = useState([]);

    const agregarSeccion = () => {

        if (!nombreSeccion.trim()) {
            return Alert.alert("Error", "Debe escribir un nombre para la sección");
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

    const agregarOpcion = () => {

        if (!opcionNueva.trim()) {
            return Alert.alert("Error", "La opción no puede estar vacía.");
        }

        setOpcionesPersonalizadas([...opcionesPersonalizadas, opcionNueva.trim()]);
        setOpcionNueva("");

    };

    const agregarCampo = () => {

        if (!seccionActiva) {
            return Alert.alert("Error", "Debe seleccionar una sección");
        }

        if (!nuevoCampo.trim()) {
            return Alert.alert("Error", "Debe escribir un nombre de campo");
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

    const guardar = async () => {

        if (!nombre.trim()) {
            return Alert.alert("Error", "Debe poner un nombre a la plantilla");
        }

        if (secciones.length === 0) {
            return Alert.alert("Error", "Debe agregar al menos una sección");
        }

        const plantilla = {
            id: Date.now().toString(),
            nombre: nombre.trim(),
            secciones
        };

        await guardarPlantilla(plantilla.id, plantilla);

        setNombre("");
        setSecciones([]);

        Alert.alert("Éxito", "Plantilla guardada");
        navigation.navigate("Home")

    };

    return (

        <ScrollView contentContainerStyle={styles.scrollContainer}>

            <Text style={styles.title}>Crear Plantilla</Text>

            <TextInput
                placeholder="Nombre de la plantilla"
                value={nombre}
                onChangeText={setNombre}
                style={styles.input}
            />

            <Text style={styles.subtitulo}>Nueva Sección</Text>

            <TextInput
                placeholder="Nombre de la sección"
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
                    <Text style={styles.subtitulo}>Sección activa</Text>

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

            <Text style={styles.subtitulo}>Nuevo Campo</Text>

            <TextInput
                placeholder="Nombre del campo"
                value={nuevoCampo}
                onChangeText={setNuevoCampo}
                style={styles.input}
            />

            <Text>Tipo de campo:</Text>

            <View style={styles.pickerContainer}>

                <Picker
                    outlineStyle= "none"
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

            {tipoCampo === "opciones" && (

                <View style={styles.opcionesContainer}>

                    <Text style={styles.subtitulo}>
                        Opciones para "{nuevoCampo || "campo"}"
                    </Text>

                    <TextInput
                        placeholder="Escriba una opción"
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

                    <Text style={styles.seccionTitulo}>
                        {seccion.titulo}
                    </Text>

                    {seccion.campos.map(campo => (

                        <View key={campo.id} style={styles.campoContainer}>

                            <Text style={styles.campo}>
                                • {campo.etiqueta} ({campo.tipo})
                            </Text>

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
                <Text style={styles.botonTexto}>Guardar plantilla</Text>
            </TouchableOpacity>

        </ScrollView>

    );

}

const styles = StyleSheet.create({

    scrollContainer: {
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
        outlineStyle: "none" ,// web
    },

    pickerContainer: {
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
        height: 50,
        color: "#333",
        outlineStyle: "none" // web

    },

    subtitulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#8B6734",
        marginTop: 20,
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
    }

});