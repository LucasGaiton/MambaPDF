import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { listarPlantillas, leerPlantilla, guardarPlantilla } from './src/storage/storage';
import { useEffect } from 'react';
import TemplateCreator from './src/screens/TemplateCreator';

export default function App() {
 

  return (
    <TemplateCreator/>
  );
}

