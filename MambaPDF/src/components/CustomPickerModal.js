/**
 * =============================================================================
 * CustomPickerModal
 * =============================================================================
 * Componente reutilizable que reemplaza al Picker nativo mediante un modal.
 *
 * Funcionalidades principales:
 *  - Mostrar un selector personalizado con una interfaz consistente.
 *  - Permitir seleccionar una opción desde una lista.
 *  - Indicar visualmente la opción actualmente seleccionada.
 *  - Personalizar el estilo del selector desde el componente padre.
 * =============================================================================
 */

import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CustomPickerModal({

    /**
     * Título mostrado en la parte superior del modal.
     */
    title = "Seleccionar",

    /**
     * Texto mostrado cuando no existe una opción seleccionada.
     */
    placeholder = "Seleccione una opción",

    /**
     * Valor actualmente seleccionado.
     */
    value,

    /**
     * Lista de opciones disponibles.
     *
     * Formato esperado:
     * [
     *   { label: "Texto", value: "texto" },
     *   { label: "Fecha", value: "fecha" }
     * ]
     */
    options,

    /**
     * Función ejecutada al seleccionar una opción.
     */
    onChange,

    /**
     * Permite sobrescribir el estilo del selector desde el
     * componente padre.
     */
    style

}) {

    //==========================================================================
    //                           Estados
    //==========================================================================

    /**
     * Controla la visibilidad del modal.
     */
    const [visible, setVisible] = useState(false);

    /**
     * Valor utilizado para la animación de aparición
     * y desaparición del modal.
     */
    const [fade] = useState(new Animated.Value(0));

    /**
     * Busca la opción correspondiente al valor actual
     * para mostrar su etiqueta en el selector.
     */
    const seleccionado =
        options.find(op => op.value === value);

    //==========================================================================
    //                           Funciones
    //==========================================================================

    /**
     * Abre el modal ejecutando una animación de entrada.
     */
    const abrir = () => {

        setVisible(true);

        Animated.timing(fade, {

            toValue: 1,
            duration: 250,
            useNativeDriver: true

        }).start();

    };

    /**
     * Cierra el modal mediante una animación y,
     * al finalizar, oculta completamente el componente.
     */
    const cerrar = () => {

        Animated.timing(fade, {

            toValue: 0,
            duration: 250,
            useNativeDriver: true

        }).start(() => {

            setVisible(false);

        });

    };

    return (

        <>

            {/* ==========================================================
                Selector
               ========================================================== */}

            <TouchableOpacity
                style={style ? style : styles.selector}
                activeOpacity={0.85}
                onPress={abrir}
            >

                <Text
                    maxFontSizeMultiplier={1.1}
                    style={[
                        styles.selectorTexto,
                        !seleccionado && styles.placeholder
                    ]}
                >

                    {seleccionado
                        ? seleccionado.label
                        : placeholder}

                </Text>

                <Ionicons
                    name="chevron-down"
                    size={20}
                    color="#666"
                />

            </TouchableOpacity>

            {/* ==========================================================
                Modal de selección
               ========================================================== */}

            <Modal
                visible={visible}
                transparent
                animationType="none"
            >

                <Animated.View
                    style={styles.overlay}
                >

                    {/* Fondo para cerrar el modal */}
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={cerrar}
                    />

                    <View style={styles.modal}>

                        <Text style={styles.titulo}>
                            {title}
                        </Text>

                        <FlatList

                            data={options}

                            keyExtractor={item => item.value}

                            showsVerticalScrollIndicator={false}

                            renderItem={({ item }) => (

                                <TouchableOpacity

                                    style={styles.item}

                                    activeOpacity={0.75}

                                    onPress={() => {

                                        onChange(item.value);
                                        cerrar();

                                    }}

                                >

                                    <Text style={styles.itemTexto}>
                                        {item.label}
                                    </Text>

                                    {item.value === value && (

                                        <Ionicons
                                            name="checkmark-circle"
                                            size={22}
                                            color="#E1890A"
                                        />

                                    )}

                                </TouchableOpacity>

                            )}

                            ItemSeparatorComponent={() =>
                                <View style={styles.divider} />
                            }

                        />

                    </View>

                </Animated.View>

            </Modal>

        </>

    );

}

const styles = StyleSheet.create({

    /**
     * Estilo por defecto del selector.
     * Puede ser reemplazado mediante la prop "style".
     */
    selector: {
        minHeight: 38,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        backgroundColor: "#FFF",
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    selectorTexto: {
        fontSize: 13,
        color: "#333"

    },

    placeholder: {

        color: "#999"

    },

    /**
     * Fondo oscuro del modal.
     */
    overlay: {

        flex: 1,

        backgroundColor: "rgba(0,0,0,.45)",

        justifyContent: "center",

        alignItems: "center",

        padding: 20

    },

    /**
     * Contenedor principal del modal.
     */
    modal: {

        width: "100%",

        maxWidth: 450,

        maxHeight: "70%",

        backgroundColor: "#FFF",

        borderRadius: 14,

        overflow: "hidden",

        elevation: 8

    },

    /**
     * Encabezado del modal.
     */
    titulo: {

        fontSize: 18,

        fontWeight: "bold",

        color: "#8B6734",

        padding: 18,

        borderBottomWidth: 1,

        borderBottomColor: "#EEE"

    },

    /**
     * Cada opción de la lista.
     */
    item: {

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        paddingHorizontal: 18,

        paddingVertical: 15

    },

    itemTexto: {

        fontSize: 16,

        color: "#333"

    },

    /**
     * Separador entre opciones.
     */
    divider: {

        height: 1,

        backgroundColor: "#EFEFEF"

    }

});