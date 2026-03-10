import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
    Alert,
    ScrollView
} from "react-native";

import { useState } from "react";
import { guardarPlantilla } from "../storage/storage";
import { Picker } from "@react-native-picker/picker";

export default function TemplateCreator() {

    // estados plantilla
    const [nombre, setNombre] = useState("");

    // secciones
    const [secciones, setSecciones] = useState([]);
    const [nombreSeccion, setNombreSeccion] = useState("");
    const [seccionActiva, setSeccionActiva] = useState(null);

    // campos
    const [nuevoCampo, setNuevoCampo] = useState("");
    const [tipoCampo, setTipoCampo] = useState("texto");

    // opciones
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

            {/* CREAR SECCION */}

            <Text style={styles.subtitulo}>Nueva Sección</Text>

            <TextInput
                placeholder="Nombre de la sección"
                value={nombreSeccion}
                onChangeText={setNombreSeccion}
                style={styles.input}
            />

            <Button
                title="Agregar Sección"
                onPress={agregarSeccion}
            />

            {/* SELECTOR SECCION */}

            {secciones.length > 0 && (

                <>
                    <Text style={styles.subtitulo}>Sección activa</Text>

                    <View style={styles.pickerContainer}>

                        <Picker
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

            {/* CREAR CAMPO */}

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

                    <Button
                        title="Agregar Opción"
                        onPress={agregarOpcion}
                    />

                    {opcionesPersonalizadas.map((op, index) => (
                        <Text key={index} style={styles.opcionItem}>
                            - {op}
                        </Text>
                    ))}

                </View>

            )}

            <Button
                title="Agregar Campo"
                onPress={agregarCampo}
            />

            {/* LISTA DE SECCIONES */}

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

            <Button
                title="Guardar plantilla"
                onPress={guardar}
            />

        </ScrollView>

    );

}

const styles = StyleSheet.create({

    scrollContainer: {
        padding: 20
    },

    title: {
        fontSize: 22,
        marginBottom: 20
    },

    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10
    },

    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 10
    },

    subtitulo: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 10
    },

    seccionContainer: {
        backgroundColor: "#f5f5f5",
        padding: 10,
        marginTop: 15,
        borderRadius: 6
    },

    seccionTitulo: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5
    },

    campoContainer: {
        marginLeft: 10,
        marginBottom: 5
    },

    campo: {
        fontWeight: "bold"
    },

    opcionesContainer: {
        borderWidth: 1,
        borderColor: "#e0e0e0",
        backgroundColor: "#f9f9f9",
        padding: 10,
        marginBottom: 15,
        borderRadius: 5
    },

    opcionesLista: {
        marginLeft: 15
    },

    opcionItem: {
        fontStyle: "italic",
        color: "#555"
    }

});