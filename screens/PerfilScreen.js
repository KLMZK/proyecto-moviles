import React from "react";
import { TouchableOpacity, ScrollView, View, Text, TextInput, Image, StyleSheet, ImageBackground } from "react-native";


export default function PerfilScreen() {
    
  return (
    <ImageBackground source={require("../assets/fondo2.png")} style={styles.background} imageStyle={styles.backgroundImage}>
      <View style={styles.ConPer}> 
        <View style={styles.ConDos}>
          <Image style={styles.ImgPer} source={require("../assets/perfil.png")}/>
          <Image style={[styles.Icon, { top: 110, right:60 }]} source={require("../assets/editar.png")}/>
        </View>
        <View style={styles.ConDos}>
          <Text style={styles.TextPer} >Nombre del Usuario</Text>
          <Image style={styles.Icon} source={require("../assets/editar.png")}/>
        </View>
        <Text style={styles.TextPer2}>Se unio el día dd/mm/aaaa</Text>
      </View>
      <View style={styles.ConAba}>
        <Text style={styles.TextPer}>Cambio de Contraseña:</Text>
        <Text style={styles.TexInput}>Anterior contraseña:</Text>
        <TextInput style={styles.input} secureTextEntry placeholder="Contraseña"/>
        <Text style={styles.TexInput}>Nueva Contraseña:</Text>
        <TextInput style={styles.input} secureTextEntry  placeholder="Nueva Contraseña"/>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Cambiar</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity>
            <View style={[styles.ConElec, {right:20, top:15}]}>
              <Image style={[styles.Icon, { left:-10, width:30, height:30, bottom:10, }]} source={require("../assets/borrarcuenta.png")}/>
              <Text style={{color:"white", fontSize:15, bottom:4,}}>Borrar Cuenta</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={[styles.ConElec, {left:20, top:15}]}>
                <Image style={[styles.Icon, { left:-10, width:30, height:30, bottom:5,}]} source={require("../assets/cerrarsesion.png")}/>
                <Text style={{color:"white", fontSize:15}}>Cerrar Sesión</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  row:{
    flexDirection:"row",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    alignSelf:"flex-end",
    width: 150,
    height:40,
    backgroundColor: "#92ad94",
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    alignSelf:"flex-end",
  },
  ConElec:{
    padding:10,
    flexDirection:"row"
  },
  TexInput:{
    left:44,
    alignSelf:"flex-start",
    color:"white",
    fontSize: 17,
  },
  input: {
    width: "80%",
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  ConAba:{
    alignItems:"center",
    flexDirection:"column",
    height:"100%",
    width:"100%",
  },
  ConDos:{
    flexDirection:"row",
  },
  Icon:{
    left:10,
    width:20,
    height:20,
  },
  TextPer2:{
    color:"#948989",
    marginBottom:"40",
    fontSize:14,
  },
  TextPer:{
    fontWeight:"bold",
    color:"white",
    marginBottom:"10",
    fontSize:20,
  },
  ImgPer:{
    width:150,
    height:150,
    marginBottom: "20",
  },
  ConPer:{
    margin:0,
    justifyContent:"flex-end",
    alignItems:"center",
    width:"100%",
    height:"58%",
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
    top: -176        
  },
},
);
