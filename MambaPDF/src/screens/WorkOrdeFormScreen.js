import { useState } from "react"
import { ScrollView, Text, TextInput, View, StyleSheet, Button } from "react-native-web"
import { guardarOrden } from "../storage/storage"

export default function WorkOrderFormScreen({ plantilla }) {
    const [valores, setValores] = useState({})

    const actualizarValor = (campoId, valor) => {
        setValores({
            ...valores,
            [campoId]: valor

        })
    }

    const guardarOrdenHandler = async () => {
        const nuevaOrden = {
            id: Date.now().toString(),
            plantillaId: plantilla.nombre,
            fechaCreacion: new Date().toISOString(),
            valores: valores
        };
        await guardarOrden(nuevaOrden.id, nuevaOrden);

        console.log("Orden guardada:", nuevaOrden);
        alert("Orden guardada correctamente ✅");
    }

    // const guardarOrden = async () => {
    //     console.log("Orden generada:", valores);
    //     alert("se guardo la orden, puede revisar la consola si lo desea")
    //     await guardarOrden()
    // }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                {plantilla.nombre}
            </Text>
            {plantilla.campos.map(
                (campo) => (
                    <View key={campo.id} style={styles.inputContainer}>
                        <Text>{campo.etiqueta}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={`ingrese ${campo.etiqueta}`}
                            onChange={(texto) => actualizarValor(campo.id, texto)}
                        />
                    </View>
                )
            )}


            <Button title="Guardar Orden" onPress={guardarOrdenHandler} />

        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    title: {
        fontSize: 22,
        marginBottom: 20
    },
    inputContainer: {
        marginBottom: 15
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginTop: 5
    }
});