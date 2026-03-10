import React from "react";
import { View, Button, StyleSheet } from "react-native";
export default function Home({ navigation }) {

    return (
        <View style={styles.container}>

            <Button
                title="Crear plantilla"
                onPress={() => navigation.navigate("CrearPlantilla")}
            />

            <Button
                title="Seleccionar plantilla"
                onPress={() => navigation.navigate("SeleccionarPlantilla")}
            />

            <Button
                title="Historial de órdenes"
                onPress={() => navigation.navigate("Historial")}
            />

            <Button
                title="Configuración de empresa"
                onPress={() => navigation.navigate("Configurar PDF")}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        gap: 20,
        padding: 30
    }
});