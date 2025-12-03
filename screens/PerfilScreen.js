import React, {useState,useEffect} from "react";
import { TouchableOpacity, Alert, View, Text, TextInput, Image, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ip from "./global";

export default function PerfilScreen() {
  const direccion = ip();
  const [password, setContrasena] = useState("");
  const [Npassword, setNContrasena] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    async function cargarNombre() {
      const nombreGuardado = await AsyncStorage.getItem("nombre");
      if (nombreGuardado) {
        setNombre(nombreGuardado);
      }
    }
    cargarNombre();
  }, []);

  useEffect(() => {
    async function cargarCorreo() {
      const correoGuardado = await AsyncStorage.getItem("correo");
      if (correoGuardado) {
        setCorreo(correoGuardado);
      }
    }
    cargarCorreo();
  }, []);

  function recover() {
    const datos = {Ncontrasena: Npassword.trim(), contrasena: password.trim(), correo:correo.trim(), Val: 1}
      
    fetch(`http://${direccion}/moviles/contrasena.php`,{
      method: 'POST', 
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(datos => {
      if(datos.estado === 1) {
        alert("Contraseña Cambiada");
        navigation.navigate('Login')
       }
    });
  }
  function confirmarBorrado() {
  Alert.alert(
    "Confirmar eliminación",
    "¿Seguro que deseas borrar tu cuenta? Esta acción no se puede deshacer.",
    [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Borrar", 
        style: "destructive", 
        onPress: borrarCuenta 
      }
    ]
  );
  }
  async function borrarCuenta() {
    const datos = {
      correo: correo.trim(),
      nombre: nombre.trim()
    };
    fetch(`http://${direccion}/moviles/borrarCuenta.php`, {
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(async datos => {
      if (datos.estado === 1) {
        await AsyncStorage.removeItem("nombre");
        await AsyncStorage.removeItem("correo");
        alert("Cuenta eliminada");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      } else {
        alert(datos.mensaje);
      }
    })
    .catch(err => console.log(err));
  }
  function cerrarSesion() {
    fetch(`http://${direccion}/moviles/cerrarSesion.php`, {
      method: "POST",
    })
    .then(res => res.json())
    .then(data => {
      if(data.estado === 1){
        AsyncStorage.clear();
        alert("Cerrando sesión..");
        navigation.navigate("Login");
        }
      });
    }
  return (
    <ImageBackground source={require("../assets/fondo2.png")} style={styles.background} imageStyle={styles.backgroundImage}>
      
      <View style={styles.ConPer}> 

        <View style={styles.ConDos}>
          <Image style={styles.ImgPer} source={require("../assets/perfil.png")}/>
          <Image style={[styles.Icon, { top: 110, right:60 }]} source={require("../assets/editar.png")}/>
        </View>

        <View style={styles.ConDos}>
          <Text style={styles.TextPer} >{nombre}</Text>
          <Image style={styles.Icon} source={require("../assets/editar.png")}/>
        </View>
        
        <Text style={styles.TextPer2}>{correo}</Text>
      </View>

      <View style={styles.ConAba}>
        <Text style={styles.TextPer}>Cambio de Contraseña:</Text>
        <Text style={styles.TexInput}>Anterior contraseña:</Text>
        <TextInput onChangeText={setContrasena} value={password} style={styles.input} secureTextEntry placeholder="Contraseña"/>
        <Text style={styles.TexInput}>Nueva Contraseña:</Text>
        <TextInput onChangeText={setNContrasena} value={Npassword} style={styles.input} secureTextEntry  placeholder="Nueva Contraseña"/>
        <TouchableOpacity style={styles.button} onPress={recover}>
          <Text style={styles.buttonText}>Cambiar</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity onPress={confirmarBorrado}>

            <View style={[styles.ConElec, {right:20, top:15}]}>
              <Image style={[styles.Icon, { left:-10, width:30, height:30, bottom:10, }]} source={require("../assets/borrarcuenta.png")}/>
              <Text style={{color:"white", fontSize:15, bottom:4,}}>Borrar Cuenta</Text>
            </View>

          </TouchableOpacity>
          <TouchableOpacity onPress={cerrarSesion}>

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
