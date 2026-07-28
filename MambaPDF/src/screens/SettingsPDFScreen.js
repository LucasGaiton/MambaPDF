/**
 * -----------------------------------------------------------------------------
 * SettingsPDFScreen.jsx
 * -----------------------------------------------------------------------------
 * Pantalla encargada de configurar la apariencia de los documentos PDF
 * generados por la aplicación.
 *
 * El usuario puede personalizar:
 *
 * - Información de la empresa.
 * - Datos del responsable.
 * - Logo corporativo.
 * - Firma del técnico.
 * - Pie de página.
 * - Marca de agua.
 * - Visibilidad de las firmas.
 *
 * Además permite generar una vista previa del documento antes de guardar
 * la configuración.
 * -----------------------------------------------------------------------------
 */

import React, { useEffect, useState } from "react";

import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
    Switch,
    KeyboardAvoidingView,
    Platform
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import {
    guardarConfigPDF,
    obtenerConfigPDF
} from "../storage/storage";

import { generarPDF } from "../services/pdfService";

/**
 * -----------------------------------------------------------------------------
 * SettingsPDFScreen
 * -----------------------------------------------------------------------------
 * Pantalla utilizada para administrar toda la configuración visual utilizada
 * durante la generación de documentos PDF.
 *
 * Permite modificar y almacenar la configuración personalizada del usuario,
 * además de visualizar una vista previa antes de guardar los cambios.
 *
 * @param {Object} navigation Objeto de navegación de React Navigation.
 *
 * @returns {JSX.Element}
 * -----------------------------------------------------------------------------
 */
export default function SettingsPDFScreen({ navigation }) {

    /**
     * -------------------------------------------------------------------------
     * Carga la configuración almacenada cuando la pantalla es abierta.
     * -------------------------------------------------------------------------
     */
    useEffect(() => {

        cargarConfiguracion();

    }, []);

    /**
     * -------------------------------------------------------------------------
     * Recupera la configuración del PDF almacenada localmente y carga todos
     * los valores dentro de los estados del formulario.
     *
     * Si todavía no existe una configuración guardada simplemente finaliza
     * la ejecución.
     * -------------------------------------------------------------------------
     */
    const cargarConfiguracion = async () => {

        const config = await obtenerConfigPDF();

        if (!config) return;

        setEmpresa(config.empresaNombre || "");
        setTelefono(config.empresaTelefono || "");
        setEmail(config.empresaEmail || "");
        setDire(config.empresaDireccion || "");
        setPiePag(config.piePagina || "");
        setTecnico(config.tecnico || "");

        setLogo(config.empresaLogo || null);
        setFirma(config.firma || null);

        setWaterMark(config.waterMark || false);
        setOcultarFirmas(config.ocultarFirmas || false);

    };

    /**
     * -------------------------------------------------------------------------
     * Estados del formulario.
     * Cada uno representa una propiedad configurable del PDF.
     * -------------------------------------------------------------------------
     */

    const [empresa, setEmpresa] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [tecnico, setTecnico] = useState("");
    const [dire, setDire] = useState("");
    const [piePag, setPiePag] = useState("");

    const [logo, setLogo] = useState("");
    const [firma, setFirma] = useState("");

    const [waterMark, setWaterMark] = useState(false);
    const [ocultarFirmas, setOcultarFirmas] = useState(false);

    /**
     * -------------------------------------------------------------------------
     * Guarda toda la configuración actual del formulario en el almacenamiento
     * local.
     *
     * Una vez almacenada, informa al usuario y vuelve a la pantalla principal.
     * -------------------------------------------------------------------------
     */
    const guardar = async () => {

        const config = {

            empresaNombre: empresa,
            empresaTelefono: telefono,
            empresaLogo: logo,
            empresaEmail: email,
            empresaDireccion: dire,
            piePagina: piePag,
            tecnico,
            firma,
            waterMark,
            ocultarFirmas,

        };

        await guardarConfigPDF(config);

        Alert.alert(

            "Éxito",
            "Configuración guardada"

        );

        navigation.navigate("Home");

    };

    /**
     * -------------------------------------------------------------------------
     * Permite seleccionar una imagen desde la galería para utilizarla como
     * logo de la empresa.
     *
     * La imagen se almacena codificada en Base64.
     * -------------------------------------------------------------------------
     */
    const seleccionarLogo = async () => {

        const result = await ImagePicker.launchImageLibraryAsync({

            base64: true

        });

        if (!result.canceled) {

            setLogo(result.assets[0].base64);

        }

    };

    /**
     * -------------------------------------------------------------------------
     * Permite seleccionar la imagen correspondiente a la firma del técnico.
     *
     * También se almacena codificada en Base64.
     * -------------------------------------------------------------------------
     */
    const seleccionarFirma = async () => {

        const result = await ImagePicker.launchImageLibraryAsync({

            base64: true

        });

        if (!result.canceled) {

            setFirma(result.assets[0].base64);

        }

    };

    /**
     * -------------------------------------------------------------------------
     * Elimina el logo actualmente seleccionado.
     * -------------------------------------------------------------------------
     */
    const eliminarLogo = () => {

        setLogo(null);

    };

    /**
     * -------------------------------------------------------------------------
     * Elimina la firma actualmente seleccionada.
     * -------------------------------------------------------------------------
     */
    const eliminarFirma = () => {

        setFirma(null);

    };

    /**
     * -------------------------------------------------------------------------
     * Genera una vista previa del PDF utilizando la configuración actual.
     *
     * Para ello construye una orden y una plantilla de ejemplo, las envía al
     * servicio de generación de PDF y posteriormente abre la pantalla de
     * visualización del documento.
     * -------------------------------------------------------------------------
     */
    const verPreview = async () => {

        const config = {

            empresaNombre: empresa,
            empresaTelefono: telefono,
            empresaLogo: logo,
            empresaEmail: email,
            empresaDireccion: dire,
            piePagina: piePag,
            tecnico,
            firma,
            waterMark,
            ocultarFirmas

        };

        /**
         * Orden utilizada únicamente para generar la vista previa.
         */
        const ordenEjemplo = {

            nombre: "Orden de ejemplo",

            fechaCreacion: new Date(),

            valores: {

                cliente: "Juan Pérez",

                telefono: "2966 123456",

                descripcion: "Cambio de fuente de alimentación."

            }

        };

        /**
         * Plantilla utilizada únicamente para la vista previa.
         */
        const plantillaPreview = {

            nombre: "Instalación",

            secciones: [

                {
                    titulo: "Cliente",

                    campos: [

                        {
                            id: "cliente",
                            etiqueta: "Cliente"
                        },

                        {
                            id: "telefono",
                            etiqueta: "Teléfono"
                        }

                    ]

                },

                {
                    titulo: "Trabajo",

                    campos: [

                        {
                            id: "descripcion",
                            etiqueta: "Descripción"
                        }

                    ]

                }

            ]

        };

        const uri = await generarPDF(

            config,
            ordenEjemplo,
            plantillaPreview

        );

        navigation.navigate(

            "Preview PDF",

            {

                pdfUri: uri,

            }

        );

    };

    return (
        /**
        * ---------------------------------------------------------------------
        * KeyboardAvoidingView
        * ---------------------------------------------------------------------
        * Evita que el teclado virtual cubra los campos del formulario,
        * especialmente en dispositivos iOS.
        * ---------------------------------------------------------------------
        */
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

            {/*--------------------------------------------------------------
                Contenedor con desplazamiento vertical.
                Permite acceder cómodamente a todas las opciones de
                configuración del PDF.
            --------------------------------------------------------------*/}
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                {/*==========================================================
                    DATOS DE LA EMPRESA
                ==========================================================*/}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nombre de la empresa</Text>
                    <TextInput
                        maxFontSizeMultiplier={1.1}
                        placeholder="Ingrese el nombre de la empresa"
                        placeholderTextColor="#8C8C8C"
                        value={empresa}
                        onChangeText={setEmpresa}
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput
                        maxFontSizeMultiplier={1.1}
                        placeholder="Ingrese el teléfono"
                        placeholderTextColor="#8C8C8C"
                        value={telefono}
                        onChangeText={setTelefono}
                        style={styles.input}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Correo electrónico</Text>
                    <TextInput
                        maxFontSizeMultiplier={1.1}
                        placeholder="Ingrese el correo electrónico"
                        placeholderTextColor="#8C8C8C"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nombre del responsable</Text>
                    <TextInput
                        maxFontSizeMultiplier={1.1}
                        placeholder="Ingrese el nombre del responsable"
                        placeholderTextColor="#8C8C8C"
                        value={tecnico}
                        onChangeText={setTecnico}
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Dirección</Text>
                    <TextInput
                        maxFontSizeMultiplier={1.1}
                        placeholder="Ingrese la dirección"
                        placeholderTextColor="#8C8C8C"
                        value={dire}
                        onChangeText={setDire}
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Pie de página del PDF</Text>
                    <TextInput
                        maxFontSizeMultiplier={1.1}
                        placeholder="Texto que aparecerá al pie del documento"
                        placeholderTextColor="#8C8C8C"
                        value={piePag}
                        onChangeText={setPiePag}
                        style={[styles.input, styles.multilineInput]}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.inputGroup}>

                    {/*==========================================================
                                LOGO CORPORATIVO
                    ==========================================================*/}


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
                            Ocultar firmas en el PDF
                        </Text>

                        <Text style={styles.switchDescription}>
                            Si activas esta opción, el PDF no incluirá las líneas de firma del
                            técnico ni del cliente. Es útil para generar documentos informativos o
                            borradores.
                        </Text>

                    </View>

                    <Switch
                        value={ocultarFirmas}
                        onValueChange={setOcultarFirmas}
                        trackColor={{ false: "#D6D6D6", true: "#E8C68B" }}
                        thumbColor={ocultarFirmas ? "#E1890A" : "#FFFFFF"}
                    />

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
        </KeyboardAvoidingView>
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