import { StyleSheet } from 'react-native';

const NAVIGATOR_HEIGHT = 90; //height of the bottom navigator

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
        padding: 11,
        borderRadius: 50,
        position: "absolute", 
        bottom: NAVIGATOR_HEIGHT + 30, // 90 is the height of the bottom navigator, 30 is the height of the current location icon 
        right: 40
    },
    toggleMapButton: {
        backgroundColor: '#3d8afe',
        padding: 10,
        borderRadius: 50,
        position: 'absolute',
        bottom: NAVIGATOR_HEIGHT + 100, 
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
});

export default styles