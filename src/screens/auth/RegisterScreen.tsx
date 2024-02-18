// RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig'; // Adjust the import path as necessary
import { FirebaseError } from 'firebase/app';
import styles from "./style"

const RegisterScreen = ({navigation}: {navigation:any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log(userCredentials)
      // Registration successful
      setError(''); // Clear any previous error
      // Navigate to the main app screen here if needed
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
        onPress={() => navigation.navigate('Login')} // Use your navigation method here
        style={styles.registerButton}
      >
        <Text style={styles.registerButtonText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};


export default RegisterScreen