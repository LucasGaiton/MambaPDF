import React, { useEffect, useState } from "react";
import { Button, View, Text, StyleSheet, ScrollView } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { obtenerConfigPDF } from "../storage/storage";

export default function OrderDetail({ route }) {

  const { orden, plantilla } = route.params;

  const [config, setConfig] = useState({});

  useEffect(() => {
    getConfig();
  }, []);

  const getConfig = async () => {

    const data = await obtenerConfigPDF();
    setConfig(data || {});

  };

  const generarPDF = async () => {

    const seccionesHTML = plantilla.secciones
      .map(
        (seccion) => `

      <div class="seccion">

        <h3 class="seccionTitulo">
          ${seccion.titulo}
        </h3>

        <table class="tabla">

          ${seccion.campos
            .map(
              (campo) => `
            <tr>
              <td class="campo">${campo.etiqueta}</td>
              <td>${orden.valores[campo.id] || ""}</td>
            </tr>
          `
            )
            .join("")}

        </table>

      </div>
    `
      )
      .join("");

    const contenidoHTML = `
    <!DOCTYPE html>
<html>

<head>

  <meta charset="UTF-8">

  <style>

    @page {
      size: A4;
      margin: 10mm;
    }

    body {
      font-family: Arial;
      padding: 40px;
      color: #333;
      height: 100px
      }
    
    /* HEADER */

    .header {
      display: flex;
      justify-content: space-between 
    }

    .logo {
      width: 150px;
    }

    .empresa {
      margin-top: 5px;
      text-align: right;
    }

    .empresaNombre {
      font-size: 20px;
      font-weight: bold;
    }

    .empresaTelefono {
      font-size: 14px;
      color: #555;
    }

    .empresaEmail {
      font-size: 13px;
      color: #555;
    }

    .empresaDireccion {
      font-size: 13px;
      color: #555;
    }

    /* TITULOS */

    .titulo {
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      margin-top: 20px;
    }

    .subtitulo {
      text-align: center;
      font-size: 14px;
      color: #666;
      margin-bottom: 30px;
    }

    .info {
      margin-bottom: 25px;
    }

    /* SECCIONES */

    .seccion {
      margin-top: 25px;
    }

    .seccionTitulo {
      background: #f2f2f2;
      padding: 10px;
      font-size: 16px;
      margin-bottom:3px;
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
      width: 40%;
      background: #fafafa;
    }

    /* FIRMAS */

    .firmas {
      margin-top: 80px;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .firma {
      width: 40%;
      text-align: center;
    }

    .linea {
      margin-top: 60px;
      border-top: 1px solid black;
    }

    /* FOOTER */

    .footer {
      margin-top: 60px;
      border-top: 1px solid #ddd;
      padding-top: 10px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }

  </style>

</head>

<body>

  <!-- HEADER -->

  <div class="header">

    <div>
      ${
        config?.empresaLogo
          ? `<img class="logo" src="data:image/png;base64,${config.empresaLogo}" />`
          : ""
      }
    </div>

    <div class="empresa">

      <div class="empresaNombre">
        ${config?.empresaNombre || ""}
      </div>

      <div class="empresaTelefono">
        ${config?.tecnico || ""}
      </div>

      <div class="empresaTelefono">
        Tel: ${config?.empresaTelefono || ""}
      </div>

      <div class="empresaEmail">
        ${config?.empresaEmail || ""}
      </div>

      <div class="empresaDireccion">
        ${config?.empresaDireccion || ""}
      </div>

    </div>

  </div>

  <!-- TITULO -->

  <div class="titulo">
    ORDEN DE TRABAJO
  </div>

  <div class="subtitulo">
    ${orden.plantillaId}
  </div>

  <!-- SECCIONES DINAMICAS -->
  <div class="secciones">
  ${seccionesHTML}
  
  </div>


  <!-- FIRMAS -->

  <div class="firmas">

    <div class="firma">
      <div class="linea"></div>
      Técnico
    </div>

    <div class="firma">
      <div class="linea"></div>
      Cliente
    </div>

  </div>

  <!-- FOOTER -->

  <div class="footer">
    ${config?.piePagina || ""}
  </div>

</body>

</html>
    
    
    
    
    
    
    `;

    if (Platform.OS === "web") {

      const ventana = window.open("", "_blank");

      ventana.document.write(contenidoHTML);
      ventana.document.close();

      ventana.focus();
      ventana.print();

    } else {

      const { uri } = await Print.printToFileAsync({
        html: contenidoHTML,
      });

      await Sharing.shareAsync(uri);

    }

  };

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.titulo}>
        {orden.plantillaId}
      </Text>

      <Text>ID: {orden.id}</Text>

      <Text>
        Fecha: {new Date(orden.fechaCreacion).toLocaleString()}
      </Text>

      {plantilla.secciones.map((seccion) => (

        <View key={seccion.id}>

          <Text style={styles.subtitulo}>
            {seccion.titulo}
          </Text>

          {seccion.campos.map((campo) => (

            <Text key={campo.id}>
              {campo.etiqueta}: {orden.valores[campo.id]}
            </Text>

          ))}

        </View>

      ))}

      <Button
        title="Generar PDF"
        onPress={generarPDF}
      />

    </ScrollView>

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