import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, {LatLng, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';
import {FontAwesome6} from '@expo/vector-icons';
import { useObservations } from '@/contexts/ObservationContext';
import { RouteProp } from '@react-navigation/native';
import { ObservationStackParamList } from '@/navigation/ObservationStackNavigator';
import { BottomTabParamList } from '@/navigation/BottomTabNavigator';

//the latitudeDelta and longitudeDelta determine the zoom level of the map
const defaultZoomDistance = { 
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

//sort the types out JAKE!
type Props = { 
    route: any;
}

const MapScreen = ({route}: Props) => {

    const observations = useObservations();

    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | undefined>(route.params?.initialLocation);

    const [userLocation, setUserLocation] = useState<Location.LocationObject | undefined>(undefined);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const mapRef = useRef<MapView>(null);

    //animates to some location
    const goToLocation = (location: Location.LocationObject | undefined) => {
        if (mapRef.current && location) {
            mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                ...defaultZoomDistance
            }, 500); // 500 ms animation
        }
    };

    //control the region of the map displayed,
    //by the currentLocation state
    useEffect(() => {
        if (!mapRef.current || !currentLocation) return
        goToLocation(currentLocation);
    }, [currentLocation])

    //makes sure to ask for location permissions
    useEffect(() => {
        //don't want to constantly poll for a location if there already is one set,
        //it takes soooo long to load current location!
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Lowest});
            setUserLocation(location);
            //if no location is set, set the current location to the user's location
            if (!currentLocation) setCurrentLocation(location);
        })();
    }, []);
    
    // useEffect(() => {
    //     console.log("observations", observations.data)
    // }, [observations.data])
    
    return (
        <View style={styles.container}>
            <MapView 
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
            > 
                {observations.data.map(observation => (
                    <Marker
                        key={observation.id}
                        coordinate={{
                            latitude: observation.location.latitude,
                            longitude: observation.location.longitude,
                        }}
                        title={observation.animalName}
                        description={observation.description}
                    />
                ))
            }
            </MapView>
            <TouchableOpacity 
                onPress={() => goToLocation(userLocation)} 
                style={{...styles.currentLocationButton, opacity: userLocation ? 1 : 0.2}}
            >
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