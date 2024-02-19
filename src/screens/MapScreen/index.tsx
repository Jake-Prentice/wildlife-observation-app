import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

const Map = () => {
    return <MapView style={styles.map} />;
}

const MapScreen = () => {
    return (
        // <View style={styles.container}>
        //     <Text style={styles.title}>Welcome to the Map Screen!</Text>
        // </View>
        <Map />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    map: {
        flex: 1,
    }
});

export default MapScreen;