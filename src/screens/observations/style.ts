import { StyleSheet } from 'react-native';

const marginBottom=40;

const styles = StyleSheet.create({
    container: {
        // borderColor: 'blue',
        // borderWidth: 1,
        height: "100%",
        width: "100%",
        padding: 13,
    },
    helpButton: {
      alignSelf: 'flex-end',
      padding: 10,
    },
    helpButtonText: {
      fontSize: 16,
      color: '#0000FF',
    },
    inputContainer: {
      marginBottom: marginBottom,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#000',
      padding: 10,
      borderRadius: 5,
    },
    imagePickerContainer: {
        // borderColor: '#000',
        // borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: marginBottom,
    },
    image: {
        flex: 1, 
        aspectRatio: 1, 
        marginHorizontal: 2, 
    },
    textArea: {
      borderWidth: 1,
      borderColor: '#000',
      padding: 10,
      borderRadius: 5,
      height: 100,
      textAlignVertical: 'top',
    },
    submitButton: {
      backgroundColor: '#0000FF',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    submitButtonText: {
      fontSize: 18,
      color: '#FFF',
    },
    textContent: {
      
    }
  });
  
  export default styles;