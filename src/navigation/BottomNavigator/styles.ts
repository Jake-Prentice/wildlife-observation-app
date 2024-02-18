
import { StyleSheet} from 'react-native';

export default StyleSheet.create({

    tabContainer: {
        backgroundColor: 'white', 
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20, 
        position: 'absolute',
        bottom: 0,
        padding: 5, 
        width: '90%', 
        alignSelf: 'center',
        shadowColor: '#000', 
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: 'row',
        height: 80,
        justifyContent: 'center',
    },

    tabElementContainer: {
        // borderBlockColor: 'black', to debug
        // borderWidth: 1,
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 1,
        padding: 5
    },

    tabIcon: {
        width: "100%",
        height: "100%",
        backgroundColor: "#F5F5F5",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },

    addObservationContainer: {
        // borderBlockColor: 'black', to debug
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 10,
        width: 70,
        height: 70,
        marginTop: -30,
        marginBottom: 30,
    },
    
    addIcon: {
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15
    },


    addIconText: {
        color: "white"
    }

});