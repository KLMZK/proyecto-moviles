import React, { useState, useEffect, useMemo } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from "react";
import { TouchableOpacity, ScrollView, View, Text, Image, StyleSheet, ImageBackground, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";
import ip from './global';

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0,0,0,0);
  return d;
}
function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}
const DAY_NAMES = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

export default function RecetaScreen() {
  const navigation = useNavigation();
  const direccion = ip();
 
  // recargar al obtener foco (cuando seleccionas la pestaña / vuelves a la pantalla)
  useFocusEffect(
    useCallback(() => {
      fetchAgenda();
      fetchRecipes();
      fetchWeeklyTotals();
      fetchClassifications();
      // no cleanup necesario
    }, [weekRange])
  );
  
  const [period, setPeriod] = useState('current');
  const [agendaItems, setAgendaItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [showAdd, setShowAdd] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState({});
  const [classifications, setClassifications] = useState([]); // lista de clasificaciones
  const [selectedClass, setSelectedClass] = useState({});     // map fecha -> clasificacion seleccionada
  const [weeklyTotals, setWeeklyTotals] = useState([]);
  
  async function fetchClassifications() {
    try {
      const res = await fetch(`http://${direccion}/moviles/SelectCategorias.php`);
      const data = await res.json();
      setClassifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando clasificaciones:", err);
    }
  }
  
  const weekRange = useMemo(() => {
    const today = new Date();
    const base = startOfWeek(today);
    if (period === 'previous') base.setDate(base.getDate() - 7);
    if (period === 'next') base.setDate(base.getDate() + 7);
    const start = new Date(base);
    const end = new Date(base);
    end.setDate(end.getDate() + 6);
    return { start, end };
  }, [period]);
  
  useEffect(() => {
    fetchAgenda();
    fetchRecipes();
    fetchWeeklyTotals(); // obtiene resumen al montar / cambiar semana
    fetchClassifications();
  }, [weekRange]);
  
  async function fetchRecipes() {
    try {
      const res = await fetch(`http://${direccion}/moviles/SelectRecetas.php`);
      const data = await res.json();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando recetas:", err);
    }
  }

  async function fetchAgenda() {
    setLoading(true);
    try {
      const start = formatDate(weekRange.start);
      const end = formatDate(weekRange.end);
      const res = await fetch(`http://${direccion}/moviles/SelectAgenda.php?start=${start}&end=${end}`);
      const data = await res.json();
      setAgendaItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      Alert.alert('Error','No se pudo cargar la agenda');
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeeklyTotals() {
    try {
      const start = formatDate(weekRange.start);
      const end = formatDate(weekRange.end);
      const res = await fetch(`http://${direccion}/moviles/SelectWeeklyIngredients.php?start=${start}&end=${end}`);
      const data = await res.json();
      setWeeklyTotals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando totales semanales:", err);
    }
  }

  async function addToAgenda(fecha) {
    const cve = selectedRecipe[fecha];
    if (!cve) { Alert.alert('Selecciona', 'Seleccione una receta'); return; }
    try {
      const res = await fetch(`http://${direccion}/moviles/AddAgenda.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cve_receta: cve, fecha })
      });
      const json = await res.json();
      if (json.estado == 1) {
        setShowAdd(prev => ({ ...prev, [fecha]: false }));
        setSelectedRecipe(prev => ({ ...prev, [fecha]: undefined }));
        // recargar agenda y totales (ingredientes) para que la zona de ingredientes se actualice
        await fetchAgenda();
        await fetchWeeklyTotals();
      } else {
        Alert.alert('Error','No se pudo agregar a la agenda');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error','No se pudo conectar al servidor');
    }
  }

  async function deleteAgendaItem(cve_agenda) {
    try {
      const res = await fetch(`http://${direccion}/moviles/DeleteAgenda.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cve_agenda })
      });
      const json = await res.json();
      if (json.estado == 1) {
        await fetchAgenda();           // esperar recarga de agenda
        await fetchWeeklyTotals();     // recargar totales para actualizar zona de ingredientes
      } else {
        Alert.alert('Error','No se pudo eliminar');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error','No se pudo conectar al servidor');
    }
  }
  
  const days = useMemo(() => {
    const daysArr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekRange.start);
      d.setDate(d.getDate() + i);
      const fecha = formatDate(d);
      daysArr.push({
        name: DAY_NAMES[i],
        fecha,
        items: agendaItems.filter(a => a.FECHA === fecha)
      });
    }
    return daysArr;
  }, [agendaItems, weekRange]);

  async function Preparado(item) {
    const nuevo = item.preparado == 1 ? 0 : 1;
    // optimista
    setAgendaItems(prev => prev.map(p => p.CVE_AGENDA === item.CVE_AGENDA ? {...p, preparado: nuevo} : p));
    try {
      const res = await fetch(`http://${direccion}/moviles/Preparado.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cve_agenda: item.CVE_AGENDA, preparado: nuevo })
      });
      const json = await res.json();
      if (!json || json.estado != 1) {
        // revertir y mostrar mensaje del servidor
        setAgendaItems(prev => prev.map(p => p.CVE_AGENDA === item.CVE_AGENDA ? {...p, preparado: item.preparado} : p));
        const mensaje = json && json.mensaje ? json.mensaje : 'No se pudo actualizar';
        Alert.alert('Error', mensaje);
      } else {
        // recargar agenda y totales para reflejar los ingredientes actualizados
        await fetchAgenda();
        await fetchWeeklyTotals();
      }
    } catch (err) {
      console.error(err);
      setAgendaItems(prev => prev.map(p => p.CVE_AGENDA === item.CVE_AGENDA ? {...p, preparado: item.preparado} : p));
      Alert.alert('Error','No se pudo conectar al servidor');
    }
  }
  
  // render — al final de la vista de semanas muestra el resumen
  return (
    <ImageBackground source={require("../assets/FondoPantallas.png")} style={styles.background} imageStyle={styles.backgroundImage}>
      <View style={styles.Saludo}>
        <Image source={require("../assets/Planes.png")} style={styles.ImgSaludo2}/>
        <Text style={styles.TextSaludo}>Planificador</Text>
        <Image source={require("../assets/Planes.png")} style={styles.ImgSaludo}/>
      </View>

      <View style={styles.InputContenedor}>
        <Image source={require("../assets/calendario.png")} style={[styles.icon, {width:20, height:20}]}/>
        <Picker selectedValue={period} onValueChange={(v) => setPeriod(v)} style={styles.inputInferior}>
          <Picker.Item label="Semana anterior" value="previous" />
          <Picker.Item label="Semana actual" value="current" />
          <Picker.Item label="Próxima semana" value="next" />
        </Picker>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.Contenedor}>
          {days.map(day => (
            <View key={day.fecha} style={styles.DiaBlock}>

              <View style={[styles.DiaHeader, styles.DiaHeaderRow]}>
                <Text style={styles.DiaTitulo}>{day.name} — {day.fecha}</Text>
                <TouchableOpacity onPress={() => setShowAdd(prev => ({ ...prev, [day.fecha]: !prev[day.fecha] }))} style={styles.addToggle}>
                  <Text style={styles.addToggleText}>{ showAdd[day.fecha] ? 'Cancelar' : 'Agregar receta' }</Text>
                </TouchableOpacity>
              </View>

              { showAdd[day.fecha] && (
                <View style={[styles.addPanel,{ marginBottom: 12 }]}>
                  <View style={styles.addCard}>
                    <Picker
                      selectedValue={selectedClass[day.fecha] ?? ""}
                      onValueChange={(v) => setSelectedClass(prev => ({ ...prev, [day.fecha]: v }))}
                    >
                      <Picker.Item label="Todas las clasificaciones" value="" />
                      {classifications.map(c => <Picker.Item key={c.CVE_CATEGORIA} label={c.NOMBRE} value={c.CVE_CATEGORIA} />)}
                    </Picker>

                    <Picker selectedValue={selectedRecipe[day.fecha] ?? ""} onValueChange={(v) => setSelectedRecipe(prev => ({ ...prev, [day.fecha]: v }))}>
                      <Picker.Item label="Seleccionar receta" value="" />
                      {recipes
                        .filter(r => {
                          const sel = selectedClass[day.fecha];
                          if (!sel || sel === '') return true;
                          return r.CVE_CATEGORIA == sel || r.cve_categoria == sel || r.CVE_CATEGORIA === sel;
                        })
                        .map(r => <Picker.Item key={r.CVE_RECETA} label={`${r.NOMBRE}`} value={r.CVE_RECETA} />)}
                    </Picker>
                    <TouchableOpacity style={[styles.boton, { marginTop: 8 }]} onPress={() => addToAgenda(day.fecha)}>
                      <Text style={styles.textoBoton}>Agregar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <ScrollView
                horizontal
                nestedScrollEnabled={true}                   
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.ContHorizon]}  
              >
                {day.items.length === 0 ? (
                  <View style={styles.EmptyCard}><Text style={styles.emptyText}>Sin recetas</Text></View>
                ) : day.items.map(item => (
                  <View key={item.CVE_AGENDA} style={styles.Card}>
                    <TouchableOpacity onPress={() => navigation.navigate("InfoComidas", { cve: item.idReceta })}>
                      <Image style={styles.ImgRecetas} source={{ uri: item.imagen }} />
                    </TouchableOpacity>
                    <View style={styles.CardInfo}>
                      <Text style={styles.infoTitulo}>{item.NOMBRE}</Text>
                      <View style={styles.infoContenido}>
                        <Text style={styles.detalles}>{item.CALORIAS} Kcal</Text>
                        <Text style={styles.detalles}>{item.TAMANO} Pers.</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                        <Text style={styles.detalles}>Preparado</Text>
                        <TouchableOpacity onPress={() => Preparado(item)} style={[styles.prepBtn, item.preparado == 1 ? styles.prepBtnOn : styles.prepBtnOff]}>
                          <Text style={styles.prepText}>{item.preparado == 1 ? 'Sí' : 'No'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteAgendaItem(item.CVE_AGENDA)} style={{ marginLeft: 8 }}>
                          <Text style={{ color: '#c33', fontWeight: 'bold' }}>Eliminar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          ))}
        </View>

        <View style={{ width: '95%', marginTop: 16, marginLeft:10, padding: 12, backgroundColor: '#fff', borderRadius: 12 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Resumen de ingredientes (semana)</Text>
          {weeklyTotals.length === 0 ? (
            <Text style={{ color: '#666' }}>No hay ingredientes para esta semana</Text>
          ) : weeklyTotals.map(i => (
            <View key={i.CVE_INGREDIENTE} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600' }}>{i.NOMBRE} {i.UNIDAD ? `(${i.UNIDAD})` : ''}</Text>
                <Text style={{ color: '#666', fontSize: 12 ,width:130}}>Necesario: {i.total_necesario} Disponible: {i.disponible}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontWeight: '600' }}>Faltante: {i.faltante}</Text>
                <Text style={{ color: '#c33' }}>Costo faltante: ${Number(i.costo_faltante).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  inputInferior: {
    flex: 1,
    height: 55,
    justifyContent: "center",
    textAlign:"center",
    fontSize: 18,
    color: "black",
  },
  TextSaludo: { 
     top:29, 
     fontWeight:"bold", 
     color:"white", 
     fontSize: 20, 
     alignSelf:"center", 
     paddingBlock:20, 
   }, 
  ContHorizon:{ paddingRight:20, flexDirection:"row", alignItems:'flex-start' },
  Contenedor:{ paddingVertical:10 },
  DiaBlock:{ marginBottom:20 },
  DiaHeader:{ paddingHorizontal:20, marginBottom:8 },
  DiaHeaderRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  DiaTitulo:{ color:"white", fontWeight:"bold", fontSize:16 },
  Card:{ width:180, marginLeft:20, backgroundColor:"#EDEDED", borderRadius:16, overflow:'hidden' },
  ImgRecetas:{ width: '100%', height:120, resizeMode:'cover' },
  CardInfo:{ padding:8 },
  infoTitulo:{ fontSize:14, fontWeight:'bold' },
  infoContenido:{ flexDirection:'row', justifyContent:'space-between', marginTop:6 },
  detalles:{ fontSize:12, color:'#444' },
  EmptyCard:{ width:180, marginLeft:20, height:160, borderRadius:12, justifyContent:'center', alignItems:'center', backgroundColor:'#f2f2f2' },
  addToggleText:{ color: '#fff', fontWeight: 'bold' },
  addToggle:{ padding: 8, borderRadius: 16, backgroundColor: '#5cb85c', alignSelf: 'flex-end' },
  addCard:{ flexDirection: 'column', },
  addPanel:{ width: '100%', backgroundColor: '#fff', borderRadius: 8, padding: 8, marginTop: 8 },
  InputContenedor:{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, width: "90%", height:70, backgroundColor: "#f1f1f1", borderRadius: 20 },
  backgroundImage:{ width:"100%", height:"100%", resizeMode:"contain", position:"absolute", top:-40 },
  background:{ flex:1, width:"100%", height:"100%", alignItems:"center", paddingTop:30, backgroundColor:"#3A4B41" },
  ImgSaludo:{ width:"60%", height:"60%", resizeMode:"contain", position:"absolute", right:240, top:30 },
  ImgSaludo2:{ alignSelf:"flex-end", left:240, width:"60%", height:"60%", resizeMode:"contain", position:"absolute", top:30 },
  Saludo:{ bottom:30, width:"100%", height:"14%", alignItems:"center" },
  prepText:{ color:'#fff', fontWeight:'bold' },
  prepBtnOff:{ backgroundColor:'#ddd' },
  prepBtnOn:{ backgroundColor:'#7fbf7f' },
  prepBtn:{ paddingHorizontal:12, paddingVertical:6, borderRadius:12 },
  emptyText:{ color:'#666' },
});