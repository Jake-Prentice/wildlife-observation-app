import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Modal, TextInput, ListRenderItem } from 'react-native';
import MapView, {Callout, Circle, LatLng, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
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
import useSearchAndFilter, { CurrentAnimal, FilteredObservation } from '@/hooks/useSearchAndFilter';

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
        const newData = searchQuery ? animalList.filter((item) => item.name.toLowerCase()
                                                            .replace(/\s+/g, '')
                                                            .includes(searchQuery.toLowerCase())) : animalList
        setFilteredData(newData);
    }, [searchQuery])

    const isAlreadyActive = (id: string) => {
        return currentAnimals.some(animal => animal.id === id);
    }

    const renderItem: ListRenderItem<AnimalSchema> = ({ item }) => {
        const isDisabled = isAlreadyActive(item.id)
        return (
        <View style={{...styles.listItem, opacity: isDisabled ? 0.5 : 1}}>
          <Text style={styles.listItemText}>{item.name}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addAnimal(item)}
            disabled={isDisabled} 
          >
            <Feather name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
    )};

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
        deleteAnimal,
        changeDateTimeFilter,
        filterCriteria,
        changeAnimalColor,
        autoFilterCriteria,
        getClosestObservation,
    } = useSearchAndFilter();

    //map states
    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | undefined>(undefined);
    const [userLocation, setUserLocation] = useState<Location.LocationObject | undefined>(undefined);
    const [mapType, setMapType] = useState<'standard' | 'hybrid'>('standard');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const mapRef = useRef<MapView>(null);
    const [currentMarker, setCurrentMarker] = useState<FilteredObservation | null>(null);
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

    /*
        * adds animal to currentAnimals
        * auto filters the observations
        * focuses on the one closest to the user's location
    */ 
    const handleAddSearchAnimal = (animal: AnimalSchema) => {
        addAnimal(animal);
        autoFilterCriteria();
        const closestObservation = getClosestObservation({userLocation: userLocation!, animalName: animal.name})
        if (closestObservation) observations.setFocused(closestObservation);
    }

    
    useEffect(() => {
        if (!observations.focused) return;
        goToLocation({coords: observations.focused.location} as any)
    }, [observations.focused])
    
     
    useEffect(() => {
        if (currentAnimals.length == 0) return;
        autoFilterCriteria();
        console.log("closest to: ", currentAnimals[0].name, " ", getClosestObservation({userLocation: userLocation!, animalName: currentAnimals[0].name}))
    }, [currentAnimals])

    useEffect(() => {console.log({filterCriteria})}, [filterCriteria])

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
    
    //go to view-observation screen
    const onCalloutPress = (observation: ObservationSchema & {id: string}) => {
        navigation.navigate("Observation", {screen: "ViewObservation", params: {observation}})
    };

    //change between hybrid and standard map
    const toggleMapType = () => {
        setMapType(prevMapType => (prevMapType === 'standard' ? 'hybrid' : 'standard'));
    };

    //TODO - radius circle around marker when clicked...
    return (
        <View style={styles.container}>
            <MapView 
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                mapType={mapType}
                showsUserLocation
            > 
                {/* {currentMarker && <Circle center={currentMarker.location} radius={currentMarker.location.radius * 1000} fillColor={currentMarker.color} />} */}
                {filteredObservations.map(observation => (
                    <Marker
                        onPress={() => {setCurrentMarker(observation); console.log("on")}}
                        onDeselect={() => {setCurrentMarker(null); console.log("off")}}
                        pinColor={observation.color}
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

            <TouchableOpacity 
                onPress={toggleMapType}
                style={styles.toggleMapButton}
            >
                <FontAwesome6 name="layer-group" size={25} style={{color: "white"}} />
            </TouchableOpacity>

            {/* search bar stuff */}
            <SearchBar 
                isVisible={!isSearchBarFocused}
                onSearchBarPress={() => setSearchBarFocused(true)}
                onFilterPress={() => setFilterModalActive(true)}
                onListPress={() => setListModalActive(true)}
             />
            <SearchBarModal
                currentAnimals={currentAnimals}
                addAnimal={handleAddSearchAnimal}
                animalList={observations.animals}
                visible={isSearchBarFocused}
                onClose={() => setSearchBarFocused(false)}
                onSearch={() => {}}
            />
            <FilterModal 
                filterCriteria={filterCriteria}
                setIsVisible={setFilterModalActive}
                changeDateTimeFilter={changeDateTimeFilter}
                isVisible={isFilterModalActive}
                onClose={() => setFilterModalActive(false)}
            />
            <ListModal 
                changeAnimalColor={changeAnimalColor}
                onDeleteAnimal={deleteAnimal}
                currentAnimals={currentAnimals}
                isVisible={isListModalActive}
                onClose={() => setListModalActive(false)}
            />
        </View>
    );
};

export default MapScreen;  