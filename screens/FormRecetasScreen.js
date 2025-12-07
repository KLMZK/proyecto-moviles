import React, { useState, useEffect, useMemo } from "react";
import { TouchableOpacity, View, Text, TextInput, Image, StyleSheet, ImageBackground, KeyboardAvoidingView, ScrollView, Platform , Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import ip from './global';
import { useNavigation } from "@react-navigation/native";

export default function FormRecetasScreen() {
  const direccion = ip();
  const navigation = useNavigation();
  const [nombre, setNombre] = useState("");
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [selectedIngrId, setSelectedIngrId] = useState("");
  const [instrucciones, setInstrucciones] = useState("");
  const [calorias, setCalorias] = useState("");
  const [dificultad, setDificultad] = useState("");
  const [personas, setPersonas] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [clas, setClas] = useState("");
  const [clasificacion, setClasificacion] = useState("");
  const [ListIngr, setLisIngr] = useState([]);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    fetch(`http://${direccion}/moviles/SelectIngredientes.php`)
      .then(res => res.json())
      .then(data => {
        const list = [];
        if (data && data.ingredientes) {
          Object.keys(data.ingredientes).forEach(cat => {
            data.ingredientes[cat].forEach(item => {
              list.push({
                cve_ingrediente: item.cve_ingrediente || item.CVE_INGREDIENTE || item.id,
                nombre: item.nombre,
                cantidad: item.cantidad,
                clasificacion: cat
              });
            });
          });
        }
        setAvailableIngredients(list);
      })
      .catch(err => {
        console.error("Error cargando ingredientes:", err);
        setAvailableIngredients([]);
      });
  }, []);

  const filteredIngredients = useMemo(() => {
    if (!clasificacion) return availableIngredients;
    return availableIngredients.filter(i => i.clasificacion === clasificacion);
  }, [availableIngredients, clasificacion]);

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
    if (!selectedIngrId || !cantidad.trim()) {
      Alert.alert("Error", "Seleccione un ingrediente y especifique cantidad");
      return;
    }
    const sel = availableIngredients.find(i => String(i.cve_ingrediente) === String(selectedIngrId));
    if (!sel) return;
    setLisIngr([...ListIngr, {
      id: Date.now().toString(),
      cve_ingrediente: sel.cve_ingrediente,
      ingrediente: sel.nombre,
      cantidad,
      clasificacion: sel.clasificacion || clasificacion
    }]);
    setSelectedIngrId("");
    setCantidad("");
  };
  
  const eliminarIngrediente = (id) => {
    setLisIngr(ListIngr.filter(item => item.id !== id));
  };
  
  function enviar() {
    const formData = new FormData();
    formData.append("nombre", nombre.trim());
    formData.append("clas", clas.trim());
    formData.append("instrucciones", instrucciones.trim());
    formData.append("ingrediente", JSON.stringify(ListIngr));
    formData.append("calorias", calorias.trim());
    formData.append("dificultad", dificultad.trim());
    formData.append("personas", personas.trim());
    formData.append("presupuesto", presupuesto.trim());
    if (imageUri) formData.append("imagen", {uri: imageUri, type: "image/jpeg", name: `foto_"${nombre}".jpg`});
 
    fetch(`http://${direccion}/moviles/FormRecetas.php`,{
      method: 'POST', 
      headers: {},
      body: formData
    })
    .then(response => response.json())
    .then(datos => {
      if(datos.ingreso == 1) {
        navigation.goBack();
         Alert.alert("Exito","Receta guardada correctamente.")
      } else {
        Alert.alert("Error", "La receta no se ha guardado correctamente. Intentelo de nuevo")
      }
    });
    setLisIngr([]);
    setNombre("");
    setInstrucciones("");
    setCalorias("");
    setDificultad("");
    setPersonas("");
    setPresupuesto("");
    setImageUri("");
    setClas("");
    setClasificacion("");
  }
  
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground source={require("../assets/FondoPantallas.png")} style={styles.background} imageStyle={styles.backgroundImage}>
          <View style={styles.Saludo}>
            <Image source={require("../assets/Recetas.png")} style={styles.ImgSaludo2}/>
            <Text style={styles.TextSaludo}>Nueva</Text>
            <Text style={[styles.TextSaludo, { paddingBlock: 0, top: 10 }]}>Receta</Text>
            <Image source={require("../assets/Recetas.png")} style={styles.ImgSaludo}/>
          </View>
          <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
            <View style={styles.Contenedor}>
              <Text style={styles.TitInput}>Nombre:</Text>
              <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre de la receta" style={styles.input2} placeholderTextColor="#999" />
              <Text style={styles.TitInput}>Clasificación de la receta:</Text>
              <Picker selectedValue={clas} onValueChange={(itemValue) => setClas(itemValue)} style={[styles.input2]}>
                <Picker.Item label="Seleccionar" value="" />
                <Picker.Item label="Desayuno" value="1" />
                <Picker.Item label="Comida" value="2" />
                <Picker.Item label="Cena" value="3" />
                <Picker.Item label="Bebidas" value="4" />
                <Picker.Item label="Postres" value="5" />
                <Picker.Item label="Snacks" value="6" />
              </Picker>
              <Text style={styles.TitInput}>Instrucciones:</Text>
              <TextInput value={instrucciones} onChangeText={setInstrucciones} placeholder="Instrucciones" style={[styles.input2, { textAlignVertical: "top", height: 100 }]} multiline placeholderTextColor="#999"/>
              
              <Text style={styles.TitInput}>Tipo (filtro ingredientes):</Text>
              <Picker selectedValue={clasificacion} onValueChange={(v) => setClasificacion(v)} style={[styles.input2]}>
                <Picker.Item label="Todos los tipos" value="" />
                <Picker.Item label="Frutas y Verduras" value="Frutas y Verduras" />
                <Picker.Item label="Panadería y Pastelería" value="Panadería y Pastelería" />
                <Picker.Item label="Refrigerados" value="Refrigerados" />
                <Picker.Item label="Carnicería" value="Carnicería" />
                <Picker.Item label="Pescadería" value="Pescadería" />
                <Picker.Item label="Congelados" value="Congelados" />
                <Picker.Item label="Despensa / Secos (Abarrotes)" value="Despensa / Secos (Abarrotes)" />
                <Picker.Item label="Bebidas" value="Bebidas" />
                <Picker.Item label="Snacks y Dulces" value="Snacks y Dulces" />
              </Picker>

              <Text style={styles.TitInput}>Ingredientes:</Text>
              <View style={{ flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <View style={[styles.fila,{left:20,}]}>
                    <Picker selectedValue={selectedIngrId} onValueChange={(v)=> setSelectedIngrId(v)} style={styles.inputInferior}>
                      <Picker.Item label="Seleccionar Ingrediente" value="" />
                      {filteredIngredients.map(ing => (
                        <Picker.Item key={ing.cve_ingrediente} label={`${ing.nombre}`} value={String(ing.cve_ingrediente)} />
                      ))}
                    </Picker>
                  </View>

                  <View style={[styles.fila,{left:20,}]}>
                    <TextInput placeholder="Cantidad" value={cantidad} keyboardType={"decimal-pad"} onChangeText={setCantidad} style={styles.inputInferior} placeholderTextColor="#999"/>
                  </View>
                </View>
                <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}} onPress={agregarIngrediente}>
                  <Image source={require("../assets/mas.png")} style={{ width: 28, height: 28 }} />
                </TouchableOpacity>
              </View>

              <Text style={styles.TitInput}>Lista ingredientes:</Text>
              <View style={styles.ConLista}>
                <ScrollView contentContainerStyle={{ paddingVertical: 5 }}>
                  {ListIngr.map(item => (
                    <TouchableOpacity key={item.id} onPress={() => eliminarIngrediente(item.id)}>
                      <Text style={styles.item}>• {item.clasificacion}: {"\n"} - {item.ingrediente} — [{item.cantidad}]</Text>
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
                  <TextInput keyboardType={"decimal-pad"} placeholder="Calorías" value={calorias} onChangeText={setCalorias} style={[styles.inputInferior,{width:147}]} placeholderTextColor="#999"/>
                </View>
                <View style={styles.columna}>
                  <Text style={styles.TitInput}>Dificultad:</Text>
                  <Picker selectedValue={dificultad} onValueChange={(itemValue) => setDificultad(itemValue)} style={[styles.inputInferior,{width:147}]}>
                    <Picker.Item label="Dificultad" value="" />
                    <Picker.Item label="Fácil" value="Fácil" />
                    <Picker.Item label="Medio" value="Medio" />
                    <Picker.Item label="Difícil" value="Difícil" />
                  </Picker>
                </View>
              </View>

              <View style={styles.fila}>
                <View style={styles.columna}>
                  <Text style={styles.TitInput}>No. Personas:</Text>
                  <TextInput keyboardType="numeric" placeholder="No. Personas" value={personas} onChangeText={setPersonas} style={[styles.inputInferior,{width:147}]} placeholderTextColor="#999"/>
                </View>
                <View style={styles.columna}>
                  <Text style={styles.TitInput}>Presupuesto:</Text>
                  <TextInput keyboardType={"decimal-pad"} placeholder="Presupuesto" value={presupuesto} onChangeText={setPresupuesto} style={[styles.inputInferior,{width:147}]} placeholderTextColor="#999"/>
                </View>
              </View>

              <TouchableOpacity style={[styles.boton,{top:10}]} onPress={enviar}>
                <Text style={styles.textoBoton}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
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
    top:-225,        
  },
  Saludo: {
    bottom:30,
    width: "100%",
    height:"11%",
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
  input2: {
    width: "90%",
    height:50,
    backgroundColor: "#D9D9D9",
    padding: 12,
    marginBlock: 10,
  },
  inputInferior: {
    flex: 1,
    height: 55,
    backgroundColor: "#D9D9D9",
    padding: 12,
    marginTop: 5,
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
});

