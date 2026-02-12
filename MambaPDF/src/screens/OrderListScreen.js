import { listarOrdenes } from "../storage/storage"
import { Text } from "react-native-web"
export default function OrderListScreen() {

    const lista = async () => {
        await console.log(listarOrdenes());

    }
    lista()

    return (
        <Text>Ordenes Realizadas :
        </Text>


    )
}