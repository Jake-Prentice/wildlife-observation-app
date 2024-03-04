import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    map: {
        flex: 1,
    },
    currentLocationButton: {
        backgroundColor: "#3d8afe",
        padding: 7,
        borderRadius: 50,
        position: "absolute", 
        //TODO - should probably make the 90 a constant somewhere and import it in
        bottom: 90 + 60, // 90 is the height of the bottom navigator, 60 is the height of the current location icon 
        right: 40
    },
    calloutContainer: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
      },
      calloutTitle: {
        paddingTop: 10,
        paddingBottom: 10,

        borderColor: "black",
        flex:1,
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10
      },
      calloutArrow: {
        paddingLeft: 10,
        padding: 10,
        flex:0.2,
        justifyContent: 'center',
        alignItems: 'center',
      },

      //search bar modal styles
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 10,
      },
      input: {
        // styles for the input field
      },
});

export default styles