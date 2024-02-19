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
import BottomNavigator from './components/BottomNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//screens
import {LoginScreen, RegisterScreen} from './screens/auth';
import { UserProvider, useUser } from './contexts/UserContext';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const Routes = () => {
  const user = useUser();
  return !user.info ? <AuthStack /> : <BottomNavigator />
}

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <UserProvider>
        <NavigationContainer>
          <Routes />
          <StatusBar style="auto" />
        </NavigationContainer>
      </UserProvider>
    </GluestackUIProvider>
  );
};
