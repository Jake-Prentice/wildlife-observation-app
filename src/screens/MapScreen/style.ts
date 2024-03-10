import { StyleSheet } from 'react-native';

const NAVIGATOR_HEIGHT = 90; //height of the bottom navigator

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        alignItems: 'center',
        gap: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    map: {
        flex: 1,
        width: "100%",
        height: "100%",
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

      //search bar modal styles
      modalOverlay: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },

      modalContent: {
        width: '90%', //same as searchBarContainer
        // borderColor: "black",
        // borderWidth: 1,
        backgroundColor: 'white',
        padding: 15,
        elevation: 10,
        borderRadius: 15,
        gap: 10
        // height: 200,
      },

      modalInput: {
        // borderColor: "black",
        // borderWidth: 1,
      },

      listItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      listItemText: {
        // fontSize: 18,
      },
      addButton: {
        // borderWidth: 1,
        // borderColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        backgroundColor: '#3d8afe',
        borderRadius: 15,
      },
      addButtonText: {
        color: 'blue',
        fontSize: 24,
        fontWeight: 'bold',
      },

      searchBarContainer: {
        width: "90%",
        backgroundColor: "white",
        position: "absolute",
        marginTop: 50,
        borderRadius: 15,
        borderColor: "rgba(32, 32, 32, 0.299)",
        borderWidth: 3,
        // justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      },

      searchBar: {
        flex:1,
        // borderColor: "black",
        // borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        height: "100%",
        gap: 5,
        paddingLeft: 20
      },

      searchBarIconContainer: {
        borderColor: "rgba(32, 32, 32, 0.2)",
        borderLeftWidth: 3,
        height: "100%",
        justifyContent: "center",
        gap: 10,
        flexDirection: "row",
        padding: 5,
        paddingHorizontal: 10,
        
      },

      searchBarIcon: {
        borderRadius: 100,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#3d8afe",
      }
});

export default styles