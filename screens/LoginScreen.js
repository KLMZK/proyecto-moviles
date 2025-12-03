import React, {useState} from "react";
import {  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground, Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ip from './global';

export default function LoginScreen() {
  const direccion = ip();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [cerror, setcerror]=useState("");
  const [error, seterror]=useState("");
  const navigation = useNavigation();
  const [errorCorreo, setErrorCorreo] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  const validarEmail = (email) => { 
    const regex = /\S+@\S+\.\S+/;
      return regex.test(email);
    }
  const handleCorreoChange = (text) => {
    setCorreo(text);

    if (text.length === 0) {
      setcerror("");
    } else if (!validarEmail(text)) {
        setcerror("Formato de correo no válido");
    } else {
          setcerror("");
        }
    }
  const handlePasswordChange = (text) => {
        setPassword(text);
        if(text.length==0){
          seterror("");
        }
  }

  function sesion() {
    const login = {correo: correo.trim(), password: password.trim()}
    
    fetch(`http://${direccion}/moviles/sesion.php`,{
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(login)
    })
    .then(response => response.json())
    .then(datos => {
<<<<<<< HEAD
      if(datos.ingreso == 1) {
        setErrorCorreo(false);
        setErrorPassword(false);

        guardarUsuario(datos["0"].NOMBRE);
        guardarCorreo(datos["0"].CORREO);
        navigation.navigate('HomeTabs');

      } else {
        setErrorCorreo(true);
        setErrorPassword(true);

        alert("Correo o contraseña incorrectos");
=======
      if(datos.ingreso === 1) {
       guardarUsuario(datos["0"].NOMBRE);
       guardarCorreo(datos["0"].CORREO);
       navigation.navigate('HomeTabs');
      } else {
        seterror("Contraseña Incorrecta");
        setcerror("Correo Incorrecto");
        Alert.alert("Error", "Email o Contraseña incorrecto. Intentelo de nuevo")
>>>>>>> 504e6fc3005a939dd5a599ad6701bf89dd280d43
      }
    });
  };
 
  async function guardarUsuario(nombre) {
    try {
      await AsyncStorage.setItem("nombre", nombre);
    } catch (error) {
      console.log("Error al guardar nombre", error);
    }
  };

  async function guardarCorreo(correo) {
    try {
      await AsyncStorage.setItem("correo", correo);
    } catch (error) {
      console.log("Error al guardar el correo", error);
    }
  };

  return (
    <ImageBackground source={require("../assets/Fondo.png")} style={styles.background} imageStyle={styles.backgroundImage}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} >
      <ScrollView>
      <Image source={require("../assets/Logo.png")} style={styles.logo} resizeMode="contain"/>
      <View style={styles.card}>
        <Text style={styles.textCard}>Correo Electrónico:</Text>
<<<<<<< HEAD
        <TextInput onChangeText={text => { setCorreo(text); setErrorCorreo(false);}} value={correo} placeholder="Email" style={errorCorreo ? styles.error : styles.input} placeholderTextColor="#999"/>
        <Text style={styles.textCard}>Contraseña:</Text>
        <TextInput onChangeText={text => {setPassword(text);setErrorPassword(false); }} value={password} placeholder="Contraseña" secureTextEntry style={errorPassword ? styles.error : styles.input} placeholderTextColor="#999"/>        
=======
        <TextInput onChangeText={handleCorreoChange} value={correo} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} placeholder="Email" style={styles.input} placeholderTextColor="#999"/>
        {cerror ? ( <Text style={styles.errorText}>{cerror}</Text> ) : null}
        <Text style={styles.textCard}>Contraseña:</Text>
        <TextInput onChangeText={handlePasswordChange} value={password} placeholder="Contraseña" secureTextEntry={true} style={styles.input} placeholderTextColor="#999"/>
        {error ? ( <Text style={styles.errorText}>{error}</Text> ) : null}
>>>>>>> 504e6fc3005a939dd5a599ad6701bf89dd280d43
        <TouchableOpacity style={styles.button} onPress={sesion}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <Text style={styles.link} onPress={() =>navigation.navigate('Contrasena')}>¿Olvidaste tu contraseña?</Text>
        <Text style={styles.footerText}>
          ¿Aún no tienes cuenta? <Text style={styles.link} onPress={() =>navigation.navigate('Register')}>Crea una</Text>
        </Text>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    errorText: {
    color: "red",
    marginTop: -10,
    marginBottom: 10,
    fontSize: 13,
  },
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
    alignSelf:"center",
    width: 340,
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
  error: {
    width: "100%",
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    border: '3px solid red',
  },
});
