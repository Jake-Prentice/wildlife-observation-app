import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { ObservationStackParamList } from '@/navigation/ObservationStackNavigator';
import ImageModal from '@/components/ImageModal';
import styles from './style';
import AnimalNameModal from '@/components/AnimalNameModal';
import { AntDesign } from '@expo/vector-icons';
import { useObservations } from '@/contexts/ObservationContext';
import { getAnimalScienceData } from '@/services/animals';
import AnimalScienceList from './AnimalScienceList';

// Define the types for the navigation and route props
export type ViewScreenRouteProp = RouteProp<ObservationStackParamList, 'ViewObservation'>;

type Props = {
  route: ViewScreenRouteProp;
};

const ViewObservationScreen = ({ route }: Props) => {

  const [modalVisible, setModalVisible] = useState(false);

  const {id} = route.params.observation;

  const observations = useObservations();

  const currentObservation = useMemo(() => {
    return observations.data.find(obs => obs.id === id);
  }, [observations, id]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>User: @{currentObservation?.user.name} </Text>
      </View>
      <View style={styles.animalNameContainer}>
          <View style={styles.animalNameButton}>
              <View style={styles.animalNameText}>
                  <Text>Animal Name: {currentObservation?.animalName[0].name}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.animalNameIcon}>
                  <AntDesign name="rightcircle" size={20} color="#3d8afe" />
              </TouchableOpacity>
          </View>
          <AnimalNameModal 
              isVisible={modalVisible} 
              setIsVisible={setModalVisible} 
              animalNames={currentObservation?.animalName}
              observationId={id}
          />
      </View>
      <View style={styles.imagePickerContainer}>
        {currentObservation?.images.map((imgUri, index) => (
          <ImageModal 
            key={index} 
            source={imgUri} 
            style={styles.image} 
          />
        ))}
      </View>
      <View>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.textContent}>{currentObservation?.description}</Text>
      </View>
      <View style={styles.scienceInfoContainer}>
        <Text style={{fontWeight: "bold"}}>Scientific Information: </Text>
        <AnimalScienceList animalName={currentObservation?.animalName[0].name} />
      </View>
    </ScrollView>
  );
};

export default ViewObservationScreen;
