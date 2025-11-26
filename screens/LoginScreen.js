import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
    
  const navigation = useNavigation();
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

        <Text style={styles.textCard}>Correo Electrónico:</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#999"
        />

        <Text style={styles.textCard}>Contraseña:</Text>
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={() =>navigation.navigate('Inicio')}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          ¿Aún no tienes cuenta? <Text style={styles.link} onPress={() =>navigation.navigate('Register')}>Crea una</Text>
        </Text>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  textCard:{
    marginBlock: 10,
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
    alignSelf: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  footerText: {
    marginTop: 15,
    textAlign: "center",
  },

  link: {
    color: "#2f4f2f",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
