import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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

    const contenidoHTML =
      `
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
padding: 20px, 40px;
color: #333;
height: 100vh;
margin: 0;
box-sizing: border-box;
}

.watermark {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  pointer-events: none;
  z-index: 0;
}

.watermark img {
  width: 500px;
  opacity: 0.08;
}

.contenido {
  position: relative;
  z-index: 1;
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
}

.subtitulo {
text-align: center;
font-size: 14px;
color: #666;
margin-bottom: 0px;
}

.info {
margin-bottom: 25px;
}

/* SECCIONES */

.secciones {
margin-top:25px;
}

.seccionTitulo {
padding: 8px;
font-size: 18px;
margin-top: 5px;
margin-bottom: 0px
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
display:flex;
flex-direction: column;
justify-content: end;
ailign-items: center;
width: 40%;
text-align: center;
}

.linea {
margin-top: 60px;
border-top: 1px solid black;
}

.lineaFirma{
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

<div class="watermark">

    ${
      config?.empresaLogo
        ? `<img src="data:image/png;base64,${config.empresaLogo}" />`
        : ""
    }

  </div>

<div class="contenido">

<!-- HEADER -->

<div class="header">

<div>

${ config?.empresaLogo
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

<div>

${ config?.firma
? `<img class="logo" src="data:image/png;base64,${config.firma}" />`
: ""
}

</div>

<div>

<div class="lineaFirma"></div>
Entregado por

</div>

</div>

<div class="firma">

<div class="logo"></div>

<div class="linea"></div>

Recibí conforme

</div>

</div>

<!-- FOOTER -->

<div class="footer">
${config?.piePagina || ""}
</div>

</div>

</body>
</html>
    `

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

    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.infoBox}>

        <Text style={styles.infoText}>
          ID: {orden.id}
        </Text>

        <Text style={styles.infoText}>
          Fecha: {new Date(orden.fechaCreacion).toLocaleString()}
        </Text>

      </View>

      {plantilla.secciones.map((seccion) => (

        <View key={seccion.id} style={styles.seccionContainer}>

          <Text style={styles.seccionTitulo}>
            {seccion.titulo}
          </Text>

          {seccion.campos.map((campo) => (

            <View key={campo.id} style={styles.campoRow}>

              <Text style={styles.campoLabel}>
                {campo.etiqueta}
              </Text>

              <Text style={styles.campoValor}>
                {orden.valores[campo.id] || "-"}
              </Text>

            </View>

          ))}

        </View>

      ))}

      <TouchableOpacity
        style={styles.botonPDF}
        onPress={generarPDF}
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
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingVertical: 6
  },

  campoLabel: {
    fontWeight: "600",
    color: "#333"
  },

  campoValor: {
    color: "#555"
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
  }

});