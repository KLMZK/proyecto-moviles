import React from "react";
import { TouchableOpacity, ScrollView, View, Text, TextInput, Image, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function InicioScreen() {
    
  const navigation = useNavigation();
  return (
    
    <ImageBackground
        source={require("../assets/FondoPantallas.png")}
        style={styles.background}
        imageStyle={styles.backgroundImage}>
    
    <View style={styles.Saludo}>
        <Image source={require("../assets/usuario.png")} style={styles.ImgSaludo}/>
        <Text style={styles.TextSaludo}>Buenos días Usuario!</Text>
    </View> 
    <View style={styles.InputContenedor}>
        <Image source={require("../assets/busqueda.png")} style={styles.icon}/>
        <TextInput
        placeholder="Buscar"
        style={styles.input}
        placeholderTextColor="#999"
        />
    </View>
    <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
    <View style={styles.contenido}>
        <View style={styles.Etiqueta}>
            <View style={styles.TitulosEti}>
                <Text style={styles.DesTitulo}>Desayunos</Text>
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
                <View style={styles.ImgContenedor}>
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
                </View>
                <View style={styles.ImgContenedor}>
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
                </View>
            </View>
            </ScrollView>
        </View>


        <View style={styles.Etiqueta}>
            <View style={styles.TitulosEti}>
                <Text style={styles.DesTitulo}>Comidas</Text>
                <Text style={styles.vermas}>Ver más</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.ContHorizon}>
                <View style={styles.ImgContenedor}>
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
                </View>
                <View style={styles.ImgContenedor}>
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
                </View>
                <View style={styles.ImgContenedor}>
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
                </View>
            </View>
            </ScrollView>
        </View>

        <View style={styles.Etiqueta}>
            <View style={styles.TitulosEti}>
                <Text style={styles.DesTitulo}>Cenas</Text>
                <Text style={styles.vermas}>Ver más</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.ContHorizon}>
                <View style={styles.ImgContenedor}>
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
                </View>
                <View style={styles.ImgContenedor}>
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
                </View>
                <View style={styles.ImgContenedor}>
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
                </View>
            </View>
            </ScrollView>
        </View>


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
        width:140,
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
        marginBlock: 40,
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
        height:"10%",
        alignItems:"center",
    },
    
    ImgSaludo: {
        width: "80%",    
        height: "80%",   
        resizeMode: "contain",
        position: "absolute",
        right:200,
        bottom: 15,     
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
