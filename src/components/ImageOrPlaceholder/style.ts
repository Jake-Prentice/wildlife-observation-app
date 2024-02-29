import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    imagePlaceholder: {
        flex: 1, // each placeholder will take up equal space
        aspectRatio: 1, // if you want to keep your placeholders as squares
        marginHorizontal: 5, // this will ensure a little space between the placeholders
        backgroundColor: '#e4e4e4',
        alignItems: 'center',
        justifyContent: 'center',
        // Adjust borderRadius and other styles as needed
    },
    imagePlaceholderText: {
      fontSize: 24,
      color: '#000',
    },
  });
  
  export default styles;