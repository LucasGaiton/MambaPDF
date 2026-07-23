import React from "react";
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Crear Ordenes 
import WorkOrderFormScreen from './src/screens/WorkOrdeFormScreen';
//Listar ordenes
import OrderListScreen from './src/screens/OrderListScreen';
//Listar ordenes 
import HistoyOrders from './src/screens/HistoryOrders';
//Detalle de ordenes 
import OrderDetail from "./src/screens/OrderDetail";
//Inicio
import Home from "./src/screens/Home";

import TemplateCreator from "./src/screens/TemplateCreator";

import SelectTemplate from "./src/screens/SelectTemplate";

import SettingsPDFScreen from "./src/screens/SettingsPDFScreen";
import { PreviewPDF } from "./src/screens/PreviewPDF";

const Stack = createNativeStackNavigator();

// Tonos de la app (de Home.js)
// #B67A26
// #8B6734
// #E1890A
// #614E34
// #363026
// #33302D

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#33302D', // Color de fondo principal
    card: '#614E34',       // Color para headers y otros elementos tipo "tarjeta"
    text: '#FFFFFF',       // Color de texto principal
    primary: '#E1890A',     // Color de acento (botones, links, etc.)
    border: '#614E34',      // Color de bordes
  },
};

export default function App() {
  const plantillaDemo = {
    nombre: "Orden de prueba",
    campos: [
      { id: "cliente", etiqueta: "Perro", tipo: "texto" },
      { id: "fecha", etiqueta: "Fecha", tipo: "texto" },
      { id: "descripcion", etiqueta: "Descripción", tipo: "texto" }
    ]
  };

  return (
    <PaperProvider>
      <NavigationContainer theme={AppTheme}>
        <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: AppTheme.colors.card,
          },
          headerTintColor: AppTheme.colors.text,
        }}
        >
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: "Gestor de órdenes" }}
          />

          <Stack.Screen
            name="Crear Plantilla"
            component={TemplateCreator}
          />
          <Stack.Screen
            name="Crear Orden"
            component={WorkOrderFormScreen}
            initialParams={{ plantilla: plantillaDemo }}
          />

          <Stack.Screen
            name="Ordenes guardadas"
            component={HistoyOrders}
          />

          <Stack.Screen
            name="Detalle Orden"
            component={OrderDetail}
          />

          <Stack.Screen
            name="Seleccionar Plantilla"
            component={SelectTemplate}
          />

          <Stack.Screen
            name="Configurar PDF"
            component={SettingsPDFScreen}
          />
          <Stack.Screen
            name="Preview PDF"
            component={PreviewPDF}
          />


        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
