import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    loginBox: {
      flex:0,
      width:'80%',
      height:'auto',
      borderRadius: 10,
      borderWidth:0.75,
      borderColor:'gray',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    passwordContainer: {
      flexDirection: 'row',
      width:'100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      
    },
    passwordField: {
      flex:1,
    },
    passwordIcon: {
      aspectRatio:1,
      alignItems:'center',
      justifyContent:'center',
      borderRadius:25,

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
      shadowColor:'dodgerblue',
      shadowOffset: {width: 0,height: 0},
      shadowOpacity:0,
      shadowRadius:2,
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