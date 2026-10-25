import { StyleSheet, Text, View } from "react-native";


export default function Sidebar(){
    return(
        <View style={estilos.sidebar}>
            <Text style={estilos.logo}>+ BurnCare</Text>


            <Text style={estilos.identificacao}>
                CTQ · HOSPITAL UNIVERSITÁRIO
                </Text>

            <View style={estilos.menu}>
                <Text style={estilos.textoMenu}>Visão geral</Text>
                <Text style={estilos.textoMenu}>Novo Pedido</Text>
                <Text style={estilos.textoMenu}>Histórico de pedidos</Text>
                
            </View>
        </View>
        
    )
}
const estilos = StyleSheet.create({
    sidebar:{
        width:246,
        backgroundColor: "#18354B",
        padding: 20,
        minHeight:"100%"
    },
    logo:{
        color:"#ffffff",
        fontSize:24,
        fontWeight:"bold",
        marginBottom:12
    },

    identificacao: {
        color: "#b5d2da",
        fontSize: 11,
        marginBottom: 35
    },

    menu: {
        gap: 20
    },
    textoMenu:{
        fontWeight:"bold",
        color:"#ffffff"
    }
})