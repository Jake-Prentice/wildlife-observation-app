import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardTypeOptions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from "./style";
import { UnAuthStackParamList } from '@/navigation/UnAuthStackNavigator';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
export type LoginScreenNavigationProp = NativeStackNavigationProp<UnAuthStackParamList,'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      // Login successful
      setError(''); // Clear any previous error
    } catch (error) {
      if (error instanceof FirebaseError) {
        // Handle Firebase errors
        switch (error.code) {
          case 'auth/invalid-email':
            setError("Invalid email address");
            break;
          case 'auth/invalid-credential':
            setError("Account or password error");
            break;
          case 'auth/too-many-requests':
            setError("Login attempted too many times. Please try again later");
            break;
          case 'auth/missing-password':
            setError("Please enter a password");
            break;
          default:
            setError("An unexpected error occurred with firebase. Error code: " + error.code);
          }
        } else {
          // Handle non-Firebase errors
          setError('An unexpected error occurred');
        }
    }
  };


  type textBoxProp = {
    placeholder:string,
    val:string,
    valHook:React.Dispatch<React.SetStateAction<string>>,
    keyboard:KeyboardTypeOptions
  }
  //Makes keyboard buggy for some reason
  const TextBox = (prop: textBoxProp) => {
    const [focused,setFocused] = useState(false);
    const [text,setText] = useState(prop.val);
    return (
    <TextInput
        style={[styles.input,
          {backgroundColor: focused ? '#F0F0F0' : 'transparent'},
          {shadowOpacity: focused ? 0.5 : 0}, 
          {borderColor: focused ? 'royalblue' : 'gray'}]}
        placeholder={prop.placeholder}
        autoComplete='one-time-code'//disables autocomplete, have to include due to a bug with ios 17(keyboard top bar 'flickers')
        value={text}
        onChangeText={setText}
        onEndEditing={() => {prop.valHook(text)}}
        onFocus={() => {setFocused(true)}}
        onBlur={() => {setFocused(false)}}
        keyboardType={prop.keyboard}
        autoCapitalize="none"
      />);
  }

  const PasswordBox = (prop:textBoxProp) => {
    const [focused,setFocused] = useState(false);
    const [text,setText] = useState(prop.val);
    const [visible,setVisible] = useState(false);
    return (
    <View style={[styles.input,
      {backgroundColor: focused ? '#F0F0F0' : 'transparent'},
      {shadowOpacity: focused ? 0.5 : 0}, 
      {borderColor: focused ? 'royalblue' : 'gray'},
      styles.passwordContainer]}>
    <TextInput 
      style={styles.passwordField}
      placeholder={prop.placeholder}
      autoComplete='one-time-code'
      autoCapitalize="none"
      value={text}
      onFocus={() => {setFocused(true)}}
      onBlur={() => {setFocused(false)}}
      onChangeText={setText}
      secureTextEntry={!visible}
      onEndEditing={() => {prop.valHook(text)}}
      
    />
    <TouchableOpacity style={styles.passwordIcon} onPress={() => setVisible(!visible)}>
      <Ionicons name={visible ? "eye" : "eye-off"} size={20} />
    </TouchableOpacity>
    </View>
    );
  }
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} //Not sure if theres a better way to do this
    >
    <View style={styles.container}>
      <View style={styles.loginBox}>
      <Text style={styles.title}>Login</Text>
      <TextBox
        placeholder='Email'
        val = {email}
        valHook = {setEmail}
        keyboard='email-address'
        />
        <PasswordBox
        placeholder='Password'
        val = {password}
        valHook = {setPassword}
        keyboard='default'
        />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={{width:'100%'}} onPress={handleLogin}>
          <LinearGradient style={styles.button} colors={["#005FEF", "#3d8afe"]}>
              <Text style={styles.buttonText}>Log In</Text>
          </LinearGradient>
          </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')} // Use your navigation method here
        style={styles.registerButton}
      >
        <Text style={styles.registerButtonText}>Don't have an account? Register</Text>
      </TouchableOpacity>
      </View>
    </View>
  </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
