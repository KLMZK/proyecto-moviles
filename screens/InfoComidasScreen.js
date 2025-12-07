import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {  View, Text,FlatList , Image, StyleSheet, ImageBackground,ScrollView } from "react-native";
import ip from './global';

export default function InfoComidasScreen() {
    const direccion = ip();
    const route = useRoute();
    const { cve } = route.params;
    const [receta, setReceta] = useState(null);

useEffect(() => {
    fetch(`http://${direccion}/moviles/Recetas.php?cve=${cve}`)
        .then(res => res.json())
        .then(data => {
            setReceta(data);
        })
        .catch(err => console.log(err));
}, [])

  return (
    <ImageBackground source={require("../assets/Group 1.png")} style={styles.background} imageStyle={styles.backgroundImage}>
        <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
        <View style={styles.ImgTitulo}>
            <View style={styles.ImgPrincipal}>
                {receta?.IMAGEN && (
                <Image style={styles.ImgCon} source={{ uri: receta.IMAGEN }} />
                )}
            </View>
            <View style={styles.TitComida}>
                <Text style={styles.Titulo}>{receta?.NOMBRE}</Text>
            </View>
        </View>
        <View style={styles.ContAbajo}>
            <View style={styles.MIzq}>
                <View style={styles.MIzqC}>
                    <Text style={styles.IzqTitulo}>Ingredientes</Text>
                    <FlatList
                    data={receta?.INGREDIENTES}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ padding: 3, alignSelf:"flex-start"}}>
                        <Text style={{ fontSize: 16 }}> • {item.NOMBRE} ({item.CANTIDAD} {item.UNIDAD})</Text>
                        </View>
                    )}
                    />
                </View>
                <View style={styles.MIzqC}>
                    <Text style={styles.IzqTitulo}>Descripción</Text>
                    <Text>{receta?.CALORIAS} Kcal</Text>
                    <Text>Para {receta?.TAMANO} personas</Text>
                    <Text>Dificultad: {receta?.DIFICULTAD}</Text>
                </View>
            </View>
            <View style={styles.MDer}>
                <View style={styles.MDerC}>
                    <Text style={styles.IzqTitulo}>Instrucciones</Text>
                    <Text>{receta?.DESCRIPCION}</Text>
                </View>
            </View>
        </View>
        </ScrollView>
     </ImageBackground>
  );
}
const styles = StyleSheet.create({
    MDerC:{
        width:"100%",
        alignSelf:"center",
        padding:10,
        backgroundColor:"rgba(217, 217, 217, 0.7)",
        borderRadius:20,
    },
    IzqTitulo:{
        alignSelf:"center",
        paddingBottom:10,
        fontSize:18,
        fontWeight:"bold",
    },
    MIzqC:{
        width:"45%",
        margin:10,
        padding:10,
        backgroundColor:"rgba(217, 217, 217, 0.7)",
        alignItems:"center",
        borderRadius:20,
    },
    MDer:{
        width:400,
        alignSelf:"center",
    },
    MIzq:{
        alignSelf:"center",
        flexDirection:"row",
        width:400,
    },
    ContAbajo:{
        marginTop:15,
        flexDirection:"column",
        width:"100%",
    },
    Titulo:{
        fontSize:24,
        fontWeight:"bold",
    },
    TitComida:{
        marginBottom:0,
        paddingBlock:3,
        borderRadius:13,
        alignSelf:"center",
        height:"10%",
        width:"60%",
        alignItems:"center",
        backgroundColor:"rgba(217, 217, 217, 0.89)",
    },
    ImgTitulo:{
        height:450,
        marginTop:60,
        width:"100%"
    },
    ImgCon:{
        height:"100%",
        width:"100%",
        borderRadius:35,
        
    },
    ImgPrincipal:{
        borderRadius:35,
        padding:20,
        height:"90%",
        marginLeft:20,
        marginRight:20,
        alignItems:"center",
        backgroundColor:"#EDEDED"
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
    resizeMode: "cover",  
},
    
});
