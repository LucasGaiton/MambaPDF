import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { obtenerConfigPDF } from "../storage/storage";
import { Ionicons } from "@expo/vector-icons";
import { Paths, Directory, File } from 'expo-file-system';


/**
 * -----------------------------------------------------------------------------
 * pdfService.js
 * -----------------------------------------------------------------------------
 * Servicio encargado de la generación de documentos PDF dentro de la aplicación.
 *
 * Este módulo concentra toda la lógica necesaria para:
 *
 * • Construir el HTML del documento.
 * • Obtener la configuración personalizada del PDF.
 * • Generar el archivo PDF utilizando Expo Print.
 * • Compartir el documento en Android/iOS.
 * • Imprimir el documento desde la versión Web.
 * • Generar únicamente el archivo PDF cuando se necesita una vista previa.
 *
 * El servicio está compuesto por tres funciones principales:
 *
 * • pdfService()       → Genera y comparte/imprime un PDF.
 * • generarHTMLPDF()  → Construye el HTML del documento.
 * • generarPDF()      → Devuelve únicamente la URI del PDF generado.
 * -----------------------------------------------------------------------------
 */






/**
 * -----------------------------------------------------------------------------
 * Genera un documento PDF utilizando la configuración almacenada por el usuario.
 *
 * Flujo de trabajo:
 *
 * 1. Obtiene la configuración personalizada del PDF.
 * 2. Construye el HTML del documento.
 * 3. Si la aplicación se ejecuta en Web:
 *      - Abre una nueva pestaña.
 *      - Inserta el HTML.
 *      - Envía el documento a impresión.
 *
 * 4. Si la aplicación se ejecuta en Android o iOS:
 *      - Genera el PDF.
 *      - Lo mueve al directorio de documentos.
 *      - Reemplaza un archivo existente si fuera necesario.
 *      - Abre el menú para compartir el documento.
 *
 * @async
 *
 * @param {Object} parametros
 * @param {Object} parametros.orden Orden de trabajo.
 * @param {Object} parametros.plantilla Plantilla utilizada para construir el PDF.
 *
 * @returns {Promise<void>}
 * -----------------------------------------------------------------------------
 */

export async function pdfService({ orden, plantilla }) {


    const config = await obtenerConfigPDF();

    const html = generarHTMLPDF(
        config,
        orden,
        plantilla,
    );
    console.log("watermark:", config.waterMark);
      console.log("Ocultar firmas", config.ocultarFirmasS);



    if (Platform.OS === "web") {
        const ventana = window.open("", "_blank");
        ventana.document.write(html);
        ventana.document.close();
        ventana.focus();
        ventana.print();
    } else {

        const { uri } = await Print.printToFileAsync({
            html: html,
        });
        const nombreArchivo =
            `${config.empresaNombre}_${orden.nombre}.pdf`;

        // 1. Creamos la referencia al archivo temporal (origen)
        const archivoOrigen = new File(uri);

        // 2. Creamos la referencia al destino usando la clase File y Paths.document
        const archivoDestino = new File(Paths.document.uri + nombreArchivo);
        if (archivoDestino.exists) {

            // 2. Eliminación manual
            archivoDestino.delete();
        }

        try {
            // Ahora puedes mover el nuevo archivo sin temor a conflictos
            await archivoOrigen.move(archivoDestino);
            // 4. Compartimos usando la propiedad .uri del destino
            await Sharing.shareAsync(archivoDestino.uri);
            console.log("Se genera el pdf");

        } catch (error) {
            console.log("Error al mover:", error);
        }


    }
}

/**
 * -----------------------------------------------------------------------------
 * Construye dinámicamente el código HTML utilizado para generar el PDF.
 *
 * El documento incorpora:
 *
 * • Encabezado con información de la empresa.
 * • Logo corporativo.
 * • Marca de agua (opcional).
 * • Secciones dinámicas de la plantilla.
 * • Información cargada en la orden.
 * • Firmas (opcionales).
 * • Pie de página.
 *
 * Todo el contenido es generado utilizando la plantilla seleccionada y los valores ingresados por el usuario.
 *
 * @param {Object} config Configuración del PDF.
 * @param {Object} orden Orden de trabajo.
 * @param {Object} plantilla Plantilla utilizada.
 *
 * @returns {string} Documento HTML listo para imprimir.
 * -----------------------------------------------------------------------------
 */
export function generarHTMLPDF(config, orden, plantilla) {

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
                        (campo) => {
                            let valor = orden.valores[campo.id]
                            console.log("Este es el valor", valor);

                            if (valor == true) valor = "Si"
                            else if (valor == false) valor = "No"

                            return (`
            <tr>
              <td class="campo">${campo.etiqueta}</td>
              <td>${valor || ""}</td>
            </tr>
          `)
                        }
                    )
                    .join("")}

        </table>

      </div>
    `
        )
        .join("");

        console.log("Este es el ocultar firmas", config?.ocultarFirmas);
        
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

${config?.waterMark === true
            ? `
        <div class="watermark">
            ${config?.empresaLogo
                ? `<img src="data:image/png;base64,${config.empresaLogo}" />`
                : ""
            }
        </div>
        `
            : ""
        }

<div class="contenido">

<!-- HEADER -->

<div class="header">

<div>

${config?.empresaLogo
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

${config?.ocultarFirmas === false
            ? `
        <div class="firmas">

<div class="firma">

<div>

${config?.firma
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
        `
            : ""
        }


<!-- FOOTER -->

<div class="footer">
${config?.piePagina || ""}
</div>

</div>

</body>
</html>
        `


    return contenidoHTML;

}

/**
 * -----------------------------------------------------------------------------
 * Genera un archivo PDF y devuelve únicamente su URI.
 *
 * Esta función se utiliza para la vista previa del documento, ya que solamente
 * necesita generar el archivo sin compartirlo ni imprimirlo.
 *
 * @async
 *
 * @param {Object} config Configuración del PDF.
 * @param {Object} orden Orden de trabajo.
 * @param {Object} plantilla Plantilla utilizada.
 *
 * @returns {Promise<string>} URI del archivo PDF generado.
 * -----------------------------------------------------------------------------
 */
export async function generarPDF(config, orden, plantilla) {

    const html = generarHTMLPDF(config, orden, plantilla);

    const { uri } = await Print.printToFileAsync({
        html,
    });

    return uri;
}