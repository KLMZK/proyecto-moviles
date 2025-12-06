import React, { useState } from "react";
import { TouchableOpacity, View, Text, TextInput, Image, StyleSheet, ImageBackground, KeyboardAvoidingView, ScrollView, Platform , Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import ip from "./global";

export default function FormIngredientesScreen() {
    const direccion = ip();
    const [nombre, setNombre] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [costo, setCosto] = useState("");
    const [clasificacion, setClasificacion] = useState("");
    const [unidad, setUnidad] = useState("");
      
    function enviar() {
        const login = {nombre: nombre.trim(), cantidad: cantidad.trim(), costo: costo.trim(), clasificacion: clasificacion.trim(), unidad: unidad.trim()}
        
        fetch(`http://${direccion}/moviles/FormIngredientes.php`,{
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(login)
        })
        .then(response => response.json())
        .then(datos => {
        if(datos.estado == 1) {
            Alert.alert("Guardado","Ingrediente guardado correctamente")
            navigation.navigate('Ingredientes');
        } else {
            Alert.alert("Error", "El ingrediente no se ha guardado correctamente. Intentelo de nuevo")
        }
        });
    };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} >
        <ImageBackground source={require("../assets/FondoPantallas.png")} style={styles.background} imageStyle={styles.backgroundImage}>
            <View style={styles.Saludo}>
                <Image source={require("../assets/Ingredientes.png")} style={styles.ImgSaludo2}/>
                <Text style={styles.TextSaludo}>Ingredientes</Text>
                <Image source={require("../assets/Ingredientes.png")} style={styles.ImgSaludo}/>
            </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.Contenedor}>
                    <Text style={styles.TextCla}>Agregar Ingrediente</Text>
                    <Text style={styles.TitInput}>Nombre:</Text>
                    <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre del ingrediente" style={styles.input2} placeholderTextColor="#999" />
                    <Text style={styles.TitInput}>Unidad:</Text>
                    <Picker selectedValue={unidad} onValueChange={(itemValue) => setUnidad(itemValue)} style={[styles.input2,{height:55}]}>
                      <Picker.Item label="Unidad" value="" />
                      <Picker.Item label="L" value="L" />
                      <Picker.Item label="ml" value="ml" />
                      <Picker.Item label="Kg" value="Kg" />
                      <Picker.Item label="g" value="g" />
                    </Picker>
                    <Text style={styles.TitInput}>Cantidad:</Text>
                    <TextInput value={cantidad} keyboardType={"decimal-pad"} onChangeText={setCantidad} placeholder="Cantidad del Ingrediente" style={styles.input2} placeholderTextColor="#999" />
                    <Text style={styles.TitInput}>Costo:</Text>
                    <TextInput value={costo} keyboardType={"decimal-pad"} onChangeText={setCosto} placeholder="Costo unitario del ingrediente" style={styles.input2} placeholderTextColor="#999" />
                    <Text style={styles.TitInput}>Clasificación:</Text>
                    <Picker selectedValue={clasificacion} onValueChange={(itemValue) => setClasificacion(itemValue)} style={[styles.input2,{height:55}]}>
                        <Picker.Item label="Clasificación" value="" />
                        <Picker.Item label="Frutas y Verduras" value="Frutas y Verduras" />
                        <Picker.Item label="Panadería y Pestelería" value="Panadería y Pestelería" />
                        <Picker.Item label="Refrigerados" value="Refrigerados" />
                        <Picker.Item label="Carnicería" value="Carnicería" />
                        <Picker.Item label="Pescadería" value="Pescadería" />
                        <Picker.Item label="Congelados" value="Congelados" />
                        <Picker.Item label="Despensa / Secos (Abarrotes)" value="Despensa / Secos (Abarrotes)" />
                        <Picker.Item label="Bebidas" value="Bebidas" />
                        <Picker.Item label="Snacks y Dulces" value="Snacks y Dulces" />
                    </Picker>
                    <TouchableOpacity style={[styles.boton,{top:10}]} onPress={enviar}>
                        <Text style={styles.textoBoton}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
    </KeyboardAvoidingView>
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
  boton: {
    margin:9,
    width: 200,
    height:40,
    backgroundColor: "#92ad94",
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 5,
    alignSelf: "center",
  },
    textoBoton: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
  },
    TextCla:{ 
        fontSize:20, 
        fontWeight:"bold", 
        marginBottom:30 
  }, 
    input2: {
      width: "90%",
      height:50,
      backgroundColor: "#D9D9D9",
      padding: 12,
      marginBlock: 10,
  },
    TitInput:{
        fontWeight:"bold",
        left:20,
        alignSelf:"flex-start",
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
    top:-70,        
  },
  Saludo: {
    bottom:30,
    marginBlock:10,
    width: "100%",
    height:"14%",
    alignItems:"center",
  },
  TextSaludo: {
    top:29,
    fontWeight:"bold",
    color:"white",
    fontSize: 20,
    alignSelf:"center",
    paddingBlock:20, 
  }, 
  ImgSaludo2: {
    alignSelf:"flex-end",
    left:240,
    width: "60%",    
    height: "60%",   
    resizeMode: "contain",
    position: "absolute",
    top:20,     
  }, 
  ImgSaludo: {
    width: "60%",    
    height: "60%",   
    resizeMode: "contain",
    position: "absolute",
    right:240,
    top:20,     
  }, 
  Contenedor:{
    borderRadius:40,
    paddingBlock:20,
    padding:10,
    alignItems:"center",
    backgroundColor:"#EDEDED",
    minHeight:530,
    width:360,
  },
});
