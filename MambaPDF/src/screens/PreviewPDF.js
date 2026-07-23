import React from "react";
import { View, StyleSheet } from "react-native";
import Pdf from "react-native-pdf";

export function PreviewPDF({ route }) {

    const { pdfUri } = route.params;

    return (

        <View style={styles.container}>

            <Pdf
                source={{ uri: pdfUri }}
                style={styles.pdf}
                trustAllCerts={false}
            />

        </View>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F6F3EF"
    },

    pdf: {
        flex: 1,
        width: "100%"
    }

});