import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  function sesion() {
    const login = {correo: correo.trim(), password: password.trim()}
    
    fetch("http://192.168.1.6/moviles/sesion.php",{
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(login)
    })
    .then(response => response.json())
    .then(datos => {
      if(datos.ingreso === 1) {
       guardarUsuario(datos["0"].NOMBRE);
       guardarCorreo(datos["0"].CORREO);
        navigation.navigate('HomeTabs')
      }
    });
  }
 
  async function guardarUsuario(nombre) {
    try {
      await AsyncStorage.setItem("nombre", nombre);
    } catch (error) {
      console.log("Error al guardar nombre", error);
    }
  }

  async function guardarCorreo(correo) {
    try {
      await AsyncStorage.setItem("correo", correo);
    } catch (error) {
      console.log("Error al guardar el correo", error);
    }
  }

  return (
    <ImageBackground source={require("../assets/Fondo.png")} style={styles.background} imageStyle={styles.backgroundImage}>
      <Image source={require("../assets/Logo.png")} style={styles.logo} resizeMode="contain"/>

      <View style={styles.card}>
        <Text style={styles.textCard}>Correo Electrónico:</Text>
        <TextInput onChangeText={setCorreo} value={correo} placeholder="Email" style={styles.input} placeholderTextColor="#999"/>
        <Text style={styles.textCard}>Contraseña:</Text>
        <TextInput onChangeText={setPassword} value={password} placeholder="Contraseña" secureTextEntry style={styles.input} placeholderTextColor="#999"/>
        <TouchableOpacity style={styles.button} onPress={sesion}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <Text style={styles.link} onPress={() =>navigation.navigate('Contrasena')}>¿Olvidaste tu contraseña?</Text>
        <Text style={styles.footerText}>
          ¿Aún no tienes cuenta? <Text style={styles.link} onPress={() =>navigation.navigate('Register')}>Crea una</Text>
        </Text>
      </View>
      
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  textCard:{
    fontWeight:"bold",
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
    textAlign: "center",
    color: "#2f4f2f",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
