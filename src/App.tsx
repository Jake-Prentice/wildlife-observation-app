//native
import { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle, Text} from 'react-native';
import { StatusBar } from 'expo-status-bar';
//gluestack
import {
  GluestackUIProvider, 
  Box, 
  Center
 } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config" // Optional if you want to use default theme
//react navigation
import { NavigationContainer} from '@react-navigation/native';
import BottomNavigator from './navigation/BottomNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//firebase
import {FIREBASE_AUTH} from "./FirebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth"
//screens
import {LoginScreen, RegisterScreen} from './screens/auth';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, setUser);
    return unsubscribe; 
  }, []);

  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        {!user ? <AuthStack /> : <BottomNavigator />}
        <StatusBar style="auto" />
      </NavigationContainer>
    </GluestackUIProvider>
  );
};
