import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { listarPlantillas, leerPlantilla, guardarPlantilla } from './src/storage/storage';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const test = async () => {
      let plantilla = {
        id: "tp1_001",
        nombre: "mantenimiento basico",
        campos: [{ id: "cliente", etiqueta: "cliente", tipo: "texto" }]
      }
      await guardarPlantilla(plantilla.id, plantilla)
      const recuperada = await leerPlantilla("tp1_001")
      console.log("Plantilla recuperada", recuperada)

    }
    test()
  }, [])

  return (
    <View style={styles.container}>
      <Text>App de Órdenes de Trabajo 🧾</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
