import React, { useState } from "react";
import { TouchableOpacity, ScrollView, View, Text, TextInput, Image, StyleSheet, Platform, ImageBackground, Button } from "react-native";
import * as ImagePicker from 'expo-image-picker';

export default function FormRecetasScreen() {
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [ingredientes, setIngredientes] = useState([]);
  const [imageUri, setImageUri] = useState(null);

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
    }
  };

  const agregarIngrediente = () => {
    if (!nombre.trim() || !cantidad.trim()) return;
    setIngredientes([...ingredientes, { id: Date.now().toString(), nombre, cantidad }]);
    setNombre("");
    setCantidad("");
  };

  const eliminarIngrediente = (id) => {
    setIngredientes(ingredientes.filter(item => item.id !== id));
  };

  return (
    <ImageBackground 
      source={require("../assets/FondoPantallas.png")} 
      style={styles.background} 
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.Saludo}>
        <Image source={require("../assets/Recetas.png")} style={styles.ImgSaludo2}/>
        <Text style={styles.TextSaludo}>Nueva</Text>
        <Text style={[styles.TextSaludo, { paddingBlock: 0, top: 10 }]}>Receta</Text>
        <Image source={require("../assets/Recetas.png")} style={styles.ImgSaludo}/>
      </View>

      <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
        <View style={styles.Contenedor}>
          <Text style={styles.TitInput}>Nombre:</Text>
          <TextInput 
            placeholder="Nombre de la receta" 
            style={styles.input2} 
            placeholderTextColor="#999" 
          />

          <Text style={styles.TitInput}>Instrucciones:</Text>
          <TextInput 
            placeholder="Instrucciones"
            style={[styles.input2, { textAlignVertical: "top", height: 100 }]}
            multiline
            placeholderTextColor="#999"
          />

          <Text style={styles.TitInput}>Ingredientes:</Text>
          <View style={styles.InputCon}>
            <TextInput
              placeholder="Ingrediente"
              value={nombre}
              onChangeText={setNombre}
              style={styles.input3}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Cantidad"
              value={cantidad}
              onChangeText={setCantidad}
              style={styles.input3}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.btnMas} onPress={agregarIngrediente}>
              <Image source={require("../assets/mas.png")} style={styles.iconMas}/>
            </TouchableOpacity>
          </View>

          <Text style={styles.TitInput}>Ingredientes:</Text>
          <View style={styles.ConLista}>
            <ScrollView contentContainerStyle={{ paddingVertical: 5 }}>
              {ingredientes.map(item => (
                <TouchableOpacity key={item.id} onPress={() => eliminarIngrediente(item.id)}>
                  <Text style={styles.item}>{item.nombre} — {item.cantidad}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={{ alignItems: "center", marginTop: 20 }}>
            {imageUri && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
              </View>
            )}
            <TouchableOpacity style={styles.boton} onPress={pickImage}>
              <Text style={styles.textoBoton}>Seleccionar Imagen</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fila}>
            <View style={styles.columna}>
              <Text style={styles.TitInput}>Calorías:</Text>
              <TextInput
                placeholder="Calorías"
                value={nombre}
                onChangeText={setNombre}
                style={styles.inputInferior}
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.columna}>
              <Text style={styles.TitInput}>Dificultad:</Text>
              <TextInput
                placeholder="Dificultad"
                value={cantidad}
                onChangeText={setCantidad}
                style={styles.inputInferior}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.fila}>
            <View style={styles.columna}>
              <Text style={styles.TitInput}>No. Personas:</Text>
              <TextInput
                placeholder="No. Personas"
                value={nombre}
                onChangeText={setNombre}
                style={styles.inputInferior}
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.columna}>
              <Text style={styles.TitInput}>Presupuesto:</Text>
              <TextInput
                placeholder="Presupuesto"
                value={cantidad}
                onChangeText={setCantidad}
                style={styles.inputInferior}
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  boton: {
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
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
    top: -70,        
  },
  Saludo: {
    bottom:30,
    marginBlock:10,
    width: "100%",
    height:"14%",
    alignItems:"center",
  },
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
    width: "60%",    
    height: "60%",   
    resizeMode: "contain",
    position: "absolute",
    top:30,     
  }, 
  ImgSaludo: {
    width: "60%",    
    height: "60%",   
    resizeMode: "contain",
    position: "absolute",
    right:240,
    top:30,     
  }, 
  Contenedor:{
    borderRadius:40,
    paddingBlock:20,
    padding:10,
    alignItems:"center",
    backgroundColor:"#EDEDED",
    minHeight:630,
    width:360,
  },
  TitInput:{
    fontWeight:"bold",
    left:20,
    alignSelf:"flex-start",
  },
  InputCon:{
    gap:10,
    flexDirection:"row",
  },
  input2: {
    width: "90%",
    height:50,
    backgroundColor: "#D9D9D9",
    padding: 12,
    marginBlock: 10,
  },
  input3: {
    width:130,
    height:46,
    backgroundColor:"#D9D9D9",
    left:10,
    padding: 12,
    marginBlock: 10,
  },
  btnMas: {
    top:12,
    padding: 5,
  },
  iconMas: {
    width: 30,
    height: 30,
  },
  ConLista:{
    borderColor:"gray",
    borderRadius:10,
    borderWidth:1,
    height:140,
    width:"90%",
  },
  item: {
    marginLeft:15,
    padding: 10,
    backgroundColor: "#eee",
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 10,
    gap: 10,
  },
  columna: {
    flex: 1,
    alignItems: "flex-start",
  },
  inputInferior: {
    width: "100%",
    height: 46,
    backgroundColor: "#D9D9D9",
    padding: 12,
    marginTop: 5,
  },
});