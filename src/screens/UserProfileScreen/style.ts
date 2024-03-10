import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        //borderWidth:5,
        //borderColor:'gray',
        //fontWeight: 'bold',
    },
    usernameBox: {
        width:'100%',
        flexDirection:'row',
        //borderWidth:5,
        justifyContent:'space-between',
        alignItems:'center',
        padding:15,
        marginBottom:49,
        borderBottomColor:'gray',
        borderBottomWidth:3
    },
    header: {
        fontSize: 18,
        alignSelf:'baseline',
        marginLeft:15, 
        marginBottom: 10, 
        fontWeight:'bold',
        borderBottomColor:'gray',
        borderBottomWidth:2,
    },
    statBox: {
        flexDirection:'row',
        padding:10,
        justifyContent:'space-between',
        marginBottom:10,
        
    },
    line:{
        borderBottomColor:'gray',
        borderBottomWidth:2,
        marginBottom:10,
    },
    statsList: {
        paddingHorizontal:20,
        width:'100%'
    },
    stattext: {
        fontSize: 16
    }
});
  export default styles