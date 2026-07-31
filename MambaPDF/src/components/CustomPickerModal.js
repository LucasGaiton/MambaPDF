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

    title = "Seleccionar",
    placeholder = "Seleccione una opción",
    value,
    options,
    onChange,
    style

}) {

    const [visible, setVisible] = useState(false);
    const [fade] = useState(new Animated.Value(0));

    const seleccionado =
        options.find(op => op.value === value);

    const abrir = () => {

        setVisible(true);

        Animated.timing(fade, {

            toValue: 1,
            duration: 250,
            useNativeDriver: true

        }).start();

    };

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

            <TouchableOpacity
                style={style ? style : styles.selector}
                activeOpacity={0.85}
                onPress={abrir}
            >

                <Text
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

            <Modal
                visible={visible}
                transparent
                animationType="none"
            >

                <Animated.View
                    style={[
                        styles.overlay
                        
                    ]}
                >

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

                                    <Text
                                        style={styles.itemTexto}
                                    >

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

        fontSize: 15,

        color: "#333"

    },

    placeholder: {

        color: "#999"

    },

    overlay: {

        flex: 1,

        backgroundColor: "rgba(0,0,0,.45)",

        justifyContent: "center",

        alignItems: "center",

        padding: 20

    },

    modal: {

        width: "100%",

        maxWidth: 450,

        maxHeight: "70%",

        backgroundColor: "#FFF",

        borderRadius: 14,

        overflow: "hidden",

        elevation: 8

    },

    titulo: {

        fontSize: 18,

        fontWeight: "bold",

        color: "#8B6734",

        padding: 18,

        borderBottomWidth: 1,

        borderBottomColor: "#EEE"

    },

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

    divider: {

        height: 1,

        backgroundColor: "#EFEFEF"

    }

});