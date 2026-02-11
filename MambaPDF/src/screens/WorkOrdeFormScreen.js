import { useState } from "react"
import { ScrollView } from "react-native-web"

export default function WorkOrderFormScreen({plantilla}){
    const [valores,setValores] = useState({})
    
    const actualizarValor = (campoId, valor)=>{
        setValores({
            ...valores,
            [campoId]:valor

        })
    }
    const guardarOrden = ()=>{
        console.log("Orden generada:", valores);
        alert("se guardo la orden, puede revisar la consola si lo desea")
    }

    return(
    <ScrollView>


    </ScrollView>
)
}