import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import MapView, {Callout, LatLng, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';
import {FontAwesome6} from '@expo/vector-icons';
import { useObservations } from '@/contexts/ObservationContext';
import { RouteProp } from '@react-navigation/native';
import { ObservationStackParamList } from '@/navigation/ObservationStackNavigator';
import { BottomTabParamList } from '@/navigation/BottomTabNavigator';
import { AntDesign } from '@expo/vector-icons';
import { ObservationSchema } from '@/services/schemas';

//the latitudeDelta and longitudeDelta determine the zoom level of the map
const defaultZoomDistance = { 
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

//sort the types out JAKE!
type Props = { 
    route: any;
    navigation: any;
}

const MapScreen = ({route, navigation}: Props) => {

    const observations = useObservations();

    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | undefined>(undefined);

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
            //if no location is set, set the current location to the user's location,
            //if coming from the add observation screen, it will focus on that newest observation
            if (route.params?.initialLocation) setCurrentLocation(route.params.initialLocation);
            else setCurrentLocation(location);
        })();
    }, []);
    
    const onCalloutPress = (observation: ObservationSchema & {id: string}) => {
        navigation.navigate("Observation", {screen: "ViewObservation", params: {observation}})
    }

    //TODO - radius circle around marker when clicked...
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
                    >
                        <Callout
                            onPress={() => onCalloutPress(observation)} 
                            style={styles.calloutContainer} // You can adjust the style as needed
                            >
                                <View style={styles.calloutTitle}>
                                    <Text>{observation.animalName[0].name}</Text>
                                </View>
                                <TouchableOpacity style={styles.calloutArrow}>
                                    <AntDesign name="rightcircle" size={20} color="#3d8afe" />
                                </TouchableOpacity>
                        </Callout>
                    </Marker>
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

export default MapScreen;