import { listarOrdenes } from "../storage/storage"
import { Text } from "react-native-web"
export default function OrderListScreen() {
    
    const lista = async () => {
        let ordenes = await listarOrdenes();
        console.log(ordenes.length);
        

    }
    lista()

    return (
        <Text>Ordenes Realizadas2.0 :
        </Text>


    )
}