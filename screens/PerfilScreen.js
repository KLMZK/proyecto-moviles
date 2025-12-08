import React, {useState,useEffect} from "react";
import {  
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground, 
  Alert, KeyboardAvoidingView, ScrollView, Platform, Modal 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ip from "./global";
import * as ImagePicker from 'expo-image-picker';

export default function PerfilScreen() {
  const direccion = ip();
  const [password, setContrasena] = useState("");
  const [Npassword, setNContrasena] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const[id, setID]=useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [imageKey, setImageKey] = useState(Date.now()); 
  
  const navigation = useNavigation();

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos para acceder a la galería');
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setImageKey(Date.now());
    }
  };

  useEffect(() => {
    async function cargarNombre() {
      const nombreGuardado = await AsyncStorage.getItem("nombre");
      if (nombreGuardado) setNombre(nombreGuardado);
    }
    cargarNombre();
  }, []);

  useEffect(() => {
    async function cargarCorreo() {
      const correoGuardado = await AsyncStorage.getItem("correo");
      if (correoGuardado) setCorreo(correoGuardado);
    }
    cargarCorreo();
  }, []);
    useEffect(() => {
    async function cargarID() {
      const IDGuardado = await AsyncStorage.getItem("id");
      if (IDGuardado) setID(IDGuardado);
    }
    cargarID();
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
       }else{
        Alert.alert("Error","Contraseña incorrecta.Intentelo de nuevo.")
       }
    });
  }

  function confirmarBorrado() {
    Alert.alert(
      "Confirmar eliminación",
      "¿Seguro que deseas borrar tu cuenta? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Borrar", style: "destructive", onPress: borrarCuenta }
      ]
    );
  }

  async function borrarCuenta() {
    const datos = { correo: correo.trim(), nombre: nombre.trim() };

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
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      } else alert(datos.mensaje);
    });
  }

  function cerrarSesion() {
    fetch(`http://${direccion}/moviles/cerrarSesion.php`, {
      method: "POST",
    })
    .then(res => res.json())
    .then(data => {
      if(data.estado === 1){
        AsyncStorage.clear();
        Alert.alert("Cerrando","Cerrando sesión..");
        navigation.navigate("Login");
      }
    });
  }

  async function editar() {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("nombre", nombre.trim());

  if (imageUri) {
    formData.append("imagen", {
      uri: imageUri,
      type: "image/jpeg",
      name: `${nombre}_${id}.jpg`,
    });
  }
  async function actualizarNombreLocal(nuevoNombre) {
  try {
    await AsyncStorage.setItem("nombre", nuevoNombre);
  } catch (error) {
    console.log("Error al actualizar nombre local", error);
  }
}
  try {
    const response = await fetch(`http://${direccion}/moviles/perfil.php`, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData
    });
    const datos = await response.json();
    if (datos.ingreso == 1) {
      await actualizarNombreLocal(nombre);
      setImageKey(Date.now());
      setModalVisible(false);
      Alert.alert("Éxito", "Los cambios se han guardado correctamente.");
    } else {
      Alert.alert("Error", "Los cambios no se pudieron guardar.");
    }
  } catch (error) {
    console.log("Error al editar perfil:", error);
    Alert.alert("Error", "No se pudo conectar con el servidor.");
  }
}


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" >
        <Modal transparent={true} visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalFondo}>
            <View style={styles.modalContenido}>
              <Text style={[styles.TextPer,{marginTop:0,marginBottom:10,}]}>Editar Perfil</Text>
              <TouchableOpacity style={styles.boton} onPress={pickImage}>
                <Image style={styles.ImgPer} source={{ uri: (imageUri || `http://${direccion}/moviles/perfil/${nombre}_${id}.jpg`) + `?t=${imageKey}` }} />
              </TouchableOpacity>
              <TextInput value={nombre} onChangeText={setNombre} style={styles.TextPer}/>
              <View style={{flexDirection:"row", gap:20,marginTop:20}}>
                <TouchableOpacity style={styles.modalCerrar} onPress={editar}>
                  <Text style={{ color: "white", fontSize: 18 }}>Guardar cambios</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCerrar} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: "white", fontSize: 18 }}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <ImageBackground source={require("../assets/fondo2.png")} style={styles.background} imageStyle={styles.backgroundImage}>
          <View style={styles.ConPer}> 
            <View style={styles.ConDos}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image style={styles.ImgPer} source={{ uri: (imageUri || `http://${direccion}/moviles/perfil/${nombre}_${id}.jpg`) + "?t=" + Date.now() }}/>
              </TouchableOpacity>
            </View>
            <View style={styles.ConDos}>
              <Text style={styles.TextPer}>{nombre}</Text>
            </View>
            <Text style={styles.TextPer2}>{correo}</Text>
          </View>
          <View style={styles.ConAba}>
            <Text style={styles.TextPer}>Cambio de Contraseña:</Text>
            <Text style={styles.TexInput}>Anterior contraseña:</Text>
            <TextInput onChangeText={setContrasena} value={password} style={styles.input} secureTextEntry placeholder="Contraseña" />
            <Text style={styles.TexInput}>Nueva Contraseña:</Text>
            <TextInput onChangeText={setNContrasena} value={Npassword} style={styles.input} secureTextEntry placeholder="Nueva Contraseña"/>
            <TouchableOpacity style={styles.button} onPress={recover}>
              <Text style={styles.buttonText}>Cambiar</Text>
            </TouchableOpacity>
            <View style={styles.row}>
              <TouchableOpacity onPress={confirmarBorrado}>
                <View style={[styles.ConElec, {right:20, top:15}]}>
                  <Image style={[styles.Icon, { left:-10, width:30, height:30, bottom:10 }]} source={require("../assets/borrarcuenta.png")}/>
                  <Text style={{color:"white", fontSize:15, bottom:4}}>Borrar Cuenta</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={cerrarSesion}>
                <View style={[styles.ConElec, {left:20, top:15}]}>
                  <Image style={[styles.Icon, { left:-10, width:30, height:30, bottom:5 }]} source={require("../assets/cerrarsesion.png")}/>
                  <Text style={{color:"white", fontSize:15}}>Cerrar Sesión</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );

}


const styles = StyleSheet.create({
  row:{ 
    flexDirection:"row" 
  },
  buttonText:{ 
    color:"#fff", fontWeight:"bold", fontSize:16 
  },
  button:{
    width:150, 
    height:40, 
    backgroundColor:"#92ad94",
    padding:8, 
    borderRadius:20, 
    alignItems:"center", 
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
    fontSize:17 
  },
  input:{
    width:"80%", 
    backgroundColor:"#f1f1f1",
    padding:12, 
    borderRadius:8, 
    marginBottom:15,
  },
  ConAba:{ 
    alignItems:"center", 
    minHeight:340, 
    width:"100%" 
  },
  ConDos:{ 
    flexDirection:"row" 
  },
  Icon:{ 
    left:10, 
    width:20, 
    height:20 
  },
  TextPer2:{ 
    color:"#948989", 
    fontSize:14 
  },
  TextPer:{ 
    marginTop:10,
    fontWeight:"bold", 
    color:"white", 
    fontSize:20 
  },
  ImgPer:{ 
    bottom:-20,
    borderRadius:100, 
    width:200, 
    height:200, 
    marginBottom:20 
  },
  ConPer:{ 
    top:-30,
    backgroundColor:"rojo",
    justifyContent:"flex-end", 
    alignItems:"center", 
    width:"100%", 
    minHeight:470 
  },
  modalFondo:{
    flex:1, 
    backgroundColor:"rgba(0,0,0,0.7)",
    justifyContent:"center", 
    alignItems:"center"
  },
  modalContenido:{
    width:"85%", 
    backgroundColor:"#222",
    padding:20, 
    borderRadius:20, 
    alignItems:"center"
  },
  modalImagen:{
    borderRadius:140,
    width:280, 
    height:280, 
  },
  modalCerrar:{
    marginTop:15, 
    backgroundColor:"#92ad94",
    paddingVertical:10, 
    paddingHorizontal:30, 
    borderRadius:15
  },

  background:{
    flex:1, 
    width:"100%", 
    height:"100%", 
    alignItems:"center", 
    paddingTop:30,
    backgroundColor:"#3A4B41",
  },
  backgroundImage:{
    width:"100%", 
    height:"100%", 
    resizeMode:"contain", 
    position:"absolute", 
    top:-176
  }
});
