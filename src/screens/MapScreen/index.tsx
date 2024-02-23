import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

//example long+lat: 51.371989, -2.341385

const Map = () => {
    return (
        <MapView 
            provider={PROVIDER_GOOGLE}
            style={styles.map}>
            <Marker
                coordinate={{
                    latitude: 51.371989,
                    longitude: -2.341385,
                }}
                title="Bath"
                description="some location in Bath, UK"
            />
        </MapView>
    )
}

const MapScreen = () => {
    return (
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