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
    latitudeDelta: 0.0622,
    longitudeDelta: 0.0221,
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
        setActiveAutofilter
    } = useSearchAndFilter();

    //map states
    // const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | undefined>(undefined);
    const [userLocation, setUserLocation] = useState<Location.LocationObject | undefined>(undefined);
    const [mapType, setMapType] = useState<'standard' | 'hybrid'>('standard');
    const [currentMarker, setCurrentMarker] = useState<FilteredObservation | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    
    const mapRef = useRef<MapView>(null);
    //search bar states
    const [isSearchBarFocused, setSearchBarFocused] = useState(false);    
    const [isListModalActive, setListModalActive] = useState(false);
    const [isFilterModalActive, setFilterModalActive] = useState(false);

    //animates to a given location on the map
    const goToLocation = (location: Location.LocationObject | undefined, zoomDistance: "close" | "far" = "far") => {
        const zoom = zoomDistance === "far" ? defaultZoomDistance : {latitudeDelta: 0.003, longitudeDelta: 0.003};
        if (mapRef.current && location) {
            mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                ...zoom
            }, 500); // 500 ms animation
        }
    };

    const focusOnClosestObservationTo = (animalName: string) => {
        const closestObservation = getClosestObservation({userLocation: userLocation!, animalName})
        if (closestObservation)   {
            goToLocation({coords: closestObservation.location} as any, "close")
            observations.setFocused(closestObservation)
        }
    }

    /*
        * adds animal to currentAnimals
        * auto filters the observations
        * focuses on the one closest to the user's location
    */ 
    const handleAddSearchAnimal = (animal: AnimalSchema) => {
        addAnimal(animal);
        setActiveAutofilter(true)
        focusOnClosestObservationTo(animal.name);
    }

    /*
        * adds new-observation to currentAnimals
        * auto filters to accomodate new-observation
        * focuses on new-observation
    */
    const handleNewObservation = (observation: ObservationSchema) => {
        const animal = {
            name: observation.animalName[0].name,
            id: observation.animalName[0].refId,
            hasScienceInfo: false
        }
        addAnimal(animal);
        setActiveAutofilter(true);
        observations.setFocused(observation);
        goToLocation({coords: observation.location} as any, "close")
    }

    //will go to focused observation if there is one
    //**not getting used now**
    useEffect(() => {
        if (!observations.focused) return;
        goToLocation({coords: observations.focused.location} as any, "close")
    }, [observations.focused])
    
    //handle auto-focusing on newest observation coming from the AddScreen screen
    useEffect(() => {
        if (!route?.params?.newObservation) return;
        handleNewObservation(route.params.newObservation);
    }, [route.params?.newObservation])

    //on initial rendering of the map: asks permissions and focus on user's current location    
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Lowest});
            setUserLocation(location);
            goToLocation(location);
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
                focusOnClosestObservationTo={focusOnClosestObservationTo}
                changeAnimalColor={changeAnimalColor}
                onDeleteAnimal={deleteAnimal}
                currentAnimals={currentAnimals}
                isVisible={isListModalActive}
                onClose={() => setListModalActive(false)}
                setIsVisible={setListModalActive}
            />
        </View>
    );
};

export default MapScreen;  