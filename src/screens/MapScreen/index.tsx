import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';
import {FontAwesome6} from '@expo/vector-icons';

//the latitudeDelta and longitudeDelta determine the zoom level of the map
const defaultZoomDistance = { 
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}
const MapScreen = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const mapRef = useRef<MapView>(null);

    //animates to the user's curent location
    const goToMyLocation = () => {
        if (location && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                ...defaultZoomDistance
            }, 500); // 500 ms duration
        }
    };

    //get user location permission
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    return (
        <View style={styles.container}>
            {location ? (
                <MapView 
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    ...defaultZoomDistance
                }}>
                    <Marker
                        coordinate={{
                            latitude: 51.371989,
                            longitude: -2.341385,
                        }}
                        title="Bath"
                        description="some location in Bath, UK"
                    />
                </MapView>
            ): <Text>{errorMsg}</Text>}
            <TouchableOpacity onPress={goToMyLocation} style={styles.currentLocationButton}>
                <FontAwesome6 name="location-crosshairs" size={25} style={{color: "white"}}/>
            </TouchableOpacity>
        </View>
    );
};

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
    }
});

export default MapScreen;