import React, {useState,useEffect} from "react";
import { TouchableOpacity, ScrollView, View, Text, TextInput, Image, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ip from './global'


export default function InicioScreen() {
    const direccion = ip();
    const [nombre, setNombre] = useState("");
    const navigation = useNavigation();
    const [categoria, setCategoria]=useState([]);

    useEffect(() => {
    async function cargarNombre() {
      const nombreGuardado = await AsyncStorage.getItem("nombre");
      if (nombreGuardado) {
        setNombre(nombreGuardado);
      }
    }
    async function consulta() {
        fetch(`http://${direccion}/moviles/Select.php`)
        .then(res => res.json())
        .then(data => {
            setCategoria(data);
        })
    }
    cargarNombre();
    consulta();
  },);

  function saludoSegunHora() {
  const hora = new Date().getHours();
  if (hora < 12) return "Buenos días";
  if (hora < 18) return "Buenas tardes";
  return "Buenas noches";
}
  return (
    <ImageBackground source={require("../assets/FondoPantallas.png")} style={styles.background} imageStyle={styles.backgroundImage}>
    
    <View style={styles.Saludo}>
        <Image source={require("../assets/usuario.png")} style={styles.ImgSaludo}/>
        <Text style={styles.TextSaludo}>{saludoSegunHora()}</Text>
        <Text style={[styles.TextSaludo,{paddingBlock:0, bottom:15}]}>{nombre}</Text>
    </View> 
    <View style={styles.InputContenedor}>
        <Image source={require("../assets/busqueda.png")} style={styles.icon}/>
        <TextInput placeholder="Buscar" style={styles.input} placeholderTextColor="#999"/>
    </View>
    <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
    <View style={styles.contenido}>
        {categoria.map(cat =>(
        <View key={cat.id} style={styles.Etiqueta}>
            <View style={styles.TitulosEti}>
                <Text style={styles.DesTitulo}>{cat.nombre}</Text>
                <Text style={styles.vermas}>Ver más</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.ContHorizon}>
                <TouchableOpacity style={styles.ImgContenedor}onPress={() => navigation.navigate("InfoComidas")} >
                    <Image style={styles.ImgCon}source={require("../assets/ImgPrueba.png")}/>
                    <View style={styles.info}>
                        <Text style={styles.infoTitulo}>Hot Cakes</Text>
                        <View style={styles.infoContenido}>
                            <Text style={styles.detalles}>100 Calorias</Text>
                            <Text style={styles.detalles}>3 Per.</Text>
                        </View>
                        <View style={styles.infoContenido}>
                            <Text style={styles.detalles}>100 Ing.</Text>
                            <Text style={styles.detalles}>Fácil</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
        ))}
    </View>
    </ScrollView>
    
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
    ContHorizon:{
        paddingRight:20,
        width:"100%",
        flexDirection:"row",
    },
    contenido:{
        bottom:-15,
        gap: 20,
        flexDirection:"column",
        height:"100%",
        width:"100%",
    },
    vermas:{
        textDecorationLine:"underline",
        color: "white",
        margin: 10,
        fontSize:14,
        marginBlock:6,
    },
    TitulosEti:{
        justifyContent:"space-between",
        width:"100%",
        flexDirection:"row",
    },
    ImgCon:{
        width:"100%"
    },
    Etiqueta:{
        width:"100%",
    },
    DesTitulo:{
        fontSize:20,
        fontWeight:"bold",
        paddingLeft:20,
        color: "white",
        marginBottom: 20,
    },
    ImgContenedor:{
        marginLeft:20,
        flexDirection:"column",
        backgroundColor:"#EDEDED",
        width:160,
        borderRadius:24,
    },
    info:{
        borderRadius:20,
        padding: 5,
        alignItems: "center",
        backgroundColor:"#EDEDED",
    },
    infoTitulo:{
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
    },
    infoContenido:{
        flexDirection:"row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 5,
    },
    detalles:{
        fontSize: 12,
        color: "#444",
    },
    InputContenedor: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        width: "90%",
        height:50,
        backgroundColor: "#f1f1f1",
        borderRadius: 20,
        marginBlock:0,
        bottom:10
    },

    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    TextSaludo: {
        color:"white",
        fontSize: 20,
        alignSelf:"center",
        paddingBlock:20, 
    }, 
    Saludo: {
        marginBlock:10,
        width: "100%",
        height:"14%",
        alignItems:"center",
    },
    
    ImgSaludo: {
        width: "70%",    
        height: "70%",   
        resizeMode: "contain",
        position: "absolute",
        right:200,
        bottom: 30,     
    }, 
    
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        paddingTop: 30,
        backgroundColor: "#3A4B41",
    },

    backgroundImage: {
        width: "100%",    
        height: "100%",   
        resizeMode: "contain",
        position: "absolute",
        top: -40,        
    },
    input: {
        width: "90%",
        height:50,
        backgroundColor: "#f1f1f1",
        padding: 12,
        borderRadius: 20,
        marginBlock: 40,
    },
});
