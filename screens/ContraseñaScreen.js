import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground } from "react-native";

export default function RegisterScreen(){
  return (
      <ImageBackground
        source={require("../assets/Fondo.png")}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
      <Image
        source={require("../assets/Logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.card}>
        <Text style={styles.TituloCard}>Recuperación de{"\n"}    Contraseña</Text>

        <Text style={styles.textCard}>Nombre de registro:</Text>
        <TextInput
          placeholder="Nombre"
          style={styles.input}
          placeholderTextColor="#999"
        />

        <Text style={styles.textCard}>Correo de registro:</Text>
        <TextInput
          placeholder="ejemplo@correo.com"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#999"
        />

        <Text style={styles.textCard}>Nueva contraseña:</Text>
        <TextInput
          placeholder="Nueva contraseña"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Definir Contraseña</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  TituloCard:{
    fontWeight: "bold",
    fontSize: 20,
    alignSelf:"center",
    paddingBottom: 20,
    paddingBlock: 5,
    
  },  
  textCard:{
    fontWeight:"bold",
    marginBlock: 5,
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
  top: 80,        
},

  logo: {
    width: 330,
    height: 330,
    marginBottom: 20,
    marginBlock: 30,
  },

  card: {
    width: "85%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    elevation: 5,
  },

  input: {
    width: "100%",
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },

  button: {
    width: 200,
    height:40,
    backgroundColor: "#92ad94",
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 5,
    alignSelf: "flex-end",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  link: {
    color: "#2f4f2f",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});