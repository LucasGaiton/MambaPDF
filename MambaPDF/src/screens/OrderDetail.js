/**
 * -----------------------------------------------------------------------------
 * OrderDetail.jsx
 * -----------------------------------------------------------------------------
 * Pantalla encargada de visualizar el detalle completo de una orden de trabajo.
 *
 * Funcionalidades principales:
 * - Mostrar la información general de la orden.
 * - Visualizar todas las secciones y campos pertenecientes a la plantilla.
 * - Editar una orden existente.
 * - Generar un documento PDF utilizando la información almacenada.
 *
 * La generación del PDF se delega al servicio pdfService, el cual se encarga
 * de construir el documento utilizando la configuración personalizada del
 * usuario.
 * -----------------------------------------------------------------------------
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { pdfService } from "../services/pdfService";

/**
 * -----------------------------------------------------------------------------
 * OrderDetail
 * -----------------------------------------------------------------------------
 * Pantalla encargada de mostrar el contenido completo de una orden.
 *
 * Además de visualizar la información, permite:
 * - Editar la orden.
 * - Generar un PDF utilizando la plantilla correspondiente.
 *
 * @param {Object} route Parámetros recibidos mediante React Navigation.
 * @param {Object} navigation Objeto de navegación.
 *
 * @returns {JSX.Element}
 * -----------------------------------------------------------------------------
 */
export default function OrderDetail({ route, navigation }) {

  /**
   * -------------------------------------------------------------------------
   * Datos recibidos desde la pantalla anterior.
   *
   * orden:
   *      Contiene toda la información ingresada por el usuario.
   *
   * plantilla:
   *      Define la estructura utilizada para mostrar los datos.
   * -------------------------------------------------------------------------
   */
  const { orden, plantilla } = route.params;

  /**
   * -------------------------------------------------------------------------
   * Genera el documento PDF correspondiente a la orden.
   *
   * La generación se delega completamente al servicio pdfService,
   * enviándole la orden y la plantilla utilizada.
   *
   * @returns {Promise<void>}
   * -------------------------------------------------------------------------
   */
  const generar = async () => {

    console.log("Lo hace");

    await pdfService({

      orden,
      plantilla,

    });

  };

  return (

    <ScrollView contentContainerStyle={styles.container}>

      {/*--------------------------------------------------------------
          Información general de la orden
      --------------------------------------------------------------*/}
      <View style={styles.infoBox}>

        <Text style={styles.infoText}>
          ID: {orden.id}
        </Text>

        <Text style={styles.infoText}>
          Fecha: {new Date(orden.fechaCreacion).toLocaleString()}
        </Text>

      </View>

      {/*--------------------------------------------------------------
          Botón para editar la orden seleccionada
      --------------------------------------------------------------*/}
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

      {/*--------------------------------------------------------------
          Renderizado dinámico de las secciones de la plantilla
      --------------------------------------------------------------*/}
      {plantilla.secciones.map((seccion) => (

        <View
          key={seccion.id}
          style={styles.seccionContainer}
        >

          <Text style={styles.seccionTitulo}>
            {seccion.titulo}
          </Text>

          {/*----------------------------------------------------------
              Renderizado dinámico de los campos de la sección
          ----------------------------------------------------------*/}
          {seccion.campos.map((campo) => {

            /**
             * Valor almacenado para el campo.
             * Si no existe información, se muestra "-".
             */
            let valor = orden.valores[campo.id] ?? "-";

            /**
             * Determina si el contenido es suficientemente largo como para
             * cambiar la disposición horizontal por una vertical.
             */
            const esLargo = valor.length > 35;

            /**
             * Conversión de valores booleanos a un formato legible.
             */
            if (campo.tipo === "boolean") {

              valor = valor ? "Sí" : "No";

            }

            return (

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

            );

          })}

        </View>

      ))}

      {/*--------------------------------------------------------------
          Botón para generar el PDF de la orden
      --------------------------------------------------------------*/}
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

/**
 * -----------------------------------------------------------------------------
 * Estilos de la pantalla.
 *
 * Define la apariencia visual de:
 * - Contenedor principal.
 * - Información general de la orden.
 * - Secciones.
 * - Campos.
 * - Botones de edición.
 * - Botón de generación de PDF.
 * -----------------------------------------------------------------------------
 */
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