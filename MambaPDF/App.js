import React from "react";
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from "@react-navigation/native";
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


import { View } from "react-native-web";

const Stack = createNativeStackNavigator();
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

      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: "Gestor de órdenes" }}
          />

          <Stack.Screen
            name="CrearPlantilla"
            component={TemplateCreator}
          />
          <Stack.Screen
            name="CrearOrden"
            component={WorkOrderFormScreen}
            initialParams={{ plantilla: plantillaDemo }}
          />

          <Stack.Screen
            name="Historial"
            component={HistoyOrders}
          />

          <Stack.Screen
            name="DetalleOrden"
            component={OrderDetail}
          />

          <Stack.Screen
            name="SeleccionarPlantilla"
            component={SelectTemplate}
          />

        </Stack.Navigator>
      </NavigationContainer>


    </PaperProvider>

  );
}
