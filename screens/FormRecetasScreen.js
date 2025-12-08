import React, { useState, useEffect, useMemo } from "react";
import {TouchableOpacity,View,Text,TextInput,Image,StyleSheet,ImageBackground,KeyboardAvoidingView,ScrollView,Platform,Alert} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import ip from "./global";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function FormRecetasScreen() {
  const direccion = ip();
  const navigation = useNavigation();
  const route = useRoute();
  const receta = route.params?.receta || null;

  const [nombre, setNombre] = useState(receta?.NOMBRE ?? "");
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [selectedIngrId, setSelectedIngrId] = useState("");
  const [calorias, setCalorias] = useState(receta?.CALORIAS?.toString() ?? "");
  const [dificultad, setDificultad] = useState(receta?.DIFICULTAD ?? "");
  const [personas, setPersonas] = useState(receta?.TAMANO?.toString() ?? "");
  const [presupuesto, setPresupuesto] = useState(receta?.PRESUPUESTO?.toString() ?? "");
  const [cantidad, setCantidad] = useState("");
  const [clas, setClas] = useState(receta?.CLASIFICACION ?? "");
  const [clasificacion, setClasificacion] = useState("");
  const [imageUri, setImageUri] = useState(receta?.IMAGEN ?? null);
  const [ingredientesModificados, setIngredientesModificados] = useState(false);

  const [ListIngr, setLisIngr] = useState(
    receta?.INGREDIENTES
      ? receta.INGREDIENTES.map((i, index) => ({
          id: Date.now().toString() + index,
          cve_ingrediente: i.CVE_INGREDIENTE || i.cve_ingrediente || i.id,
          ingrediente: i.NOMBRE,
          cantidad: i.CANTIDAD,
          clasificacion: i.CLASIFICACION || ""
        }))
      : []
  );

  const [pasos, setPasos] = useState(() => {
    if (!receta?.DESCRIPCION) return [""];

    try {
      const arr = JSON.parse(receta.DESCRIPCION);
      if (Array.isArray(arr)) return arr;
    } catch {}

    return receta.DESCRIPCION.split("\n").map((p) =>
      p.replace(/Paso\s*\d+:\s*/i, "").trim()
    );
  });

  const actualizarPaso = (index, texto) => {
    const nuevosPasos = [...pasos];
    nuevosPasos[index] = texto;
    setPasos(nuevosPasos);
  };
  const agregarPaso = () => setPasos([...pasos, ""]);

  useEffect(() => {
    fetch(`http://${direccion}/moviles/SelectIngredientes.php`)
      .then((res) => res.json())
      .then((data) => {
        const list = [];
        if (data?.ingredientes) {
          Object.keys(data.ingredientes).forEach((cat) => {
            data.ingredientes[cat].forEach((item) =>
              list.push({
                cve_ingrediente: item.cve_ingrediente || item.CVE_INGREDIENTE || item.id,
                nombre: item.nombre,
                cantidad: item.cantidad,
                clasificacion: cat
              })
            );
          });
        }
        setAvailableIngredients(list);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const filteredIngredients = useMemo(() => {
    if (!clasificacion) return availableIngredients;
    return availableIngredients.filter((i) => i.clasificacion === clasificacion);
  }, [availableIngredients, clasificacion]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
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

    const sel = availableIngredients.find((i) => String(i.cve_ingrediente) === String(selectedIngrId));
    if (!sel) return;

    setLisIngr([
      ...ListIngr,
      {
        id: Date.now().toString(),
        cve_ingrediente: sel.cve_ingrediente,
        ingrediente: sel.nombre,
        cantidad,
        clasificacion: sel.clasificacion || clasificacion
      }
    ]);
    setSelectedIngrId("");
    setCantidad("");
    setIngredientesModificados(true);
  };

  const eliminarIngrediente = (id) => {
    setLisIngr(ListIngr.filter((item) => item.id !== id));
    setIngredientesModificados(true);
  };

function enviar() {
  const formData = new FormData();
  const accion = receta ? "editar" : "agregar";
  formData.append("accion", accion);

  if (receta?.CVE_RECETA) {
    formData.append("cve", receta.CVE_RECETA.toString());
  }

  formData.append("nombre", nombre.trim());
  formData.append("clas", clas.trim() || receta?.CLASIFICACION || "");
  formData.append("instrucciones", JSON.stringify(pasos.filter(p => p.trim() !== "")));

  if (ingredientesModificados) {
    formData.append("ingrediente", JSON.stringify(ListIngr));
  } else {
    formData.append("ingrediente", "__NO_CAMBIAR__");
  }

  formData.append("calorias", calorias.trim());
  formData.append("dificultad", dificultad.trim());
  formData.append("personas", personas.trim());
  formData.append("presupuesto", presupuesto.trim());

  if (imageUri && (!receta || !imageUri.startsWith("http"))) {
    formData.append("imagen", {
      uri: imageUri,
      type: "image/jpeg",
      name: "foto_temp.jpg"
    });
  }

  fetch(`http://${direccion}/moviles/FormRecetas.php`, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(datos => {
            console.log(datos);

      if (datos.ingreso == 1) {
        Alert.alert("Éxito", "Receta guardada correctamente.", [
          {
            text: "OK",
            onPress: () => {
              const cve = receta?.CVE_RECETA || datos.cveReceta;
              navigation.navigate("InfoComidas", { cve });
            }
          }
        ]);
      } else {
        Alert.alert("Error", datos.error || "No se pudo guardar. Intente de nuevo.");
      }
    })
    .catch(err => {
      console.error(err);
      Alert.alert("Error", "No se pudo conectar al servidor.");
    });
}

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground source={require("../assets/fondopantalla.png")} style={styles.background} imageStyle={styles.backgroundImage}>
          <View style={styles.Saludo}>
            <Image source={require("../assets/Recetas.png")} style={styles.ImgSaludo2}/>
            <Text style={styles.TextSaludo}>{receta ? "Editar" : "Nueva"}</Text>
            <Text style={[styles.TextSaludo, { paddingBlock: 0, top: 10 }]}>Receta</Text>
            <Image source={require("../assets/Recetas.png")} style={styles.ImgSaludo}/>
          </View>

          <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
            <View style={styles.Contenedor}>
              <Text style={styles.TitInput}>Nombre:</Text>
              <TextInput value={nombre} onChangeText={setNombre} style={styles.input2} />

              <Text style={styles.TitInput}>Clasificación:</Text>
              <Picker selectedValue={clas} onValueChange={(v) => setClas(v)} style={styles.input2}>
                <Picker.Item label="Seleccionar" value="" />
                <Picker.Item label="Desayuno" value="1" />
                <Picker.Item label="Comida" value="2" />
                <Picker.Item label="Cena" value="3" />
                <Picker.Item label="Bebidas" value="4" />
                <Picker.Item label="Postres" value="5" />
                <Picker.Item label="Snacks" value="6" />
                <Picker.Item label="Favoritos" value="7" />
              </Picker>

              <Text style={styles.TitInput}>Instrucciones:</Text>
              {pasos.map((paso, i) => (
                <TextInput key={i} value={paso} onChangeText={(t) => actualizarPaso(i, t)} style={styles.input2} placeholder={`Paso ${i + 1}`} />
              ))}
              <TouchableOpacity onPress={agregarPaso} style={[styles.boton, {marginBottom:10}]}>
                <Text style={styles.textoBoton}>Agregar paso</Text>
              </TouchableOpacity>

              <Text style={styles.TitInput}>Ingredientes:</Text>

              <Picker
                selectedValue={selectedIngrId}
                onValueChange={(v) => setSelectedIngrId(v)}
                style={[styles.input2,{width:280,right:10,height:55}]}
              >
                <Picker.Item label="Seleccionar Ingrediente" value="" />
                {filteredIngredients.map((i) => (
                  <Picker.Item key={i.cve_ingrediente} label={i.nombre} value={String(i.cve_ingrediente)} />
                ))}
              </Picker>

              <View style={{ flexDirection: "row", width: "100%", alignItems: "flex-start", marginTop: 5 }}>
                <TextInput
                  placeholder="Cantidad"
                  value={cantidad}
                  onChangeText={setCantidad}
                  style={[styles.input2,{left:18, bottom:10,width:280}]}
                />

                <TouchableOpacity
                  onPress={agregarIngrediente}
                  style={{ justifyContent: "flex-start", alignItems: "center", marginTop: 8, left:20,bottom:30, }}
                >
                  <Image source={require("../assets/mas.png")} style={{ width: 28, height: 28 }} />
                </TouchableOpacity>
              </View>

              <Text style={styles.TitInput}>Lista ingredientes:</Text>
              <View style={styles.ConLista}>
                <ScrollView contentContainerStyle={{ paddingVertical: 5 }}>
                  {ListIngr.map((item) => (
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
                <TextInput style={[styles.inputInferior, {flex:1}]} placeholder="Calorías" value={calorias} onChangeText={setCalorias}/>
                <Picker selectedValue={dificultad} onValueChange={setDificultad} style={[styles.inputInferior, {flex:1}]}>
                  <Picker.Item label="Dificultad" value=""/>
                  <Picker.Item label="Fácil" value="Fácil"/>
                  <Picker.Item label="Medio" value="Medio"/>
                  <Picker.Item label="Difícil" value="Difícil"/>
                </Picker>
              </View>

              <View style={styles.fila}>
                <TextInput style={[styles.inputInferior, {flex:1}]} placeholder="Personas" value={personas} onChangeText={setPersonas}/>
                <TextInput style={[styles.inputInferior, {flex:1}]} placeholder="Presupuesto" value={presupuesto} onChangeText={setPresupuesto}/>
              </View>

              <TouchableOpacity style={[styles.boton, {top:10}]} onPress={enviar}>
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
    width: '200%',
    height: '100%',
    resizeMode: "cover",
    position: "absolute",
  },
  Saludo: {
    backgroundColor:"#E6CFA6",
    bottom:30,
    width: "100%",
    height:140,
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
  input2: {
    width: "90%",
    height:50,
    backgroundColor: "#D9D9D9",
    padding: 12,
    marginBlock: 10,
  },
  inputInferior: {
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
