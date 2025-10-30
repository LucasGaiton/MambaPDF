import AsyncStorage from '@react-native-async-storage/async-storage';

export  const guardarPlantilla = async (id, data) =>{
    try{
        await AsyncStorage.setItem(`^@plantilla${id}`, JSON.stringify(data))
    }
    catch(error){
        console.log("Error al crear la plantilla: ", error );
    }
}
export const leerPlantilla = async(id) =>{
    try{
        const jsonData = await AsyncStorage.getItem(`@plantilla${id}`);
        return jsonData != null  ? JSON.parse(jsonData) : null;

    }catch(error){
        console.log("Error al leer la plantilla: ",error);
        
    }
}

export const listarPlantillas = async() => {
    try {
        
        
    } catch (error) {
        
    }
}