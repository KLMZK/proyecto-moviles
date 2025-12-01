import React, { useState } from "react"; 
import { TouchableOpacity, View, Text, TextInput, Image, StyleSheet, ImageBackground, KeyboardAvoidingView, ScrollView, Platform , Alert } from "react-native"; 
import Checkbox from 'expo-checkbox';
import { useNavigation } from "@react-navigation/native";


export default function IngredientesScreen() {
  const navigation = useNavigation();

  const [checks, setChecks] = useState({
    FyV: false,
    PyP: false,
    R: false,
    C: false,
    P: false,
    Con: false,
    DyA: false,
    B: false,
    SyD: false,
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} >
      <ImageBackground source={require("../assets/FondoPantallas.png")} style={styles.background} imageStyle={styles.backgroundImage}>
        <View style={styles.Saludo}>
          <Image source={require("../assets/Ingredientes.png")} style={styles.ImgSaludo2}/>
          <Text style={styles.TextSaludo}>Ingredientes</Text>
          <Image source={require("../assets/Ingredientes.png")} style={styles.ImgSaludo}/>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
            <View style={styles.Contenedor}>
              <View style={[styles.Contenido,{height:40,marginVertical:0}]}>
                <TouchableOpacity style={styles.btnMas} onPress={() => navigation.navigate('FormIngredientes')}>
                  <Image source={require("../assets/mas.png")} style={styles.iconMas}/>
                  <Text style={[styles.Text,{left:40, bottom:28, fontWeight:"bold"}]}>Agregar</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.Contenido}>
                <Text style={styles.TextCla}>Frutas y Verduras</Text>
                <Text style={[styles.TextCla,{fontSize:17}]}>Costo</Text>
              </View>
              <View style={[styles.Contenido, {alignItems:"center"}]}>
                <Checkbox value={checks.FyV} onValueChange={() => setChecks({ ...checks, FyV: !checks.FyV })}color={checks.FyV ? "#4CAF50" : undefined}/>
                <Text style={[styles.Text,{right:65}]}>Sandia 3kg</Text>
                <Text style={[styles.Text, {right: 10 }]}>$00</Text>
              </View>
              <Text style={styles.TextCla}>Panadería y Pastelería</Text>
              <View style={[styles.Contenido, {alignItems:"center"}]}>
                <Checkbox value={checks.PyP} onValueChange={() => setChecks({ ...checks, PyP: !checks.PyP })} color={checks.PyP ? "#4CAF50" : undefined}/>
                <Text style={[styles.Text,{right:65}]}>Sandia 3kg</Text>
                <Text style={[styles.Text, {right: 10 }]}>$00</Text>
              </View>
              <Text style={styles.TextCla}>Refrigerados</Text>
              <View style={[styles.Contenido, {alignItems:"center"}]}>
                <Checkbox value={checks.R} onValueChange={() => setChecks({ ...checks, R: !checks.R })} color={checks.R ? "#4CAF50" : undefined} />
                <Text style={[styles.Text,{right:65}]}>Sandia 3kg</Text>
                <Text style={[styles.Text, {right: 10 }]}>$00</Text>
              </View>
              <Text style={styles.TextCla}>Carnicería</Text>
              <View style={[styles.Contenido, {alignItems:"center"}]}>
                <Checkbox value={checks.C} onValueChange={() => setChecks({ ...checks, C: !checks.C })} color={checks.C ? "#4CAF50" : undefined}/>
                <Text style={[styles.Text,{right:65}]}>Sandia 3kg</Text>
                <Text style={[styles.Text, {right: 10 }]}>$00</Text>
              </View>
              <Text style={styles.TextCla}>Pescadería</Text>
              <View style={[styles.Contenido, {alignItems:"center"}]}>
                <Checkbox value={checks.P}  onValueChange={() => setChecks({ ...checks, P: !checks.P })} color={checks.P ? "#4CAF50" : undefined}/>
                <Text style={[styles.Text,{right:65}]}>Sandia 3kg</Text>
                <Text style={[styles.Text, {right: 10 }]}>$00</Text>
              </View>
              <Text style={styles.TextCla}>Congelados</Text>
              <View style={[styles.Contenido, {alignItems:"center"}]}>
                <Checkbox value={checks.Con} onValueChange={() => setChecks({ ...checks, Con: !checks.Con })}color={checks.Con ? "#4CAF50" : undefined}/>
                <Text style={[styles.Text,{right:65}]}>Sandia 3kg</Text>
                <Text style={[styles.Text, {right: 10 }]}>$00</Text>
              </View>
              <Text style={styles.TextCla}>Despensa / Secos (Abarrotes)</Text>
              <View style={[styles.Contenido, {alignItems:"center"}]}>
                <Checkbox value={checks.DyA} onValueChange={() => setChecks({ ...checks, DyA: !checks.DyA })} color={checks.DyA ? "#4CAF50" : undefined} />
                <Text style={[styles.Text,{right:65}]}>Sandia 3kg</Text>
                <Text style={[styles.Text, {right: 10 }]}>$00</Text>
              </View>
              <Text style={styles.TextCla}>Bebidas</Text>
              <View style={[styles.Contenido, {alignItems:"center"}]}>
                <Checkbox value={checks.B} onValueChange={() => setChecks({ ...checks, B: !checks.B })} color={checks.B ? "#4CAF50" : undefined}/>
                <Text style={[styles.Text,{right:65}]}>Sandia 3kg</Text>
                <Text style={[styles.Text, {right: 10 }]}>$00</Text>
              </View>
              <Text style={styles.TextCla}>Snacks y Dulces</Text>
              <View style={[styles.Contenido, {alignItems:"center"}]}>
                <Checkbox value={checks.SyD} onValueChange={() => setChecks({ ...checks, SyD: !checks.SyD })}color={checks.SyD ? "#4CAF50" : undefined}/>
                <Text style={[styles.Text,{right:65}]}>Sandia 3kg</Text>
                <Text style={[styles.Text, {right: 10 }]}>$00</Text>
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({ 
    btnMas: {
    padding: 5,
  },
  iconMas: {
    width: 30,
    height: 30,
  },
  Text:{ 
    fontSize:16, 
  }, 
  Contenido:{ 
    width:"100%", 
    flexDirection:"row", 
    justifyContent:"space-between", 
    marginVertical: 5 
  }, 
  TextCla:{ 
    fontSize:20, 
    fontWeight:"bold", 
    marginTop:10 
  }, 
  background: { 
      flex: 1, 
      width: "100%", 
      height: "100%", 
      alignItems: "center", 
      paddingTop: 30, 
      backgroundColor: "#3A4B41", 
  }, backgroundImage: { 
    width: "100%", 
    height: "100%", 
    resizeMode: "contain", 
    position: "absolute", 
    top:-30,
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
    right:240, top:20, 
  }, 
    Contenedor:{ 
      borderRadius:40, 
      paddingBlock:20, 
      padding:30, 
      alignItems:"flex-start",
      backgroundColor:"#EDEDED", 
      minHeight:630, 
      width:360, 
    }, 
  });
