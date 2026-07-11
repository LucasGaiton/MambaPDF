import { useState } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { guardarConfigPDF, obtenerConfigPDF } from "../storage/storage";
import { useEffect } from "react";
import { generarPDF } from "../services/pdfService";


export default function SettingsPDFScreen({ navigation }) {

    useEffect(() => {
        cargarConfiguracion();
    }, []);

    const cargarConfiguracion = async () => {
        // console.log("Carga la config");


        const config = await obtenerConfigPDF();
        // console.log(typeof config);
        // console.log(config.empresaNombre);
        // console.log(config.firma);
        // console.log(typeof config.empresaLogo);

        if (!config) return;

        setEmpresa(config.empresaNombre || "");
        setTelefono(config.empresaTelefono || "");
        setEmail(config.empresaEmail || "");
        setDire(config.empresaDireccion || "");
        setPiePag(config.piePagina || "");
        setTecnico(config.tecnico || "");

        setLogo(config.empresaLogo || null);
        setFirma(config.firma || null);

    };

    const [empresa, setEmpresa] = useState("")
    const [telefono, setTelefono] = useState("")
    const [email, setEmail] = useState("")
    const [tecnico, setTecnico] = useState("")
    const [dire, setDire] = useState("")
    const [piePag, setPiePag] = useState("")
    const [logo, setLogo] = useState("")
    const [firma, setFirma] = useState("")

    const guardar = async () => {

        const config = {
            empresaNombre: empresa,
            empresaTelefono: telefono,
            empresaLogo: logo,
            empresaEmail: email,
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
    const verPreview = async () => {

        const config = {
            empresaNombre: empresa,
            empresaTelefono: telefono,
            empresaLogo: logo,
            empresaEmail: email,
            empresaDireccion: dire,
            piePagina: piePag,
            tecnico: tecnico,
            firma: firma
        };

        const ordenEjemplo = {
            nombre: "Orden de ejemplo",
            fechaCreacion: new Date(),
            valores: {
                cliente: "Juan Pérez",
                telefono: "2966 123456",
                descripcion: "Cambio de fuente de alimentación."
            }
        };

        const plantillaPreview = {
            nombre: "Instalación",
            secciones: [
                {
                    titulo: "Cliente",
                    campos: [
                        { id: "cliente", etiqueta: "Cliente" },
                        { id: "telefono", etiqueta: "Teléfono" }
                    ]
                },
                {
                    titulo: "Trabajo",
                    campos: [
                        { id: "descripcion", etiqueta: "Descripción" }
                    ]
                }
            ]
        };

        const uri = await generarPDF(
            config,
            ordenEjemplo,
            plantillaPreview
        );

        navigation.navigate("Preview PDF", {
            uri,
        });

    };

    return (

        <ScrollView contentContainerStyle={styles.container}>

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

            {logo && (

                <Image
                    source={{ uri: `data:image/png;base64,${logo}` }}
                    style={styles.logo}
                />

            )}


            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={seleccionarLogo}
            >
                <Text style={styles.buttonText}>Seleccionar Logo</Text>
            </TouchableOpacity>

            {firma && (

                <Image
                    source={{ uri: `data:image/png;base64,${firma}` }}
                    style={styles.firma}
                />

            )}

            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={seleccionarFirma}
            >
                <Text style={styles.buttonText}>Seleccionar Firma</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={verPreview}
            >
                <Text style={styles.buttonText}>Vista previa</Text>
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
    },
    logo: {
        width: 180,
        height: 120,
        resizeMode: "contain",
        alignSelf: "center",
        marginVertical: 15,
    },

    firma: {
        width: 220,
        height: 90,
        resizeMode: "contain",
        alignSelf: "center",
        marginVertical: 15,
    },

});