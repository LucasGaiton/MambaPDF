import { useState } from "react";
import { View, TextInput, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { guardarConfigPDF } from "../storage/storage";

export default function SettingsPDFScreen() {

    const [empresa, setEmpresa] = useState("")
    const [telefono, setTelefono] = useState("")
    const [logo, setLogo] = useState("")
    const [email, setEmail] = useState("")
    const [tecnico, setTecnico] = useState("")
    const [dire, setDire] = useState("")
    const [piePag, setPiePag] = useState("")


    const guardar = async () => {

        const config = {
            empresaNombre: empresa,
            empresaTelefono: telefono,
            empresaLogo: logo,
            empresaEmail: email,
            nombreTecnico: tecnico,
            empresaDireccion: dire,
            piePagina: piePag,
            tecnico:tecnico
        }

        await guardarConfigPDF(config)

    }
    const seleccionarLogo = async () => {

        const result = await ImagePicker.launchImageLibraryAsync({
            base64: true
        })
        if (!result.canceled) {

            setLogo(result.assets[0].base64)

        } else {
            setLogo(result)
        }



    }

    return (

        <View>

            <TextInput
                placeholder="Nombre empresa"
                value={empresa}
                onChangeText={setEmpresa}
            />

            <TextInput
                placeholder="Teléfono"
                value={telefono}
                onChangeText={setTelefono}
            />

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Nombre del tecnico"
                value={tecnico}
                onChangeText={setTecnico}
            />

            <TextInput
                placeholder="Dirección"
                value={dire}
                onChangeText={setDire}
            />

            <TextInput
                placeholder="Pie de pagina"
                value={piePag}
                onChangeText={setPiePag}
            />
            <Button
                title="Selecionar logo de la empresa"
                onPress={seleccionarLogo}
            />

            <Button
                title="Guardar configuración"
                onPress={guardar}
            />

        </View>

    )

}