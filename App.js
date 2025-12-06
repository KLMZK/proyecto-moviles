import React from "react";
import { Image,Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ContrasenaScreen from "./screens/ContraseñaScreen";
import InfoComidasScreen from "./screens/InfoComidasScreen";
import InicioScreen from "./screens/InicioScreen";
import RecetasScreen from "./screens/RecetasScreen";
import IngredientesScreen from "./screens/IngredientesScreen";
import PlanesScreen from "./screens/PlanesScreen";
import PerfilScreen from "./screens/PerfilScreen";
import FormRecetasScreen from "./screens/FormRecetasScreen";
import FormIngredientesScreen from "./screens/FormIngredientesScreen";
import VistasComidaScreen from "./screens/VistasComidaScreen";

const Stack = createStackNavigator();
const Tab=createBottomTabNavigator();

export function TabScreen(){
  return(
    <Tab.Navigator screenOptions={{headerShown: false, tabBarActiveTintColor: "gray", tabBarInactiveTintColor: "black", tabBarStyle: { height: 80, backgroundColor: "#D9D9D9" },tabBar: (props) => <CustomTabBar />}}>
      <Tab.Screen name="Inicio" component={InicioScreen} options={{tabBarIcon: ({ focused, size }) => (<Image source={require("./assets/home.png")}style={{width: size,height: size,tintColor: focused ? "gray" : "black",}}/>),}}/>
      <Tab.Screen name="Recetas" component={RecetasScreen}  options={{tabBarIcon: ({ focused, size }) => (<Image source={require("./assets/Recetas.png")}style={{width: size,height: size,tintColor: focused ? "gray" : "black",}}/>),}}/>
      <Tab.Screen name="Ingredientes" component={IngredientesScreen} options={{tabBarIcon: ({ focused, size }) => (<Image source={require("./assets/Ingredientes.png")}style={{width: size,height: size,tintColor: focused ? "gray" : "black",}}/>),}}/>
      <Tab.Screen name="Planes" component={PlanesScreen} options={{tabBarIcon: ({ focused, size }) => (<Image source={require("./assets/Planes.png")}style={{width: size,height: size,tintColor: focused ? "gray" : "black",}}/>),}}/>
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{tabBarIcon: ({ focused, color, size }) => (<Image source={require("./assets/usuario1.png")}style={{width: size,height: size,tintColor: focused ? "gray" : "black",}}/>),}}/>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Contrasena" component={ContrasenaScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="InfoComidas" component={InfoComidasScreen} />
        <Stack.Screen name="HomeTabs" component={TabScreen} />
        <Stack.Screen name="FormRecetas" component={FormRecetasScreen} />
        <Stack.Screen name="FormIngredientes" component={FormIngredientesScreen} />
        <Stack.Screen name="ComiditasVistas" component={VistasComidaScreen} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}