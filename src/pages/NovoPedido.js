

import { View, Text, StyleSheet} from "react-native";

export default function NovoPedido(){
    return(
        <View style={estilos.container}>
            
        
            <View>
                <Text style={estilos.titulo}>Novo Pedido de Malha</Text>
            </View>

        
            <View style={estilos.formulario}>
                
                <Text style={estilos.tituloFormulario}>Prescrição médica e identificação</Text>
                

                
            </View>
        
            
            
        </View>
    )
}
const estilos = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#f4f8fa",
        padding: 24
    },
    titulo:{
        fontSize:28,
        fontWeight:"bold",
        color: "#203449"
    },
    cabecalho:{
        marginBottom:20
    },
    formulario:{
        backgroundColor:"#ffffff",
        padding:24,
        borderRadius:12,
        marginTop:20
    },
    tituloFormulario:{
        fontSize:20,
        fontWeight:"bold",
        color:"#203449",
        marginBottom:20
    }
})