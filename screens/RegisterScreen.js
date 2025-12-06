import React, {useState} from "react";
import {  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground, Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ip from "./global";

export default function RegisterScreen(){
    const direccion = ip();
    const [correo, setCorreo] = useState("");
    const [correoError, setCorreoError] = useState("");
    const [password, setContrasena] = useState("");
    const [nombre, setNombre] = useState("");
    const navigation = useNavigation();

    const validarEmail = (email) => { 
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    const handleCorreoChange = (text) => {
        setCorreo(text);

        if (text.length === 0) {
            setCorreoError("El correo es obligatorio");
        } 
        else if (!validarEmail(text)) {
            setCorreoError("Formato de correo no válido");
        } 
        else {
            setCorreoError("");
        }
    };

    function registro() {

        if (!nombre.trim()) {
            Alert.alert("Error", "El nombre es obligatorio");
            return;
        }

        if (!validarEmail(correo.trim())) {
            Alert.alert("Error", "Ingresa un correo válido");
            return;
        }

        if (!password.trim()) {
            Alert.alert("Error", "La contraseña es obligatoria");
            return;
        }

        const datos = {
            correo: correo.trim(),
            contrasena: password.trim(),
            nombre: nombre.trim()
        };

        fetch(`http://${direccion}/moviles/registro.php`,{
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(datos => {
            if(datos.estado === 1) {
                Alert.alert("Cuenta Creada", "Tu cuenta fue creada correctamente");
                navigation.navigate('Login');
            } else {
                Alert.alert("Error", "El correo ya está en uso");
            }
        })
        .catch(error => {
            Alert.alert("Error", "Hubo un problema con el registro");
            console.log(error);
        });
    }

    return (
      <ImageBackground source={require("../assets/Fondo.png")} style={styles.background} imageStyle={styles.backgroundImage} >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Image source={require("../assets/Logo.png")} style={styles.logo} resizeMode="contain"/>
              <View style={styles.card}>
                <Text style={styles.TituloCard}>Registrarse</Text>
                <Text style={styles.textCard}>Nombre:</Text>
                <TextInput onChangeText={setNombre} value={nombre} placeholder="Nombre" style={styles.input} placeholderTextColor="#999" />
                <Text style={styles.textCard}>Correo:</Text>
                <TextInput onChangeText={handleCorreoChange} value={correo} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} placeholder="ejemplo@correo.com" style={styles.input}  placeholderTextColor="#999"/>
                {correoError ? ( <Text style={styles.errorText}>{correoError}</Text> ) : null}
                <Text style={styles.textCard}>Contraseña:</Text>
                <TextInput onChangeText={setContrasena} value={password} secureTextEntry={true} placeholder="Contraseña" style={styles.input} placeholderTextColor="#999" />
                <TouchableOpacity style={styles.button} onPress={registro}>
                  <Text style={styles.buttonText}>Crear Cuenta</Text>
                </TouchableOpacity>
              </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
}

const styles = StyleSheet.create({
  TituloCard:{
    fontWeight:"bold",
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

  errorText: {
    color: "red",
    marginTop: -10,
    marginBottom: 10,
    fontSize: 13,
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
  }
});
