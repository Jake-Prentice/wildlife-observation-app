import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { ObservationStackParamList } from '@/navigation/ObservationStackNavigator';
import ImageModal from '@/components/ImageModal';
import styles from './style';

// Define the types for the navigation and route props
export type ViewScreenRouteProp = RouteProp<ObservationStackParamList, 'ViewObservation'>;

type Props = {
  route: ViewScreenRouteProp;
};

const ViewObservationScreen = ({ route }: Props) => {
  const {
    user, 
    animalName, 
    images, 
    description
  } = route.params.observation;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>User: {user.name} </Text>
      <Text style={styles.label}>Name: {animalName[0].name}</Text>
      <View style={styles.imagePickerContainer}>
        {images.map((imgUri, index) => (
          <ImageModal 
            key={index} 
            source={imgUri} 
            style={styles.image} 
          />
        ))}
      </View>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.textContent}>{description}</Text>
      <Text style={styles.label}>Scientific Information:</Text>
      <Text style={styles.textContent}>science info...</Text>
    </ScrollView>
  );
};

export default ViewObservationScreen;
