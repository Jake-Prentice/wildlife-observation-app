import { StyleSheet } from 'react-native';

const marginBottom=40;

const styles = StyleSheet.create({
    container: {
        // borderColor: 'blue',
        // borderWidth: 1,
        height: "100%",
        width: "100%",
        padding: 13,
        backgroundColor: "white",
    },
    scrollContainer: {
      padding: 13,
      backgroundColor: "white",
      gap: 20
    },
    infoContainer: {
      // borderColor: '#000',
      // borderWidth: 1,
      padding: 10,
      backgroundColor: "#f5f5f5", 
      borderRadius: 10,
      marginBottom: 5,
      justifyContent:'center'
    },
    animalImageMain: {
      marginHorizontal:'15%',
      flexDirection: 'row',
      borderRadius:500,
      overflow:'hidden',
      marginBottom: 10
    },
    animalNameBig: {
      fontSize:32,
    },
    line: {
      borderBottomColor:'gray',
      borderBottomWidth:1,
      marginBottom:5
    },
    usernameText: {
      ///fontWeight: 'bold',
      fontSize:16,
      color:'gray'
    },
    animalNameInput: {
      flex:1,
      borderBottomWidth:1,
      borderColor:'gray',
      padding:10,
      marginRight:30,
      borderRadius:2
    },
    helpButton: {
      alignSelf: 'flex-end',
      
    },
    gradient:{
      padding:10,
      paddingHorizontal:15,
      borderRadius:10
    },
    helpButtonText: {
      fontSize: 16,
      color: '#FFF',
    },
    inputContainer: {
    },
    nameContainer: {
      flexDirection:'row',
      alignItems:'center',
      marginBottom: marginBottom/2,
      padding:10
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
    galleryImages: {
      // borderColor: '#000',
      // borderWidth: 1,
      flexDirection: 'row',
      maxHeight:'30%',
      justifyContent: 'space-between',
      alignItems: 'center',
      //marginBottom: marginBottom,
    },
    galleryImage: {
      // borderColor: '#000',
      // borderWidth: 1,
      aspectRatio:1,
      marginHorizontal:2,
      flex:1,
      borderRadius:2,
      maxWidth:'33%'
      //marginBottom: marginBottom,
    },
    image: {
        flex: 1, 
        aspectRatio: 1, 
        marginHorizontal: 2, 
        borderRadius:5,
        overflow:'hidden'
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
      alignSelf:'center'
    },
    submitButtonText: {
      fontSize: 18,
      color: '#FFF',
    },
    textContent: {
      paddingBottom:20,
      marginHorizontal:2,
      color:'gray'
    },

    animalNameContainer: {
      //marginBottom: marginBottom,
      backgroundColor: "white", 
      borderRadius:10,
      padding: 15,
      alignItems:'center'
    },

    animalNameButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // borderWidth: 1,
      // borderColor: '#000',
      padding: 10,
      borderRadius: 10,
      backgroundColor: "#f5f5f5",
      marginTop:5,
      marginBottom:15
    },
    animalNameText: {
      fontSize:16
    },

    animalNameIcon: {
      paddingLeft: 10,

      padding: 10,
      flex:0.2,
      justifyContent: 'center',
      alignItems: 'center',
    },

    scienceInfoContainer: {
      marginTop: 20,
      // padding: 10,
      // borderColor: '#000',
      // borderWidth: 1,
    }


  });
  
  export default styles;