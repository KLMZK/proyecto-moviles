import React from "react";
import {  View, Text,FlatList , Image, StyleSheet, ImageBackground,ScrollView } from "react-native";

export default function InfoComidasScreen() {
    const comidas = [
  { id: "1", nombre: "Hot Cakes" },
  { id: "2", nombre: "Huevos" },
  { id: "3", nombre: "Tostadas" },
  { id: "4", nombre: "Hot Cakes" },
  { id: "5", nombre: "Huevos" },
  { id: "6", nombre: "Tostadas" },
];
const instrucciones = [
  { id: "1", paso: "Mezclar la harina con la leche en un bowl." },
  { id: "2", paso: "Agregar los huevos y batir hasta obtener una mezcla uniforme." },
  { id: "3", paso: "Calentar el sartén y verter un poco de mezcla." },
  { id: "4", paso: "Cocinar por ambos lados hasta dorar." },
];

  return (
    <ImageBackground source={require("../assets/Group 1.png")} style={styles.background} imageStyle={styles.backgroundImage}>
        <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
        <View style={styles.ImgTitulo}>
            <View style={styles.ImgPrincipal}>
                <Image style={styles.ImgCon}source={require("../assets/ImgPrueba2.png")}/>
            </View>
            <View style={styles.TitComida}>
                <Text style={styles.Titulo}>Hot Cakes</Text>
            </View>
        </View>
        <View style={styles.ContAbajo}>
            <View style={styles.MIzq}>
                <View style={styles.MIzqC}>
                    <Text style={styles.IzqTitulo}>Ingredientes</Text>
                    <FlatList
                    data={comidas}
                    scrollEnabled={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ padding: 3, alignSelf:"Left"}}>
                        <Text style={{ fontSize: 16 }}> • {item.nombre}</Text>
                        </View>
                    )}
                    />
                </View>
                <View style={styles.MIzqC}>
                    <Text style={styles.IzqTitulo}>Descripción</Text>
                    <Text>--------------------</Text>
                </View>
            </View>
            <View style={styles.MDer}>
                <View style={styles.MDerC}>
                    <Text style={styles.IzqTitulo} >Instrucciones</Text>
                    <FlatList
                    data={instrucciones}
                    scrollEnabled={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Text style={{ marginBottom: 6 }}>
                        Paso {item.id}{"\n"}• {item.paso}
                        </Text>
                    )}
                    />
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
