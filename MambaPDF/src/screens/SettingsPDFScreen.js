import { useState } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { guardarConfigPDF } from "../storage/storage";

export default function SettingsPDFScreen({navigation}) {

    const [empresa, setEmpresa] = useState("")
    const [telefono, setTelefono] = useState("")
    const [logo, setLogo] = useState("")
    const [email, setEmail] = useState("")
    const [tecnico, setTecnico] = useState("")
    const [dire, setDire] = useState("")
    const [piePag, setPiePag] = useState("")
    const [firma, setFirma] = useState("")

    const guardar = async () => {

        const config = {
            empresaNombre: empresa,
            empresaTelefono: telefono,
            empresaLogo: logo,
            empresaEmail: email,
            nombreTecnico: tecnico,
            empresaDireccion: dire,
            piePagina: piePag,
            tecnico: tecnico,
            firma: firma
        }

        await guardarConfigPDF(config)
        Alert.alert("Éxito", "Configuración guardada");
        navigation.navigate("Home")

    }

    const seleccionarLogo = async () => {

        const result = await ImagePicker.launchImageLibraryAsync({
            base64: true
        })

        if (!result.canceled) {
            setLogo(result.assets[0].base64)
        }

    }

    const seleccionarFirma = async () => {

        const result = await ImagePicker.launchImageLibraryAsync({
            base64: true
        })

        if (!result.canceled) {
            setFirma(result.assets[0].base64)
        }

    }

    return (

        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.title}>Configuración de Empresa</Text>

            <TextInput
                placeholder="Nombre empresa"
                value={empresa}
                onChangeText={setEmpresa}
                style={styles.input}
            />

            <TextInput
                placeholder="Teléfono"
                value={telefono}
                onChangeText={setTelefono}
                style={styles.input}
            />

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            <TextInput
                placeholder="Nombre del técnico"
                value={tecnico}
                onChangeText={setTecnico}
                style={styles.input}
            />

            <TextInput
                placeholder="Dirección"
                value={dire}
                onChangeText={setDire}
                style={styles.input}
            />

            <TextInput
                placeholder="Pie de página"
                value={piePag}
                onChangeText={setPiePag}
                style={styles.input}
            />

            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={seleccionarLogo}
            >
                <Text style={styles.buttonText}>Seleccionar Logo</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={seleccionarFirma}
            >
                <Text style={styles.buttonText}>Seleccionar Firma</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={guardar}
            >
                <Text style={styles.buttonText}>Guardar Configuración</Text>
            </TouchableOpacity>

        </ScrollView>

    )

}

const styles = StyleSheet.create({

    container: {
        height: "100%",
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

    input: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 15
    },

    primaryButton: {
        backgroundColor: "#E1890A",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 15
    },

    secondaryButton: {
        backgroundColor: "#B67A26",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10
    },

    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16
    }

});