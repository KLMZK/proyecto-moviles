import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";
import {  
  View, Text, FlatList, Image, StyleSheet, ImageBackground, ScrollView, TouchableOpacity
} from "react-native";
import ip from './global';

export default function InfoComidasScreen() {
    const direccion = ip();
    const route = useRoute();
    const navigation = useNavigation();
    const { cve } = route.params;
    const [receta, setReceta] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        fetch(`http://${direccion}/moviles/Recetas.php?cve=${cve}`)
            .then(res => res.json())
            .then(data => setReceta(data))
            .catch(err => console.log(err));
    }, [cve, direccion, reloadKey]);


    useEffect(() => {
      if (receta?.IMAGEN) {
        Image.prefetch(`${receta.IMAGEN}?t=${reloadKey}`);
      }
    }, [receta, reloadKey]);

    const handleEditar = () => {
        navigation.navigate("FormRecetas", { receta });
    };

    return (
        <ImageBackground source={require("../assets/Group 1.png")} style={styles.background} imageStyle={styles.backgroundImage}>
            <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
                <View style={styles.ImgTitulo}>
                    <View style={styles.ImgPrincipal}>
                        {receta?.IMAGEN && (
                          <Image
                            key={reloadKey}
                            style={styles.ImgCon}
                            source={{ uri: `${receta.IMAGEN}?t=${reloadKey}` }}
                          />
                        )}
                    </View>
                    <View style={styles.TitComida}>
                        <View style={styles.TituloContainer}>
                            <Text style={styles.Titulo}>{receta?.NOMBRE}</Text>
                            {receta && (
                                <TouchableOpacity onPress={handleEditar}>
                                    <Image
                                        source={require("../assets/editar.png")}
                                        style={styles.IconEditar}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
                <View style={styles.ContAbajo}>
                    <View style={styles.MIzq}>
                        <View style={styles.MIzqC}>
                            <Text style={styles.IzqTitulo}>Ingredientes</Text>
                            <FlatList
                                data={receta?.INGREDIENTES}
                                scrollEnabled={false}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={{ padding: 3, alignSelf:"flex-start"}}>
                                        <Text style={{ fontSize: 16 }}> • {item.NOMBRE} ({item.CANTIDAD} {item.UNIDAD})</Text>
                                    </View>
                                )}
                            />
                        </View>
                        <View style={styles.MIzqC}>
                            <Text style={styles.IzqTitulo}>Descripción</Text>
                            <Text>{receta?.CALORIAS} Kcal</Text>
                            <Text>Para {receta?.TAMANO} personas</Text>
                            <Text>Dificultad: {receta?.DIFICULTAD}</Text>
                            <Text>Presupuesto: ${receta?.PRESUPUESTO}</Text>
                        </View>
                    </View>
                    <View style={styles.MDer}>
                        <View style={styles.MDerC}>
                            <Text style={styles.IzqTitulo}>Instrucciones</Text>
                            <Text>{receta?.DESCRIPCION}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
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
        resizeMode: "cover",  
    },
    ImgTitulo: {
        marginTop: 60,
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    ImgPrincipal: {
        width: "90%",
        height: 300, // altura proporcional
        borderRadius: 35,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EDEDED",
        marginBottom: 15,
    },
    ImgCon: {
        width: "100%",
        height: "100%",
        borderRadius: 35,
    },
    TitComida: {
        width: "80%",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: "rgba(217, 217, 217, 0.89)",
        marginBottom: 10,
    },
    TituloContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap", // permite que el título haga wrap
        gap: 10,
    },
    Titulo: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        flexShrink: 1,
    },
    IconEditar: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    ContAbajo: {
        marginTop: 15,
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
    },
    MIzq: {
        flexDirection: "row",
        width: "90%",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    MIzqC: {
        width: "45%",
        margin: 5,
        padding: 10,
        alignItems: "center",
        backgroundColor: "rgba(217, 217, 217, 0.7)",
        borderRadius: 20,
    },
    MDer: {
        width: "90%",
        marginBottom: 15,
    },
    MDerC: {
        width: "100%",
        padding: 10,
        backgroundColor: "rgba(217, 217, 217, 0.7)",
        borderRadius: 20,
    },
    IzqTitulo: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    buttonEditar: {
        backgroundColor: "#92ad94",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginTop: 10,
        alignSelf: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
