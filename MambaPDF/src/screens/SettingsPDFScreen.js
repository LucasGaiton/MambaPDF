import { useState } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
    Switch
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
        setWaterMark(config.waterMark || null)

    };

    const [empresa, setEmpresa] = useState("")
    const [telefono, setTelefono] = useState("")
    const [email, setEmail] = useState("")
    const [tecnico, setTecnico] = useState("")
    const [dire, setDire] = useState("")
    const [piePag, setPiePag] = useState("")
    const [logo, setLogo] = useState("")
    const [firma, setFirma] = useState("")
    const [waterMark, setWaterMark] = useState("")

    const guardar = async () => {

        const config = {
            empresaNombre: empresa,
            empresaTelefono: telefono,
            empresaLogo: logo,
            empresaEmail: email,
            empresaDireccion: dire,
            piePagina: piePag,
            tecnico: tecnico,
            firma: firma,
            waterMark: waterMark
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

    const eliminarLogo = () => {
        setLogo(null);
    };

    const eliminarFirma = () => {
        setFirma(null);
    };
    const verPreview = async () => {

        const config = {
            empresaNombre: empresa,
            empresaTelefono: telefono,
            empresaLogo: logo,
            empresaEmail: email,
            empresaDireccion: dire,
            piePagina: piePag,
            tecnico: tecnico,
            firma: firma,
            waterMark: waterMark
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
        console.log("Esto es desde la config", typeof waterMark);


        const uri = await generarPDF(
            config,
            ordenEjemplo,
            plantillaPreview,

        );

        navigation.navigate("Preview PDF", {
            pdfUri: uri,
        });

    };

    return (

        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre de la empresa</Text>
                <TextInput
                    placeholder="Ingrese el nombre de la empresa"
                    value={empresa}
                    onChangeText={setEmpresa}
                    style={styles.input}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                    placeholder="Ingrese el teléfono"
                    value={telefono}
                    onChangeText={setTelefono}
                    style={styles.input}
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                    placeholder="Ingrese el correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre del técnico</Text>
                <TextInput
                    placeholder="Ingrese el nombre del técnico"
                    value={tecnico}
                    onChangeText={setTecnico}
                    style={styles.input}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Dirección</Text>
                <TextInput
                    placeholder="Ingrese la dirección"
                    value={dire}
                    onChangeText={setDire}
                    style={styles.input}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Pie de página del PDF</Text>
                <TextInput
                    placeholder="Texto que aparecerá al pie del documento"
                    value={piePag}
                    onChangeText={setPiePag}
                    style={[styles.input, styles.multilineInput]}
                    multiline
                    textAlignVertical="top"
                />
            </View>

            <View style={styles.inputGroup}>

                <Text style={styles.label}>Logo de la empresa</Text>

                {logo && (
                    <View style={styles.imageCard}>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={eliminarLogo}
                        >
                            <Text style={styles.deleteButtonText}>×</Text>
                        </TouchableOpacity>

                        <Image
                            source={{ uri: `data:image/png;base64,${logo}` }}
                            style={styles.logo}
                        />

                    </View>
                )}

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={seleccionarLogo}
                >
                    <Text style={styles.buttonText}>Seleccionar Logo</Text>
                </TouchableOpacity>

            </View>


            <View style={styles.inputGroup}>

                <Text style={styles.label}>Firma del técnico</Text>
                {firma && (
                    <View style={styles.imageCard}>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={eliminarFirma}
                        >
                            <Text style={styles.deleteButtonText}>×</Text>
                        </TouchableOpacity>

                        <Image
                            source={{ uri: `data:image/png;base64,${firma}` }}
                            style={styles.firma}
                        />

                    </View>
                )}



                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={seleccionarFirma}
                >
                    <Text style={styles.buttonText}>Seleccionar Firma</Text>
                </TouchableOpacity>

            </View>


            <View style={styles.switchContainer}>

                <View style={styles.switchInfo}>

                    <Text style={styles.switchTitle}>
                        Logo como marca de agua
                    </Text>

                    <Text style={styles.switchDescription}>
                        Mostrar el logo de la empresa de forma tenue en el fondo del PDF.
                    </Text>

                </View>

                <Switch
                    value={waterMark}
                    onValueChange={setWaterMark}
                    trackColor={{ false: "#D6D6D6", true: "#E8C68B" }}
                    thumbColor={waterMark ? "#E1890A" : "#FFFFFF"}
                />

            </View>

            <View style={styles.infoBox}>

                <Text style={styles.infoTitle}>
                    Recomendaciones
                </Text>

                <Text style={styles.infoText}>
                    • Utilice un logo con fondo transparente o blanco para obtener una
                    mejor integración en el encabezado y la marca de agua del PDF.
                </Text>

                <Text style={styles.infoText}>
                    • La firma se visualizará con mayor calidad si posee un fondo
                    transparente o completamente blanco.
                </Text>

                <Text style={styles.infoText}>
                    • Antes de guardar la configuración puede utilizar la vista previa
                    para verificar el aspecto final del documento.
                </Text>

            </View>

            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={verPreview}
            >
                <Text style={styles.buttonText}>
                    Vista previa
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={guardar}
            >
                <Text style={styles.buttonText}>
                    Guardar Configuración
                </Text>
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
    inputGroup: {
        marginBottom: 18,
    },

    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#8B6734",
        marginBottom: 6,
        marginLeft: 2,
        letterSpacing: 0.3,
    },

    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        color: "#333",
    },

    multilineInput: {
        minHeight: 90,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E8E2D8",
        padding: 15,
        marginTop: 15,
    },

    switchInfo: {
        flex: 1,
        paddingRight: 15,
    },

    switchTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#8B6734",
    },

    switchDescription: {
        marginTop: 4,
        fontSize: 13,
        color: "#777",
        lineHeight: 18,
    },
    imageCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E7E2DB",
        padding: 16,
        marginTop: 12,
        marginBottom: 8,
        alignItems: "center",
        position: "relative",

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },

    deleteButton: {
        position: "absolute",
        top: 8,
        right: 8,

        width: 26,
        height: 26,
        borderRadius: 13,

        backgroundColor: "#D9534F",

        justifyContent: "center",
        alignItems: "center",

        zIndex: 10,
    },

    deleteButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        lineHeight: 20,
    },

    imagePlaceholder: {
        color: "#999",
        fontSize: 14,
        fontStyle: "italic",
    },

    infoBox: {
        backgroundColor: "#FFF8ED",
        borderLeftWidth: 5,
        borderLeftColor: "#E1890A",
        borderRadius: 10,
        padding: 15,
        marginTop: 25,
        marginBottom: 5,
    },

    infoTitle: {
        color: "#8B6734",
        fontWeight: "700",
        fontSize: 16,
        marginBottom: 10,
    },

    infoText: {
        color: "#555",
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 8,
    },
});