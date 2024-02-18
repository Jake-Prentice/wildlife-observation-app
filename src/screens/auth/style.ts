import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    button: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      width: '100%',
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
    },
    error: {
      color: 'red',
      marginBottom: 10,
    },
  
    registerButton: {
      marginTop: 10,
    },
    registerButtonText: {
      color: 'blue', 
    },
  });

  export default styles