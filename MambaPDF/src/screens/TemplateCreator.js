import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, ScrollView } from "react-native"
import { useState, useEffect } from "react"
import { guardarPlantilla } from "../storage/storage"
import { Picker } from "@react-native-picker/picker"

export default function TemplateCreator() {


    //Estados
    const [campos, setCampos] = useState([]);
    const [nombre, setNombre] = useState("");
    const [nuevoCampo, setNuevoCampo] = useState("")
    const [tipoCampo, setTipoCampo] = useState("texto")
    const [opcionNueva, setOpcionNueva] = useState("");
    const [opcionesPersonalizadas, setOpcionesPersonalizadas] = useState([]);


    const agregarOpcion = () => {
        if (!opcionNueva.trim()) {
            return Alert.alert("Error", "La opción no puede estar vacía.");
        }
        setOpcionesPersonalizadas([...opcionesPersonalizadas, opcionNueva.trim()]);
        setOpcionNueva("");
    };


    const agregarCampo = () => {
        if (!nuevoCampo.trim()) return Alert.alert("Error", "No se escribió ningún campo nuevo")

        const idGenerado = nuevoCampo.trim().toLowerCase().replace(/\s+/g, '_');

        if (campos.some(c => c.id === idGenerado)) {
            return Alert.alert("Error", "Ya existe un campo con este nombre");
        }

        if (tipoCampo === 'opciones' && opcionesPersonalizadas.length < 2) {
            return Alert.alert("Error", "Debe agregar al menos dos opciones para un campo de selección.");
        }

        const campoAAgregar = {
            id: idGenerado,
            etiqueta: nuevoCampo.trim(),
            tipo: tipoCampo
        };

        if (tipoCampo === 'opciones') {
            campoAAgregar.opciones = opcionesPersonalizadas;
        }

        setCampos([...campos, campoAAgregar]);

        setNuevoCampo("");
        setOpcionesPersonalizadas([]);
        setOpcionNueva("");
        setTipoCampo("texto");
    }

    const guardar = async () => {
        if (!nombre.trim() || campos.length === 0) return Alert.alert("Error", "Debe ponerle un nombre a la plantilla y agregar al menos un campo")
        const plantilla = {
            id: Date.now().toString(),
            nombre: nombre.trim(),
            campos

        }
        await guardarPlantilla(plantilla.id, plantilla)
        setNombre("")
        setCampos([])
        Alert.alert("Éxito", "Plantilla guardada")
    }


    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>Crear Plantilla</Text>

            <TextInput
                placeholder="Nombre de la plantilla"
                value={nombre}
                onChangeText={setNombre}
                style={styles.input}
            />

            <TextInput
                placeholder="Nombre del campo (ej: Cliente)"
                value={nuevoCampo}
                onChangeText={setNuevoCampo}
                style={styles.input}
            />

            <Text>Tipo de campo:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={tipoCampo}
                    onValueChange={(itemValue) => setTipoCampo(itemValue)}
                >
                    <Picker.Item label="Texto" value="texto" />
                    <Picker.Item label="Fecha" value="fecha" />
                    <Picker.Item label="Sí / No" value="boolean" />
                    <Picker.Item label="Selección de Opciones" value="opciones" />
                </Picker>
            </View>

            {tipoCampo === 'opciones' && (
                <View style={styles.opcionesContainer}>
                    <Text style={styles.subtitulo}>Opciones para "{nuevoCampo || 'campo actual'}"</Text>
                    <TextInput
                        placeholder="Escriba una opción"
                        value={opcionNueva}
                        onChangeText={setOpcionNueva}
                        style={styles.input}
                    />
                    <Button title="Agregar Opción" onPress={agregarOpcion} />
                    {opcionesPersonalizadas.map((op, index) => (
                        <Text key={index} style={styles.opcionItem}>- {op}</Text>
                    ))}
                </View>
            )}

            <Button title="Agregar campo" onPress={agregarCampo} />
            {campos.length != 0 ? <Text>Campos agregados</Text> : <></>}




            <FlatList style={styles.lista}
                data={campos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.campoContainer}>
                        <Text style={styles.campo}>
                            • {item.etiqueta} ({item.tipo})
                        </Text>
                        {item.tipo === 'opciones' && (
                            <View style={styles.opcionesLista}>
                                {item.opciones.map((op, index) => (
                                    <Text key={index} style={styles.opcionItem}> - {op}</Text>
                                ))}
                            </View>
                        )}
                    </View>
                )}
            />


            <Button title="Guardar plantilla" onPress={guardar} />
        </ScrollView>
    )

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
    campo: {
        padding: 5,
        fontWeight: 'bold'
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10
    },
    lista: {
        marginBottom: 15,
    },
    opcionesContainer: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#f9f9f9',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5
    },
    subtitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    campoContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    opcionesLista: {
        marginLeft: 15,
        marginTop: 5,
    },
    opcionItem: {
        fontStyle: 'italic',
        color: '#555'
    },
});