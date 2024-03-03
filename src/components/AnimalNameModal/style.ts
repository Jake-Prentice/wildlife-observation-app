import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    centeredView: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        height:"60%",
        width:"80%",
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    scrollView: {
        width: '100%',
    },
    animalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    animalNameButton: {
        flex: 3,
    },
    animalNameText: {
        fontSize: 18,
    },
    upvoteContainer: {
        // borderColor: "blue",
        // borderWidth: 1,
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    upvoteItem: {
        // borderColor: "red",
        // borderWidth: 1,
        flex:1,
        justifyContent: "center",
        alignItems: "center",
    },

    caretUp: {
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 3
    },
    
    addButton: {
        marginTop: 10,
    },

    exitButton: {
        backgroundColor: "#3d8afe",
        padding: 5,
        borderRadius: 50,
        position: "absolute", 
        top:-20,
        right:0
    },

    input: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        marginTop: 20
      },

  });

  export default styles;