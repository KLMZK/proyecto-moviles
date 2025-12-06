import React, {useState,useEffect} from "react";
import { TouchableOpacity, ScrollView, View, Text, TextInput, Image, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';


export default function RecetaScreen() {
  const navigation = useNavigation();
  const [semana, setSemana] = useState("");
  return (
    
    <ImageBackground source={require("../assets/FondoPantallas.png")} style={styles.background} imageStyle={styles.backgroundImage}>
    <View style={styles.Saludo}>
        <Image source={require("../assets/Planes.png")} style={styles.ImgSaludo2}/>
        <Text style={styles.TextSaludo}>Planificador</Text>
        <Image source={require("../assets/Planes.png")} style={styles.ImgSaludo}/>
    </View>
    <View style={styles.InputContenedor}>
      <Image source={require("../assets/calendario.png")} style={styles.icon}/>
        <Picker selectedValue={semana} onValueChange={(itemValue) => setSemana(itemValue)} style={styles.inputInferior}>
          <Picker.Item label="Semana 1" value="Semana 1" />
          <Picker.Item label="Semana 2" value="Semana 2" />
          <Picker.Item label="Semana 3" value="Semana 3" />
          <Picker.Item label="Semana 4" value="Semana 4" />
        </Picker>
    </View>
      <View style={styles.Contenedor}>
        <View style={styles.ConHorizontal}>
          <View style={styles.ConImg}>
            <TouchableOpacity onPress={() => navigation.navigate('InfoComidas')}>
              <Image source={require("../assets/ImgPrueba2.png")} style={styles.ImgRecetas}/>
            </TouchableOpacity>
            <View style={styles.TextoTit}>
              <Text style={styles.TituCom}>Hot cakes </Text>
              <TouchableOpacity>
                <Image source={require("../assets/editar.png")} style={styles.icon}/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.ConImg}>
            <TouchableOpacity>
              <Image source={require("../assets/ImgPrueba2.png")} style={styles.ImgRecetas}/>
            </TouchableOpacity>
            <View style={styles.TextoTit}>
              <Text style={styles.TituCom}>Hot cakes </Text>
              <TouchableOpacity>
                <Image source={require("../assets/editar.png")} style={styles.icon}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
inputInferior: {
  flex: 1,
  height: 55,
  justifyContent: "center",
  textAlign:"center",
  fontSize: 18,
  color: "black",
},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 10,
    marginTop: 20,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  TextoTit:{
    flexDirection:"row",
    justifyContent:"space-between"
  },
  icon: {
    width: 15,
    height: 15,
    },
  TituCom:{
    left:40,
    alignSelf:"center",
    fontSize:18,
  },
  ImgRecetas:{
    bottom:2,
    borderRadius:20,
    width:180,
    height:168,
  },
  ConImg:{
    borderRadius:20,
    backgroundColor:"#EDEDED"
  },
  ConHorizontal:{
    gap:30,
    alignContent:"space-between",
    margin:10,
    width:"100%",
    height: 200,
    flexDirection:"row"
  },
  Contenedor:{
    height:"100%",
    width:"100%",
  },
  InputContenedor: {
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    width: "90%",
    height:70,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
  },
  btnMas: {
    padding: 5,
  },
  iconMas: {
    right:30,
    width: 30,
    height: 30,
  },

    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    TextSaludo: {
      top:29,
      fontWeight:"bold",
        color:"white",
        fontSize: 20,
        alignSelf:"center",
        paddingBlock:20, 
    }, 
    Saludo: {
        bottom:30,
        marginBlock:10,
        width: "100%",
        height:"14%",
        alignItems:"center",
    },
      ImgSaludo2: {
        alignSelf:"flex-end",
        left:240,
        width: "60%",    
        height: "60%",   
        resizeMode: "contain",
        position: "absolute",
        top:30,     
    }, 
    ImgSaludo: {
        width: "60%",    
        height: "60%",   
        resizeMode: "contain",
        position: "absolute",
        right:240,
        top:30,     
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
