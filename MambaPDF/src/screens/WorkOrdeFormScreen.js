import { useState } from "react";
import { ScrollView, Text, TextInput, View, StyleSheet, Button, Switch, TouchableOpacity } from "react-native";
import { guardarOrden } from "../storage/storage"
import { Picker } from "@react-native-picker/picker";
import { DatePickerModal } from "react-native-paper-dates";

export default function WorkOrderFormScreen({ route, navigation }) {

    const { plantilla } = route.params;

    const getInitialState = () => {
        const initialState = {};

        plantilla.campos.forEach(campo => {
            if (campo.tipo === "boolean") {
                initialState[campo.id] = false;
            } else if (campo.tipo === "opciones" && campo.opciones?.length > 0) {
                initialState[campo.id] = campo.opciones[0];
            } else {
                initialState[campo.id] = "";
            }
        });

        return initialState;
    };

    const [valores, setValores] = useState(getInitialState());

    // 👇 estados del DatePicker
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [currentDateField, setCurrentDateField] = useState(null);
    const [selectedDate, setSelectedDate] = useState(undefined);

    const actualizarValor = (campoId, valor) => {
        setValores(prev => ({
            ...prev,
            [campoId]: valor
        }));
    };

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
    };

    const abrirDatePicker = (campoId) => {
        setCurrentDateField(campoId);
        setOpenDatePicker(true);
    };

    const onConfirmDate = ({ date }) => {

        setOpenDatePicker(false);
        setSelectedDate(date);

        if (date && currentDateField) {
            actualizarValor(
                currentDateField,
                date.toLocaleDateString("es-ES")
            );
        }
    };

    const renderCampo = (campo) => {

        switch (campo.tipo) {

            case "texto":

                return (
                    <TextInput
                        style={styles.input}
                        placeholder={`Ingrese ${campo.etiqueta}`}
                        value={valores[campo.id]}
                        onChangeText={(texto) =>
                            actualizarValor(campo.id, texto)
                        }
                    />
                );

            case "boolean":

                return (
                    <View style={styles.switchContainer}>
                        <Switch
                            value={valores[campo.id]}
                            onValueChange={(valor) =>
                                actualizarValor(campo.id, valor)
                            }
                        />
                    </View>
                );

            case "fecha":

                return (
                    <>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => abrirDatePicker(campo.id)}
                        >
                            <Text
                                style={
                                    valores[campo.id]
                                        ? styles.dateText
                                        : styles.datePlaceholder
                                }
                            >
                                {valores[campo.id] || "Seleccionar fecha"}
                            </Text>
                        </TouchableOpacity>

                        <DatePickerModal
                            locale="es"
                            mode="single"
                            visible={openDatePicker}
                            date={selectedDate}
                            onDismiss={() => setOpenDatePicker(false)}
                            onConfirm={onConfirmDate}
                        />
                    </>
                );

            case "opciones":

                return (
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={valores[campo.id]}
                            onValueChange={(itemValue) =>
                                actualizarValor(campo.id, itemValue)
                            }
                        >
                            {campo.opciones?.map((opcion, index) => (
                                <Picker.Item
                                    key={index}
                                    label={opcion}
                                    value={opcion}
                                />
                            ))}
                        </Picker>
                    </View>
                );

            default:
                return null;
        }
    };

    return (

        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.title}>
                {plantilla.nombre}
            </Text>

            {plantilla.campos.map((campo) => (

                <View key={campo.id} style={styles.inputContainer}>

                    <Text style={styles.label}>
                        {campo.etiqueta}
                    </Text>

                    {renderCampo(campo)}

                </View>

            ))}

            <Button
                title="Guardar Orden"
                onPress={guardarOrdenHandler}
            />

        </ScrollView>
    );
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
    label: {
        marginBottom: 5,
        fontWeight: "bold",
        fontSize: 16
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#fff",
        justifyContent: "center"
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff"
    },
    dateText: {
        fontSize: 16,
        color: "#000"
    },
    datePlaceholder: {
        fontSize: 16,
        color: "#999"
    }
});