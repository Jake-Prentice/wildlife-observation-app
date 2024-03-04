import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Modal, TextInput } from 'react-native';
import MapView, {Callout, LatLng, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';
import {FontAwesome6} from '@expo/vector-icons';
import { useObservations } from '@/contexts/ObservationContext';
import { RouteProp } from '@react-navigation/native';
import { ObservationStackParamList } from '@/navigation/ObservationStackNavigator';
import { BottomTabParamList } from '@/navigation/BottomTabNavigator';
import { AntDesign } from '@expo/vector-icons';
import { ObservationSchema } from '@/services/schemas';
import styles from './style';

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

const SearchBarModal = ({ visible, onClose, onSearch }: {visible: boolean; onClose: any, onSearch: any}) => {
    const [searchTerm, setSearchTerm] = useState('');
  
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search"
              autoFocus={true}
              returnKeyType="search"
              onSubmitEditing={() => onSearch(searchTerm)}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

const MapScreen = ({route, navigation}: Props) => {

    const observations = useObservations();

    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | undefined>(undefined);

    const [userLocation, setUserLocation] = useState<Location.LocationObject | undefined>(undefined);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    //search bar
    const [isSearchBarFocused, setSearchBarFocused] = useState(false);    

    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        //turn the header off when the search bar is opened
        // navigation.setOptions({headerShown: !isSearchBarFocused}); //TODO - that won't work
    }, [isSearchBarFocused])

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
                            style={styles.calloutContainer} 
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
            <SearchBar onSearchBarPress={() => setSearchModalVisible(true)} />
            <SearchBarModal
                visible={searchModalVisible}
                onClose={() => setSearchModalVisible(false)}
                onSearch={handleSearch}
            />
            {/* {isSearchBarFocused ? (
                <SearchBarModal visible={isSearchBarFocused} onClose={() => setSearchBarFocused(true)} onSearch={() => {}}/>
            ): (
                <View>

                </View>
            )} */}
        </View>
    );
};

export default MapScreen;  