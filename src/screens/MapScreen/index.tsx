import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Modal, TextInput, ListRenderItem } from 'react-native';
import MapView, {Callout, LatLng, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';
import {FontAwesome6, FontAwesome} from '@expo/vector-icons';
import { useObservations } from '@/contexts/ObservationContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { AntDesign } from '@expo/vector-icons';
import { AnimalName, AnimalSchema, ObservationSchema } from '@/services/schemas';
import styles from './style';
import FilterModal from './FilterModal';
import ListModal from './ListModal';
import { FlatList } from '@gluestack-ui/themed';
import { Feather } from '@expo/vector-icons';
import useSearchAndFilter, { CurrentAnimal } from '@/hooks/useSearchAndFilter';

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

const SearchBarModal = (
    { visible, onClose, onSearch, animalList, addAnimal, currentAnimals }: 
    {visible: boolean; onClose: any; onSearch: any; animalList: AnimalSchema[], addAnimal: (animal: AnimalSchema) => void; currentAnimals: CurrentAnimal[]}
) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState<AnimalSchema[]>(animalList);

    const headerHeight = useHeaderHeight();

    //filter the data as the user types in the search bar
    useEffect(() => {
        const newData = animalList.filter((item) => item.name.toLowerCase()
                                                            .replace(/\s+/g, '')
                                                            .includes(searchQuery.toLowerCase()));
        setFilteredData(newData);
    }, [searchQuery])

    const renderItem: ListRenderItem<AnimalSchema> = ({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{item.name}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addAnimal(item)}
          >
            <Feather name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
    );

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
            <View style={{...styles.modalContent, marginTop: headerHeight + 50}}>
                <TextInput
                    style={styles.modalInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search"
                    autoFocus={true}
                    returnKeyType="search"
                    onSubmitEditing={() => {
                        onSearch(searchQuery)
                    }}
                />
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
        </TouchableOpacity>
      </Modal>
    );
};

const SearchBar = (
    { onSearchBarPress, onListPress, onFilterPress, isVisible}: 
    {onSearchBarPress: () => void, onListPress: () => void, onFilterPress: () => void, isVisible: boolean}
) => {
    return (
        <View style={{...styles.searchBarContainer, display: isVisible ? "flex" : "none"}}> 
            <TouchableOpacity style={styles.searchBar} onPress={onSearchBarPress}>
                <FontAwesome name="search" size={24} color="black" />
                <Text>Search</Text>
            </TouchableOpacity>
            <View style={styles.searchBarIconContainer}>
                <TouchableOpacity onPress={onListPress} style={styles.searchBarIcon}>
                    <FontAwesome name="list" size={20} color="white"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={onFilterPress} style={styles.searchBarIcon}>
                    <AntDesign name="filter" size={20} style={{color: "white"}}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const MapScreen = ({route, navigation}: Props) => {

    const {
        observations,
        addAnimal,
        filteredObservations,
        currentAnimals,
        deleteAnimal
    } = useSearchAndFilter();

    //map states
    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | undefined>(undefined);
    const [userLocation, setUserLocation] = useState<Location.LocationObject | undefined>(undefined);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const mapRef = useRef<MapView>(null);
    //search bar states
    const [isSearchBarFocused, setSearchBarFocused] = useState(false);    
    const [isListModalActive, setListModalActive] = useState(false);
    const [isFilterModalActive, setFilterModalActive] = useState(false);

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
                {filteredObservations.map(observation => (
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

            {/* search bar stuff */}
            <>
            <SearchBar 
                isVisible={!isSearchBarFocused}
                onSearchBarPress={() => setSearchBarFocused(true)}
                onFilterPress={() => setFilterModalActive(true)}
                onListPress={() => setListModalActive(true)}
             />
            <SearchBarModal
                currentAnimals={currentAnimals}
                addAnimal={addAnimal}
                animalList={observations.animals}
                visible={isSearchBarFocused}
                onClose={() => setSearchBarFocused(false)}
                onSearch={() => {}}
            />
            <FilterModal 
                isVisible={isFilterModalActive}
                onClose={() => setFilterModalActive(false)}
            />
            <ListModal 
                onDeleteAnimal={deleteAnimal}
                currentAnimals={currentAnimals}
                isVisible={isListModalActive}
                onClose={() => setListModalActive(false)}
            />
        </>
        </View>
    );
};

export default MapScreen;  