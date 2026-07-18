import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { obtenerConfigPDF } from "../storage/storage";
import { Ionicons } from "@expo/vector-icons";
import { Paths, Directory, File } from 'expo-file-system';
import { pdfService } from "../services/pdfService";

export default function OrderDetail({ route, navigation }) {

  const { orden, plantilla } = route.params;

  const generar = async () => {
    console.log("Lo hace");

    await pdfService({
      orden,
      plantilla,
    });

  }


  return (

    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.infoBox}>

        <Text style={styles.infoText}>
          ID: {orden.id}
        </Text>

        <Text style={styles.infoText}>
          Fecha: {new Date(orden.fechaCreacion).toLocaleString()}
        </Text>

      </View>
      <TouchableOpacity
        style={styles.botonEditar}
        onPress={() =>
          navigation.navigate("Crear Orden", {
            plantilla,
            orden,
          })
        }
      >
        <Ionicons
          name="create-outline"
          size={18}
          color="#8B6734"
        />

        <Text style={styles.botonEditarTexto}>
          Editar Orden
        </Text>
      </TouchableOpacity>

      {plantilla.secciones.map((seccion) => (

        <View key={seccion.id} style={styles.seccionContainer}>

          <Text style={styles.seccionTitulo}>
            {seccion.titulo}
          </Text>

          {seccion.campos.map((campo) => {

            let valor = orden.valores[campo.id] ?? "-";
            const esLargo = valor.length > 35;

            if (campo.tipo === "boolean") {
              valor = valor ? "Sí" : "No";
            } 




            return (
              (

                <View
                  key={campo.id}
                  style={[
                    styles.campoRow,
                    esLargo && styles.campoRowVertical
                  ]}
                >
                  <Text style={styles.campoLabel}>
                    {campo.etiqueta}
                  </Text>

                  <Text style={styles.campoValor}>
                    {valor}
                  </Text>
                </View>

              )
            )

          })}

        </View>

      ))}

      <TouchableOpacity
        style={styles.botonPDF}
        onPress={generar}
      >
        <Text style={styles.botonTexto}>
          Generar PDF
        </Text>
      </TouchableOpacity>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    minHeight: "100%",
    padding: 20,
    backgroundColor: "#F6F3EF"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#8B6734",
    marginBottom: 20,
    textAlign: "center"
  },

  infoBox: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },

  infoText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 5
  },

  seccionContainer: {
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 10,
    borderLeftWidth: 6,
    borderLeftColor: "#E1890A",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },

  seccionTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B67A26",
    marginBottom: 10
  },

  campoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  campoRowVertical: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  campoLabel: {
    fontWeight: "600",
    color: "#333",
  },

  campoValor: {
    color: "#555",
    marginTop: 4,
    lineHeight: 22,
  },

  botonPDF: {
    backgroundColor: "#E1890A",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20
  },

  botonTexto: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },
  botonEditar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FFF8ED",
    borderWidth: 1,
    borderColor: "#E8C68B",

    paddingVertical: 12,
    borderRadius: 8,

    marginBottom: 25,
  },

  botonEditarTexto: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#8B6734",
  },


});