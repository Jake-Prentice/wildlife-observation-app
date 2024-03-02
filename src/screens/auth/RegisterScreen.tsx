// RegisterScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardTypeOptions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig'; // Adjust the import path as necessary
import { FirebaseError } from 'firebase/app';
import styles from "./style"
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UnAuthStackParamList } from '@/navigation/UnAuthStackNavigator';
import { doc, setDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export type RegisterScreenRouteProp = RouteProp<UnAuthStackParamList, 'Register'>;
export type RegisterScreenNavigationProp = NativeStackNavigationProp<UnAuthStackParamList,'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const passwordCheck = () => {
    if (confirmPassword != '' && confirmPassword != password) {
      setError("Passwords do not match");
    } else {
      if (error == "Passwords do not match") {
        setError('');
      }
    }
  }

  const handleRegister = async () => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      // Check if user was created successfully and user object exists
      if (userCredentials.user) {
        // Update the user's profile with the username as the display name
        await updateProfile(userCredentials.user, {
          displayName: username,
        });

        // Create a user-stats document for the user
        //TODO - maybe make this into a separate function
        const userStatRef = doc(db, 'user-stats', userCredentials.user.uid);
        await setDoc(userStatRef, {
          uid: userCredentials.user.uid,
          numObservations: 0,
          contributions: 0,
        });

        console.log('User registered with display name:', username);
        setError(''); // Clear any previous error
      }
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
            case 'auth/missing-email':
              setError("Please enter an email address");
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

  

  const RegisterPasswordBox = (prop:textBoxProp) => {
    const [focused,setFocused] = useState(false);
    const [text,setText] = useState(prop.val);
    const [visible,setVisible] = useState(false);

    useEffect (() => {
      passwordCheck()
    }, [prop.val]);
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
      onEndEditing={() => {prop.valHook(text);}}
      secureTextEntry={!visible}
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
      <Text style={styles.title}>Register</Text>
      <TextBox
        placeholder='Username'
        val = {username}
        valHook = {setUsername}
        keyboard='default'
        />
        <TextBox
        placeholder='Email'
        val = {email}
        valHook = {setEmail}
        keyboard='email-address'
        />
        <RegisterPasswordBox
        placeholder='Password'
        val = {password}
        valHook = {setPassword}
        keyboard='default'
        />
        <RegisterPasswordBox
        placeholder='Confirm password'
        val = {confirmPassword}
        valHook = {setConfirmPassword}
        keyboard='default'
        />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={{width:'100%'}} onPress={handleRegister}>
        <LinearGradient style={styles.button} colors={["#005FEF", "#3d8afe"]}>
              <Text style={styles.buttonText}>Register</Text>
          </LinearGradient>
        </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.registerButton}
      >
        <Text style={styles.registerButtonText}>Already have an account? Login</Text>
      </TouchableOpacity>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
};


export default RegisterScreen