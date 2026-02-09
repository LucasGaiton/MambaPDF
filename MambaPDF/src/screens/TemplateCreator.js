import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native"
import { useState, useEffect } from "react"
import { guardarPlantilla } from "../storage/storage"

export default function TemplateCreator() {


    //Estados
    const [campos, setCampos] = useState([]);
    const [nombre, setNombre] = useState("");
    const [nuevoCampo, setNuevoCampo] = useState("")


    const agregarCampo = () => {
        if (!nuevoCampo) return alert("No se escribio ningun campo nuevo")
        
        console.log(nuevoCampo);
            
        setCampos([...campos, {
            id: nuevoCampo.toLowerCase(),
            etiqueta: nuevoCampo,
            tipo: 'texto'
        }])
        setNuevoCampo("");
    }

    const guardar = async () => {
        if (!nombre || campos.length == 0) return alert("Debe ponerle un nombre a la plantilla y agregar un campo")
        const plantilla = {
            id: Date.now.toString(),
            nombre, campos

        }
        await guardarPlantilla(plantilla.id, plantilla)
        setNombre("")
        setCampos([])
        alert("plantilla guardada")
    }


    return (
        <View style={styles.container}>
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

            <Button title="Agregar campo" onPress={agregarCampo} />
            {campos.length != 0 ? <Text>Campos agregados</Text> : <></>} 
            <FlatList style={styles.lista}
                data={campos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Text style={styles.campo}>• {item.etiqueta}</Text>
                )}
            />

            <Button title="Guardar plantilla" onPress={guardar} />
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        padding: 5
    },
    lista:{

    }
});