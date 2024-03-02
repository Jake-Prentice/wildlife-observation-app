// RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig'; // Adjust the import path as necessary
import { FirebaseError } from 'firebase/app';
import styles from "./style"
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UnAuthStackParamList } from '@/navigation/UnAuthStackNavigator';
import { doc, setDoc } from 'firebase/firestore';

export type RegisterScreenRouteProp = RouteProp<UnAuthStackParamList, 'Register'>;
export type RegisterScreenNavigationProp = NativeStackNavigationProp<UnAuthStackParamList,'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const [error, setError] = useState('');

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
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.registerButton}
      >
        <Text style={styles.registerButtonText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};


export default RegisterScreen