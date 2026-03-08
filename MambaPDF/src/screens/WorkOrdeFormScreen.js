import { useState } from "react"
import { ScrollView, Text, TextInput, View, StyleSheet, Button } from "react-native"
import { guardarOrden } from "../storage/storage"

export default function WorkOrderFormScreen({ route, navigation }) {
    const { plantilla } = route.params;
    const [valores, setValores] = useState({})

    const actualizarValor = (campoId, valor) => {
        console.log("Campoid:", campoId);
        console.log("Valor", valor);
        
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
        navigation.goBack();
    }


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
                            onChangeText={(texto) => actualizarValor(campo.id, texto)}
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