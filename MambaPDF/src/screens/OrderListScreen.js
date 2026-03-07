import { useEffect, useState } from "react";
import { listarOrdenes } from "../storage/storage"
import { Text, View, Button } from "react-native-web"
export default function OrderListScreen() {
    useEffect(() => {
        lista()
    }, [])
    const [ordenes, setOrdenes] = useState([])

    const lista = async () => {
        let ordenes = await listarOrdenes();
        console.log(ordenes);
        setOrdenes(ordenes || [])


    }


    return (
        <View>
            <Text>Ordenes Realizadas2.0 :
            </Text>
            {ordenes.map((orden) => (
                <Text key={orden.id}>
                    {orden.id}
                </Text>
            ))}
            <Button title="Actualizar" onPress={lista} />


        </View>

    )
}