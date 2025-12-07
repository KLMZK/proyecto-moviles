import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import ip from './global';

export default function VerMasCategoria() {
    const direccion = ip();
    const navigation = useNavigation();
    const route = useRoute();
    const { categoriaId, categoriaNombre } = route.params;
    const [recetas, setRecetas] = useState([]);

    useFocusEffect(
        useCallback(() => {
            let activo = true;

            async function cargarRecetas() {
                try {
                    const res = await fetch(`http://${direccion}/moviles/Select.php`);
                    const data = await res.json();
                    if (!activo) return;

                    const cat = data.find(c => c.id === categoriaId);
                    setRecetas(cat ? cat.recetas : []);
                } catch (err) {
                    console.log(err);
                }
            }

            cargarRecetas();

            return () => { activo = false; };
        }, [direccion, categoriaId])
    );

    const filas = [];
    for (let i = 0; i < recetas.length; i += 2) {
        filas.push(recetas.slice(i, i + 2));
    }

    return (
        <ImageBackground source={require("../assets/FondoPantallas.png")} style={styles.background} imageStyle={styles.backgroundImage}>
            <View style={styles.Saludo}>
                    <Image source={require("../assets/Recetas.png")} style={styles.ImgSaludo2}/>
                    <Text style={styles.TextSaludo}>{categoriaNombre}</Text>
                    <Image source={require("../assets/Recetas.png")} style={styles.ImgSaludo}/>
                  </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 80, alignItems: "center" }}>
                {filas.map((fila, filaIndex) => (
                    <View key={filaIndex} style={styles.fila}>
                        {fila.map((rec, index) => (
                            <TouchableOpacity
                                key={rec.idReceta ? rec.idReceta.toString() : index.toString()}
                                style={styles.recetaContainer}
                                onPress={() => navigation.navigate("InfoComidas", { cve: rec.idReceta })}
                            >
                                <Image style={styles.imagen} source={{ uri: rec.imagen }} />
                                <Text style={styles.nombre}>{rec.nombreRecetas}</Text>
                                <Text style={styles.detalles}>{rec.calorias} Kcal - {rec.tamano} Personas</Text>
                                <Text style={styles.detalles}>Ingredientes: {rec.ingredientes} - {rec.dificultad}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
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
    width: "55%",    
    height: "55%",   
    resizeMode: "contain",
    position: "absolute",
    top:40,       
  }, 
  ImgSaludo: {
    width: "55%",    
    height: "55%",   
    resizeMode: "contain",
    position: "absolute",
    right:240,
    top:40,      
  }, 
    Saludo: {
        top:-30,
        marginBlock:10,
        width: "100%",
        height:"14%",
        alignItems:"center",
    },
    
    backgroundImage: {
        width: "100%",    
        height: "100%",   
        resizeMode: "contain",
        position: "absolute",
        top: -70,        
    },
    background: {
        flex: 1,
        width: "100%",
        backgroundColor: "#3A4B41",
        paddingTop: 30,
    },
    titulo: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        paddingLeft: 20,
        marginBottom: 20,
        alignSelf: "flex-start",
    },
    fila: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        marginBottom: 20,
    },
    recetaContainer: {
        width: "48%",
        backgroundColor: "#EDEDED",
        borderRadius: 20,
        alignItems: "center",
        padding: 10,
    },
    imagen: {
        width: "100%",
        height: 150,
        borderRadius: 20,
        marginBottom: 10,
    },
    nombre: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 5,
    },
    detalles: {
        fontSize: 12,
        color: "#444",
    },
    
});
