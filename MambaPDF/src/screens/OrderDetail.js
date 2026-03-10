import React from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

export default function OrderDetail({ route }) {

  const { orden } = route.params;
  const generarPDF = async () => {

    const contenidoHTML = `
<html>
<head>
<meta charset="UTF-8">

<style>

body{
font-family: Arial;
padding:40px;
color:#333;
}

.header{
text-align:center;
margin-bottom:30px;
}

.titulo{
font-size:28px;
font-weight:bold;
margin-bottom:5px;
}

.subtitulo{
font-size:14px;
color:#666;
}

.info{
margin-bottom:25px;
}

.tabla{
width:100%;
border-collapse:collapse;
margin-top:10px;
}

.tabla th{
background:#f2f2f2;
border:1px solid #ccc;
padding:10px;
text-align:left;
}

.tabla td{
border:1px solid #ccc;
padding:10px;
}

.firmas{
margin-top:80px;
width:100%;
}

.firma{
width:45%;
text-align:center;
display:inline-block;
}

.linea{
margin-top:60px;
border-top:1px solid black;
}

</style>

</head>

<body>

<div class="header">

<div class="titulo">ORDEN DE TRABAJO</div>

<div class="subtitulo">
${orden.plantillaId}
</div>

</div>


<div class="info">

<p><strong>ID:</strong> ${orden.id}</p>

<p><strong>Fecha:</strong> ${new Date(
      orden.fechaCreacion
    ).toLocaleString()}</p>

</div>


<table class="tabla">

<tr>
<th>Campo</th>
<th>Valor</th>
</tr>

${Object.entries(orden.valores)
        .map(
          ([campo, valor]) => `
<tr>
<td>${campo}</td>
<td>${valor}</td>
</tr>
`
        )
        .join("")}

</table>


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

</body>
</html>
`;

    if (Platform.OS === "web") {

      const ventana = window.open("", "_blank");

      ventana.document.write(contenidoHTML);
      ventana.document.close();

      ventana.focus();
      ventana.print();

    }

    else {

      const { uri } = await Print.printToFileAsync({
        html: contenidoHTML,
      });

      await Sharing.shareAsync(uri);

    }
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