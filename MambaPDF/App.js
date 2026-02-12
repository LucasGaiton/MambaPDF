import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { listarPlantillas, leerPlantilla, guardarPlantilla } from './src/storage/storage';
import { useEffect } from 'react';
import TemplateCreator from './src/screens/TemplateCreator';
import WorkOrderFormScreen from './src/screens/WorkOrdeFormScreen';
import OrderListScreen from './src/screens/OrderListScreen';
export default function App() {
 const plantillaDemo = {
    nombre: "Orden de prueba",
    campos: [
      { id: "cliente", etiqueta: "Cliente", tipo: "texto" },
      { id: "fecha", etiqueta: "Fecha", tipo: "texto" },
      { id: "descripcion", etiqueta: "Descripción", tipo: "texto" }
    ]
  };

  return (
    <View>
      <WorkOrderFormScreen plantilla={plantillaDemo}/>
      <OrderListScreen></OrderListScreen>
    </View>

  );
}

