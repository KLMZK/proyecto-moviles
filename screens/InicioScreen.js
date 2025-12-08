import React, {useState,useCallback,useMemo } from "react";
import { TouchableOpacity, ScrollView, View, Text, TextInput, Image, StyleSheet, ImageBackground } from "react-native";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ip from './global';

export default function InicioScreen() {
    const direccion = ip();
    const [nombre, setNombre] = useState("");
    const navigation = useNavigation();
    const route = useRoute(); // <-- agregado
    const [categoria, setCategoria] = useState([]);
    const [correo, setCorreo] = useState("");
    const[id, setID]=useState("");
    const [searchText, setSearchText] = useState("");
    const [categoriaFiltrada, setCategoriaFiltrada] = useState([]);
    const [reloadKey, setReloadKey] = useState(0);

    useFocusEffect(
      useCallback(() => {
        let activo = true;
        async function cargarDatosBasicos() {
          const nombreGuardado = await AsyncStorage.getItem("nombre");
          const correoGuardado = await AsyncStorage.getItem("correo");
          const IDGuardado = await AsyncStorage.getItem("id");
          if (!activo) return;
          if (nombreGuardado) setNombre(nombreGuardado);
          if (correoGuardado) setCorreo(correoGuardado);
          if (IDGuardado) setID(IDGuardado);
        }
        async function consulta() {
          try {
            const res = await fetch(`http://${direccion}/moviles/Select.php`);
            const data = await res.json();
            if (!activo) return;
            setCategoria(data);
            setCategoriaFiltrada(data);
          } catch (err) {
            console.log(err);
          }
        }
        cargarDatosBasicos();
        consulta();
        return () => { activo = false; };
      }, [direccion])
    );

    // 🔥 Recargar imagen siempre que esta pantalla toma foco
    useFocusEffect(
      useCallback(() => {
        setReloadKey(prev => prev + 1);
      }, [])
    );

    // 🔥 Recargar imagen cuando otra pantalla envía imagenActualizada: true
    useFocusEffect(
      useCallback(() => {
        if (route?.params?.imagenActualizada) {
          setReloadKey(prev => prev + 1);
          navigation.setParams({ imagenActualizada: false });
        }
      }, [route?.params?.imagenActualizada])
    );

    const perfilUri = useMemo(() => {
      if (nombre && id) {
        return `http://${direccion}/moviles/perfil/${nombre}_${id}.jpg?t=${reloadKey}`;
      }
      return null;
    }, [nombre, id, direccion, reloadKey]);

    function saludoSegunHora() {
        const hora = new Date().getHours();
        if (hora < 12) return "Buenos días";
        if (hora < 18) return "Buenas tardes";
        return "Buenas noches";
    }

    const filtrarCategorias = (texto) => {
      setSearchText(texto);
      if (texto.trim() === "") {
        setCategoriaFiltrada(categoria); 
      } else {
        const textoMinus = texto.toLowerCase();
        const filtrado = categoria.map(cat => {
          const recetasFiltradas = cat.recetas.filter(rec =>
            rec.nombreRecetas.toLowerCase().includes(textoMinus)
          );
          return { ...cat, recetas: recetasFiltradas };
        }).filter(cat => cat.recetas.length > 0); 
        setCategoriaFiltrada(filtrado);
      }
    }

    const actualizarImagenPerfil = () => {
      setReloadKey(prev => prev + 1);
    }
    
    return (
        <ImageBackground source={require("../assets/FondoPantallas.png")} style={styles.background} imageStyle={styles.backgroundImage}>
        <View style={styles.Saludo}>
            {perfilUri && (
              <Image source={{ uri: perfilUri }} style={styles.ImgSaludo}/>
            )}
            <Text style={styles.TextSaludo}>{saludoSegunHora()}</Text>
            <Text style={[styles.TextSaludo,{paddingBlock:0, bottom:15}]}>{nombre}!</Text>
        </View>
        <View style={styles.InputContenedor}>
            <Image source={require("../assets/busqueda.png")} style={styles.icon}/>
            <TextInput placeholder="Buscar" style={styles.input} placeholderTextColor="#999" value={searchText} onChangeText={filtrarCategorias}/>
            <TouchableOpacity style={styles.btnMas} onPress={() => navigation.navigate('FormRecetas')}>
                <Image source={require("../assets/mas.png")} style={styles.iconMas}/>
            </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
            <View style={styles.contenido}>
                {categoriaFiltrada.map(cat => (
                    <View key={cat.id} style={styles.Etiqueta}>
                        <View style={styles.TitulosEti}>
                            <Text style={styles.DesTitulo}>{cat.nombreCategoria}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("VerMas", { categoriaId: cat.id, categoriaNombre: cat.nombreCategoria })}>
                                <Text style={styles.vermas}>Ver más</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.ContHorizon}>
                                {cat.recetas.map(rec => (
                                    <TouchableOpacity key={rec.idReceta} style={styles.ImgContenedor} onPress={() => navigation.navigate("InfoComidas", { cve: rec.idReceta })}>
                                        <Image style={{width: 160, height: 130, borderRadius: 20}} source={{ uri:rec.imagen}}/>
                                        <View style={styles.info}>
                                            <Text style={styles.infoTitulo}>{rec.nombreRecetas}</Text>
                                            <View style={styles.infoContenido}>
                                                <Text style={styles.detalles}>{rec.calorias} Kcal</Text>
                                                <Text style={styles.detalles}>{rec.tamano} Personas</Text>
                                            </View>
                                            <View style={styles.infoContenido}>
                                                <Text style={styles.detalles}>{rec.ingredientes} Ing.</Text>
                                                <Text style={styles.detalles}>{rec.dificultad}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                ))}
            </View>
        </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    ContHorizon:{
        paddingRight:20,
        width:"100%",
        flexDirection:"row",
    },
    contenido:{
        bottom:-15,
        gap: 20,
        flexDirection:"column",
        height:"100%",
        width:"100%",
    },
    vermas:{
        textDecorationLine:"underline",
        color: "white",
        margin: 10,
        fontSize:14,
        marginBlock:6,
    },
    TitulosEti:{
        justifyContent:"space-between",
        width:"100%",
        flexDirection:"row",
    },
    ImgCon:{
        width:10,
        height:10,
    },
    Etiqueta:{
        width:"100%",
    },
    DesTitulo:{
        fontSize:20,
        fontWeight:"bold",
        paddingLeft:20,
        color: "white",
        marginBottom: 20,
    },
    ImgContenedor:{
        marginLeft:20,
        flexDirection:"column",
        backgroundColor:"#EDEDED",
        width:160,
        borderRadius:24,
    },
    info:{
        borderRadius:20,
        padding: 5,
        alignItems: "center",
        backgroundColor:"#EDEDED",
    },
    infoTitulo:{
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
    },
    infoContenido:{
        flexDirection:"row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 5,
    },
    detalles:{
        fontSize: 12,
        color: "#444",
    },
    InputContenedor: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        width: "90%",
        height:50,
        backgroundColor: "#f1f1f1",
        borderRadius: 20,
        marginBlock:0,
        bottom:10
    },

  btnMas: {
    padding: 5,
  },
  iconMas: {
    right:30,
    width: 30,
    height: 30,
  },

    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    TextSaludo: {
        color:"white",
        fontSize: 20,
        alignSelf:"center",
        paddingBlock:20, 
        fontWeight:"bold"
    }, 
    Saludo: {
        marginBlock:10,
        width: "100%",
        height:"14%",
        alignItems:"center",
    },
    
    ImgSaludo: {
        borderRadius:100,
        width: 80,    
        height: 80,   
        resizeMode: "contain",
        position: "absolute",
        right:300,
        bottom: 30,     
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
        top: -40,        
    },
    input: {
        width: "90%",
        height:50,
        backgroundColor: "#f1f1f1",
        padding: 12,
        borderRadius: 20,
        marginBlock: 40,
    },
});