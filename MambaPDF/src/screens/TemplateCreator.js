import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from "react-native";

import { useState, useEffect } from "react";
import { guardarPlantilla } from "../storage/storage";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import CustomPickerModal from "../components/CustomPickerModal";
import { useWindowDimensions } from "react-native";
import { RF } from "../utils/responsive";



export default function TemplateCreator({ navigation, route }) {
    const plantillaEditar = route?.params?.plantilla;
    const { width } = useWindowDimensions();

    useEffect(() => {

        navigation.setOptions({
            title: plantillaEditar
                ? "Editar Plantilla"
                : "Crear Plantilla"
        });

    }, [navigation, plantillaEditar]);



    // ======================================
    // ESTADOS DE LA PLANTILLA
    // ======================================

    // Nombre de la plantilla
    const [nombre, setNombre] = useState(
        plantillaEditar?.nombre || ""
    );
    // Secciones que componen la plantilla
    const [secciones, setSecciones] = useState(
        plantillaEditar?.secciones || []
    );


    // Sección actualmente seleccionada para agregar campos
    const [seccionActiva, setSeccionActiva] = useState(
        plantillaEditar?.secciones?.length
            ? plantillaEditar.secciones[0].id
            : null
    );

    // Estados utilizados cuando el campo es de tipo "opciones"
    const [nuevaOpcion, setNuevaOpcion] = useState({});
    //const [opcionesPersonalizadas, setOpcionesPersonalizadas] = useState([]);


    // ======================================
    // GESTIÓN DE SECCIONES
    // ======================================

    /**
     * Agrega una nueva sección a la plantilla.
     * Valida que el nombre no esté vacío
     * y que no exista otra sección con el mismo id.
     */

    const agregarSeccion = () => {

        const id = Date.now().toString();

        const nuevaSeccion = {
            id,
            titulo: "",
            campos: []
        };

        setSecciones(prev => [...prev, nuevaSeccion]);

        setSeccionActiva(id);

    };

    /**
  * Elimina una sección completa junto con todos sus campos.
  * Si la sección eliminada era la activa,
  * selecciona automáticamente otra o deja ninguna.
  */
    const eliminarSeccion = (idSeccion) => {

        const nuevasSecciones = secciones.filter(
            seccion => seccion.id !== idSeccion
        );

        setSecciones(nuevasSecciones);

        if (seccionActiva === idSeccion) {
            setSeccionActiva(
                nuevasSecciones.length > 0
                    ? nuevasSecciones[0].id
                    : null
            );
        }

    };

    const editarSeccion = (idSeccion, nuevoTitulo) => {

        setSecciones(prev =>
            prev.map(seccion =>

                seccion.id === idSeccion
                    ? {
                        ...seccion,
                        titulo: nuevoTitulo
                    }
                    : seccion

            )
        );

    };

    // ======================================
    // GESTIÓN DE OPCIONES
    // ======================================

    /**
     * Agrega una opción a un campo de tipo selección.
     */
    const agregarOpcionCampo = (idSeccion, idCampo) => {

        const texto = (nuevaOpcion[idCampo] || "").trim();

        if (!texto) return;

        setSecciones(prev =>

            prev.map(seccion => {

                if (seccion.id !== idSeccion)
                    return seccion;

                return {

                    ...seccion,

                    campos: seccion.campos.map(campo =>

                        campo.id === idCampo
                            ? {
                                ...campo,
                                opciones: [...campo.opciones, texto]
                            }
                            : campo

                    )

                };

            })

        );

        setNuevaOpcion(prev => ({
            ...prev,
            [idCampo]: ""
        }));

    };

    const eliminarOpcionCampo = (
        idSeccion,
        idCampo,
        indice
    ) => {

        setSecciones(prev =>

            prev.map(seccion => {

                if (seccion.id !== idSeccion)
                    return seccion;

                return {

                    ...seccion,

                    campos: seccion.campos.map(campo =>

                        campo.id === idCampo
                            ? {
                                ...campo,
                                opciones: campo.opciones.filter(
                                    (_, i) => i !== indice
                                )
                            }
                            : campo

                    )

                };

            })

        );

    };

    // ======================================
    // GESTIÓN DE CAMPOS
    // ======================================

    /**
     * Agrega un nuevo campo a la sección activa.
     * Valida nombre, sección seleccionada y
     * cantidad mínima de opciones cuando corresponde.
     */
    const agregarCampo = () => {

        if (!seccionActiva) {
            return Alert.alert(
                "Error",
                "Debe seleccionar una sección."
            );
        }

        const nuevo = {
            id: Date.now().toString(),
            etiqueta: "",
            tipo: "",
            opciones: []
        };

        setSecciones(prev =>

            prev.map(seccion =>

                seccion.id === seccionActiva
                    ? {
                        ...seccion,
                        campos: [...seccion.campos, nuevo]
                    }
                    : seccion

            )

        );

    };

    const editarCampo = (idSeccion, idCampo, propiedad, valor) => {

        setSecciones(prev =>

            prev.map(seccion => {

                if (seccion.id !== idSeccion) return seccion;

                return {

                    ...seccion,

                    campos: seccion.campos.map(campo =>

                        campo.id === idCampo
                            ? {
                                ...campo,
                                [propiedad]: valor
                            }
                            : campo

                    )

                };

            })

        );

    };

    /**
       * Elimina un campo de una sección determinada.
       */
    const eliminarCampo = (idSeccion, idCampo) => {

        const nuevasSecciones = secciones.map(seccion => {

            if (seccion.id !== idSeccion) {
                return seccion;
            }

            return {
                ...seccion,
                campos: seccion.campos.filter(
                    campo => campo.id !== idCampo
                )
            };

        });

        setSecciones(nuevasSecciones);

    };

    const validaciones = () => {
        if (!nombre.trim()) {
            return {
                ok: false,
                mensaje: "Debe poner un nombre a la plantilla."
            };
        }

        if (secciones.length === 0) {
            return {
                ok: false,
                mensaje: "Debe agregar al menos una sección"
            };
        }


        // ==========================================
        // Validación de secciones y campos
        // ==========================================

        for (const seccion of secciones) {

            if (!seccion.titulo.trim()) {
                return {
                    ok: false,
                    mensaje: "Todas las secciones deben tener un nombre."
                };
            }

            if (seccion.campos.length === 0) {
                return {
                    ok: false,
                    mensaje: `La sección "${seccion.titulo}" debe contener al menos un campo.`
                };
            }

            for (const campo of seccion.campos) {

                console.log("Estos son los campos", campo);


                if (!campo.etiqueta.trim()) {
                    return {
                        ok: false,
                        mensaje: `Todos los campos de la sección "${seccion.titulo}" deben tener un nombre.`
                    };
                }

                if (campo.tipo === "") {
                    return {
                        ok: false,
                        mensaje: `Debe seleccionar un tipo para el campo "${campo.etiqueta || "sin nombre"}".`
                    };
                }

                if (
                    campo.tipo === "opciones" &&
                    campo.opciones.length < 2
                ) {
                    return {
                        ok: false,
                        mensaje: `El campo "${campo.etiqueta}" debe tener al menos dos opciones.`
                    };
                }

            }

        }

        return {
            ok: true
        };
    }

    // ======================================
    // GUARDADO DE LA PLANTILLA
    // ======================================

    /**
     * Construye el objeto plantilla,
     * lo almacena en AsyncStorage
     * y vuelve a la pantalla principal.
     */
    const guardar = async () => {
        const resultado = validaciones()

        if (!resultado.ok) {
            Alert.alert("Error", resultado.mensaje);
            return;
        }
        const plantilla = {
            id: plantillaEditar
                ? plantillaEditar.id
                : Date.now().toString(),

            nombre: nombre.trim(),
            secciones
        };

        await guardarPlantilla(plantilla.id, plantilla);

        setNombre("");
        setSecciones([]);

        Alert.alert(
            "Éxito",
            plantillaEditar
                ? "Plantilla actualizada"
                : "Plantilla guardada"
        );
        navigation.navigate("Home")

    };

    return (

        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >

                <TextInput
                    maxFontSizeMultiplier={1.1}
                    placeholder="Nombre de la plantilla"
                    placeholderTextColor="#8C8C8C"
                    value={nombre}
                    onChangeText={setNombre}
                    style={styles.input}
                />

                {secciones.map(seccion => (

                    <View key={seccion.id} style={styles.seccionContainer}>

                        <View style={styles.headerSeccion}>

                            <TextInput
                                maxFontSizeMultiplier={1.1}
                                style={styles.seccionTituloInput}
                                placeholder="Nombre de la sección"
                                placeholderTextColor="#999"
                                value={seccion.titulo}
                                onChangeText={(texto) =>
                                    editarSeccion(seccion.id, texto)
                                }
                            />

                            <TouchableOpacity
                                onPress={() => eliminarSeccion(seccion.id)}
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={22}
                                    color="#E1890A"
                                />
                            </TouchableOpacity>

                        </View>

                        {seccion.campos.map(campo => (

                            <View key={campo.id} style={styles.campoContainer}>

                                <View style={styles.headerCampo}>

                                    <TextInput
                                        maxFontSizeMultiplier={1.1}
                                        style={styles.campoInput}
                                        placeholder="Nombre del campo"
                                        placeholderTextColor="#999"
                                        value={campo.etiqueta}
                                        onChangeText={(texto) =>
                                            editarCampo(
                                                seccion.id,
                                                campo.id,
                                                "etiqueta",
                                                texto
                                            )
                                        }
                                    />

                                    <CustomPickerModal
                                        value={campo.tipo}
                                        placeholder="Tipo de campo"
                                        options={[
                                            { label: "Texto", value: "texto" },
                                            { label: "Fecha", value: "fecha" },
                                            { label: "Sí / No", value: "boolean" },
                                            { label: "Opciones", value: "opciones" }
                                        ]}
                                        onChange={(valor) =>
                                            editarCampo(
                                                seccion.id,
                                                campo.id,
                                                "tipo",
                                                valor
                                            )
                                        }
                                    />





                                    {campo.tipo === "opciones" && (

                                        <View style={styles.opcionesEditor}>

                                            <View style={styles.nuevaOpcionContainer}>

                                                <TextInput
                                                    maxFontSizeMultiplier={1.1}
                                                    style={styles.inputNuevaOpcion}
                                                    placeholder="Nueva opción"
                                                    placeholderTextColor="#999"
                                                    value={nuevaOpcion[campo.id] || ""}
                                                    onChangeText={(texto) =>
                                                        setNuevaOpcion(prev => ({
                                                            ...prev,
                                                            [campo.id]: texto
                                                        }))
                                                    }
                                                />

                                                <TouchableOpacity
                                                    style={styles.botonAgregarOpcion}
                                                    onPress={() =>
                                                        agregarOpcionCampo(
                                                            seccion.id,
                                                            campo.id
                                                        )
                                                    }
                                                >
                                                    <Ionicons
                                                        name="add"
                                                        size={22}
                                                        color="#FFF"
                                                    />
                                                </TouchableOpacity>

                                            </View>

                                            {campo.opciones.map((opcion, indice) => (

                                                <View
                                                    key={indice}
                                                    style={styles.opcionRow}
                                                >

                                                    <Text style={styles.opcionTexto}>
                                                        {opcion}
                                                    </Text>

                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            eliminarOpcionCampo(
                                                                seccion.id,
                                                                campo.id,
                                                                indice
                                                            )
                                                        }
                                                    >
                                                        <Ionicons
                                                            name="trash-outline"
                                                            size={18}
                                                            color="#A64B2A"
                                                        />
                                                    </TouchableOpacity>

                                                </View>

                                            ))}

                                        </View>

                                    )}
                                    <TouchableOpacity
                                        style={styles.botonEliminarCampo}
                                        onPress={() => eliminarCampo(seccion.id, campo.id)}
                                    >
                                        <Ionicons
                                            name="trash-outline"
                                            size={18}
                                            color="#FFF"
                                        />
                                    </TouchableOpacity>



                                </View>





                            </View>

                        ))}

                        <TouchableOpacity
                            style={styles.botonSecundario}
                            onPress={() => {

                                setSeccionActiva(seccion.id);

                                agregarCampo();

                            }}
                        >

                            <Text style={styles.botonTexto}>
                                + Agregar campo
                            </Text>

                        </TouchableOpacity>

                    </View>

                ))}

                <TouchableOpacity
                    style={styles.boton}
                    onPress={agregarSeccion}
                >
                    <Text style={styles.botonTexto}>
                        + Agregar sección
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botonGuardar}
                    onPress={guardar}
                >
                    <Text style={styles.botonTexto}>
                        {plantillaEditar
                            ? "Guardar cambios"
                            : "Guardar plantilla"}
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>

    );

}

const styles = StyleSheet.create({

    scrollContainer: {
        backgroundColor: "#33302D",
        minWidth: 100,
        minHeight: "100%",
        padding: 20,
        backgroundColor: "#F6F3EF",
    },

    input: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        backgroundColor: "white",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 15,
    },

    pickerContainer: {
        flex: 1.3,
        backgroundColor: "#FFF",
        overflow: "hidden",
        minHeight: 38,
    },
    picker: {
        width: "100%",
        height: 48,
        color: "#333",
    },


    boton: {
        backgroundColor: "#B67A26",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 12,
        elevation: 3
    },
    botonGuardar: {
        backgroundColor: "#E1890A",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 12,
        elevation: 3
    },

    botonSecundario: {
        backgroundColor: "#E1890A",
        paddingVertical: RF(12),
        borderRadius: RF(8),
        alignItems: "center",
        marginBottom: RF(10)
    },

    botonTexto: {
        color: "white",
        fontWeight: "bold",
        fontSize: RF(15)
    },

    seccionContainer: {
        backgroundColor: "#FFF",
        padding: 18,
        marginTop: 13,
        gap: 10,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        borderRadius: 10,
        borderLeftWidth: 6,
        borderLeftColor: "#E1890A"
    },

    seccionTituloInput: {
        flex: 1,
        fontSize: 18,
        fontWeight: "bold",
        color: "#B67A26",
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },

    campoContainer: {
        backgroundColor: "#FFF8ED",
        borderWidth: 1,
        borderColor: "#E8C68B",
        marginBottom: 6,
        borderRadius: 10,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        elevation: 2
    },
    campoInput: {
        flex: 2,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        backgroundColor: "#FFF",
        borderRadius:8,
        paddingHorizontal:12, 
        fontSize:13,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
        minheight: 38
    },

    headerSeccion: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },

    headerCampo: {
        width: "100%", // en vez de 90%
        flexDirection: "column",
        gap: 8,
        marginBottom: 10,
    },


    botonEliminarCampo: {
        backgroundColor: "#8B6734",
        paddingVertical: 11,
        borderRadius: 8,
        alignItems: "center",
        elevation: 3
    },
    opcionesEditor: {
        marginTop: 10,
    },

    nuevaOpcionContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
    },

    inputNuevaOpcion: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#FFF",
        outlineStyle: "none",
    },

    botonAgregarOpcion: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: "#E1890A",
        justifyContent: "center",
        alignItems: "center",
    },

    opcionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F8F8F8",
        borderWidth: 1,
        borderColor: "#E8C68B",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
    },

    opcionTexto: {
        color: "#333",
        fontSize: 15,
    },


});