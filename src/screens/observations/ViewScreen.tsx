import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { ObservationStackParamList } from '@/navigation/ObservationStackNavigator';
import ImageModal from '@/components/ImageModal';
import styles from './style';
import AnimalNameModal from '@/components/AnimalNameModal';
import { AntDesign } from '@expo/vector-icons';
import { useObservations } from '@/contexts/ObservationContext';

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
/*


big img
name
user

name voting
line?
desc
line
scientific info
line
gallery
images
*/

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.animalNameContainer}>
      <View style={styles.animalImageMain}>
        {currentObservation?.images.map((imgUri, index) => (
          index == 0 ? <ImageModal //There HAS to be a better way.....
            key={index} 
            source={imgUri} 
            style={styles.image} 
          /> : undefined
        ))}
      </View>
          
          <Text style={styles.animalNameBig}>{currentObservation?.animalName[0].name}</Text>
          <Text style={styles.usernameText}>Submitted by @{currentObservation?.user.name} </Text>
      </View>
      <View style={styles.animalNameButton}>
              <View>
                  <Text style={styles.animalNameText}>Animal Name: {currentObservation?.animalName[0].name}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.animalNameIcon}>
                  <AntDesign name="rightcircle" size={20} color="#3d8afe" />
              </TouchableOpacity>
              <AnimalNameModal 
              isVisible={modalVisible} 
              setIsVisible={setModalVisible} 
              animalNames={currentObservation?.animalName}
              observationId={id}
          />
          </View>
      <Text style={styles.label}>Description:</Text>
      <View style={styles.line} />
      <Text style={styles.textContent}>{currentObservation?.description}</Text>
      <Text style={styles.label}>Scientific Information:</Text>
      <View style={styles.line} />
      <Text style={styles.textContent}>science info...science info...science info...science info...science info...science info...science info...</Text>
      <Text style={styles.label}>Gallery</Text>
      <View style={styles.line} />
      <View style={styles.galleryImages}>
        {currentObservation?.images.map((imgUri, index) => (
          <ImageModal 
            key={index} 
            source={imgUri} 
            style={styles.galleryImage} 
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default ViewObservationScreen;
