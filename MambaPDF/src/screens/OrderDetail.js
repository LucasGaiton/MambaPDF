import React from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function OrderDetail({ route }) {

    const { orden } = route.params;
    const generarPDF = async () => {

        const contenidoHTML = `
  <html>
  <head>
    <style>
      body {
        font-family: Arial;
        padding: 90px;
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
      }

      .titulo {
        font-size: 26px;
        font-weight: bold;
      }

      .info {
        margin-bottom: 20px;
      }

      .tabla {
        width: 100%;
        border-collapse: collapse;
      }

      .tabla td {
        border: 1px solid #ccc;
        padding: 10px;
      }

      .campo {
        font-weight: bold;
        width: 30%;
      }

      .firmas {
        margin-top: 60px;
        display: flex;
        justify-content: space-between;
      }

      .firma {
        width: 40%;
        text-align: center;
      }

      .linea {
        border-top: 1px solid black;
        margin-top: 40px;
      }
    </style>
  </head>

  <body>

    <div class="header">
      <div class="titulo">Hola que hace</div>
    </div>

    <div class="info">
      <p><strong>ID:</strong> ${orden.id}</p>
      <p><strong>Fecha:</strong> ${new Date(
            orden.fechaCreacion
        ).toLocaleString()}</p>
    </div>

    <table class="tabla">

      ${Object.entries(orden.valores)
                .map(
                    ([campo, valor]) => `
          <tr>
            <td class="campo">${campo}</td>
            <td>${valor}</td>
          </tr>
        `
                )
                .join("")}

    </table>
    <table style="width:100%; margin-top:80px; text-align:center;">
    <tr>
        <td style="width:50%;">
        <div style="border-top:1px solid black; margin-top:40px;"></div>
        Técnico
        </td>

        <td style="width:50%;">
        <div style="border-top:1px solid black; margin-top:40px;"></div>
        Cliente
        </td>
    </tr>
    </table>
  

  </body>
  </html>
  `;

        const { uri } = await Print.printToFileAsync({
            html: contenidoHTML,
        });

        await Sharing.shareAsync(uri);
    };

    return (
        <View style={{ padding: 20 }}>

            <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                {orden.plantillaId}
            </Text>

            <Text>ID: {orden.id}</Text>

            <Text>
                Fecha: {new Date(orden.fechaCreacion).toLocaleString()}
            </Text>

            {Object.entries(orden.valores).map(([campo, valor]) => (
                <Text key={campo}>
                    {campo}: {valor}
                </Text>
            ))}

            <Button
                title="Generar PDF"
                onPress={generarPDF}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10
    },
    subtitulo: {
        marginTop: 20,
        fontWeight: "bold"
    }
});