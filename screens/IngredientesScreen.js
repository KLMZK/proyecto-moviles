import React, { useEffect, useState } from "react"; 
import { TouchableOpacity, View, Text, Image, StyleSheet, ImageBackground, KeyboardAvoidingView, ScrollView, Platform } from "react-native"; 
import Checkbox from 'expo-checkbox'; 
import { useNavigation } from "@react-navigation/native"; 
import ip from './global';

export default function IngredientesScreen() {
  const direccion = ip();
  const navigation = useNavigation();
  const defaultCategories = {
    'Frutas y Verduras': [],
    'Panadería y Pastelería': [],
    'Refrigerados': [],
    'Carnicería': [],
    'Pescadería': [],
    'Congelados': [],
    'Despensa / Secos (Abarrotes)': [],
    'Bebidas': [],
    'Snacks y Dulces': [],
  };
    const [ingredients, setIngredients] = useState(defaultCategories);
   const [checks, setChecks] = useState({});

   useEffect(() => {
    const fetchIngredients = () => {
      fetch(`http://${direccion}/moviles/SelectIngredientes.php`)
        .then(res => res.json())
        .then(data => {
          let categorized = defaultCategories;
          if (Array.isArray(data)) {
            categorized = categorizeIngredients(data);
          } else if (data && typeof data === 'object') {
            if (data.ingredientes && typeof data.ingredientes === 'object') {
              categorized = { ...defaultCategories, ...data.ingredientes };
            } else if (Array.isArray(data.data)) {
              categorized = categorizeIngredients(data.data);
            }
          }
          setIngredients(categorized);
          initializeChecks(categorized);
        })
        .catch(err => {
          console.error(err);
          setIngredients(defaultCategories);
          setChecks({});
        });
    };
    fetchIngredients();
   }, []);

   const categorizeIngredients = (data) => {
     const categories = {
       'Frutas y Verduras': [],
       'Panadería y Pastelería': [],
       'Refrigerados': [],
       'Carnicería': [],
       'Pescadería': [],
       'Congelados': [],
       'Despensa / Secos (Abarrotes)': [],
       'Bebidas': [],
       'Snacks y Dulces': [],
     };
    // si no es array devolvemos las categorías vacías (solo nombres)
    if (!Array.isArray(data)) return JSON.parse(JSON.stringify(categories));
    data.forEach(item => {
      if (item && item.clasificacion && categories[item.clasificacion]) {
        categories[item.clasificacion].push(item);
      }
    });
    return categories;
   };

   const initializeChecks = (categorizedIngredients) => {
     const initialChecks = {};
     Object.keys(categorizedIngredients).forEach(category => {
       categorizedIngredients[category].forEach(item => {
         initialChecks[item.nombre] = false;
       });
     });
     setChecks(initialChecks);
   };

   return (
     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} >
       <ImageBackground source={require("../assets/FondoPantallas.png")} style={styles.background} imageStyle={styles.backgroundImage}>
         <View style={styles.Saludo}>
           <Image source={require("../assets/Ingredientes.png")} style={styles.ImgSaludo2}/>
           <Text style={styles.TextSaludo}>Ingredientes</Text>
           <Image source={require("../assets/Ingredientes.png")} style={styles.ImgSaludo}/>
         </View>
         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
           <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
             <View style={styles.Contenedor}>
               <View style={[styles.Contenido,{height:40,marginVertical:0}]}>
                 <TouchableOpacity style={styles.btnMas} onPress={() => navigation.navigate('FormIngredientes')}>
                   <Image source={require("../assets/mas.png")} style={styles.iconMas}/>
                   <Text style={[styles.Text,{left:40, bottom:28, fontWeight:"bold"}]}>Agregar</Text>
                 </TouchableOpacity>
               </View>
               {Object.keys(ingredients).map(category => (
                 <View key={category}>
                   <Text style={styles.TextCla}>{category}</Text>
                   {ingredients[category].map(item => (
                     <View key={item.nombre} style={[styles.Contenido, {alignItems:"center"}]}>
                       <Checkbox value={checks[item.nombre]} onValueChange={() => setChecks({ ...checks, [item.nombre]: !checks[item.nombre] })} color={checks[item.nombre] ? "#4CAF50" : undefined}/>
                       <Text style={[styles.Text,{width:100, left:20}]}>{item.nombre}</Text>
                       <Text style={[styles.Text,{width:80, left:40}]}>Qty: {item.cantidad}</Text>
                       <Text style={[styles.Text,{width:80, left:50}]}>${item.costo}</Text>
                     </View>
                   ))}
                 </View>
               ))}
             </View>
           </ScrollView>
         </ScrollView>
       </ImageBackground>
     </KeyboardAvoidingView>
   );
 }

 const styles = StyleSheet.create({ 
   btnMas: {
     padding: 5,
   },
   iconMas: {
     width: 30,
     height: 30,
   },
   Text:{ 
     fontSize:16, 
   }, 
   Contenido:{ 
     width:"100%", 
     flexDirection:"row", 
     justifyContent:"flex-start", 
     marginVertical: 5 
   }, 
   TextCla:{ 
     fontSize:20, 
     fontWeight:"bold", 
     marginTop:10 
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
     top:-30,
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
     top:20, 
   }, 
   ImgSaludo: { 
     width: "60%", 
     height: "60%", 
     resizeMode: "contain", 
     position: "absolute", 
     right:240, top:20, 
   }, 
   Contenedor:{ 
     borderRadius:40, 
     paddingBlock:20, 
     padding:30, 
     alignItems:"flex-start",
     backgroundColor:"#EDEDED", 
     minHeight:630, 
     width:360, 
   }, 
 });