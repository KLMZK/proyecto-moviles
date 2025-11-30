import React, {useState} from "react";
import {  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground, Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ContrasenaScreen(){  
  const [correo, setCorreo] = useState("");
  const [password, setContrasena] = useState("");
  const [nombre, setNombre] = useState("");
  const [Errorcorreo, setErrorCorreo] = useState("");
  const [Errorpassword, setErrorContrasena] = useState("");
  const [Errornombre, setErrorNombre] = useState("");
  const navigation = useNavigation();

  const validarEmail = (email) => { 
    const regex = /\S+@\S+\.\S+/;
      return regex.test(email);
    }
  const handleCorreoChange = (text) => {
    setCorreo(text);

    if (text.length === 0) {
      setErrorCorreo("");
    } else if (!validarEmail(text)) {
        setErrorCorreo("Formato de correo no válido");
    } else {
          setErrorCorreo("");
        }
    }
  const handlePasswordChange = (text) => {
        setContrasena(text);
        if(text.length==0){
          setErrorContrasena("");
        }
  }
    const handleNombreChange = (text) => {
        setNombre(text);
        if(text.length==0){
          setErrorNombre("");
        }
  }


  function recover() {
    const datos = {nombre: nombre.trim(), correo: correo.trim(), Ncontrasena: password.trim(), Val: 4}
    
    if (!nombre.trim()) {
      Alert.alert("Error", "Complete todos los campos");
      return;
    }
    if (!correo.trim()) {
      Alert.alert("Error", "Complete todos los campos");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Complete todos los campos");
      return;
    }
      
      fetch("http://192.168.1.6/moviles/contrasena.php",{
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
      })
      .then(response => response.json())
      .then(datos => {
        if(datos.estado === 1) {
          Alert.alert("Contraseña","Contraseña Cambiada");
          navigation.navigate('Login')
        }else{
          Alert.alert("Error", "Email o nombre incorrecto. Intentelo de nuevo")
        }
      });
    }

  return (
      <ImageBackground source={require("../assets/Fondo.png")} style={styles.background} imageStyle={styles.backgroundImage}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} >
          <ScrollView>
            <Image source={require("../assets/Logo.png")} style={styles.logo} resizeMode="contain"/>
              <View style={styles.card}>
                <Text style={styles.TituloCard}>Recuperación de{"\n"}    Contraseña</Text>
                <Text style={styles.textCard}>Nombre de registro:</Text>
                <TextInput onChangeText={handleNombreChange} value={nombre} placeholder="Nombre" style={styles.input} placeholderTextColor="#999"/>
                {Errornombre ? ( <Text style={styles.errorText}>{Errornombre}</Text> ) : null}
                <Text style={styles.textCard}>Correo de registro:</Text>
                <TextInput onChangeText={handleCorreoChange} value={correo} placeholder="ejemplo@correo.com" style={styles.input} placeholderTextColor="#999"/>
                {Errorcorreo ? ( <Text style={styles.errorText}>{Errorcorreo}</Text> ) : null}
                <Text style={styles.textCard}>Nueva contraseña:</Text>
                <TextInput onChangeText={handlePasswordChange} value={password} placeholder="Nueva contraseña" secureTextEntry style={styles.input} placeholderTextColor="#999"/>
                {Errorpassword ? ( <Text style={styles.errorText}>{Errorpassword}</Text> ) : null}
                <TouchableOpacity style={styles.button} onPress={recover}>
                  <Text style={styles.buttonText}>Definir Contraseña</Text>
                </TouchableOpacity>
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
    alignSelf:"center",
    width: 350,
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