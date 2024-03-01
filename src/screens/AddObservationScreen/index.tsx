import { ObservationStackParamList } from '@/navigation/ObservationStackNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import useCamera, { UseCamera } from '@/hooks/useCamera';
import styles from './style';
import ImageOrPlaceholder from '@/components/ImageOrPlaceholder';
import {ButtonSpinner} from "@gluestack-ui/themed"
import { addObservation, useObservations } from '@/contexts/ObservationContext';

export type AddScreenRouteProp = RouteProp<ObservationStackParamList, 'AddObservation'>;
export type AddScreenNavigationProp = BottomTabNavigationProp<ObservationStackParamList,'AddObservation'>;

type Props = {
    route: AddScreenRouteProp;
};

const AddObservationScreen = ({ route }: Props) => {

    // const observations = useObservations();

    const [animalName, setAnimalName] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);   

    //technically this is scuffed since you're making another useCamera, does it matter? Idk, sort out later
    const image1 = useCamera(route.params?.image);
    const image2 = useCamera();
    const image3 = useCamera();

    const handleHelpPress = () => {};
  
    const handleSubmitPress = async () => {
        if (!image1.current && !image2.current && !image3.current) return; //TODO - error handling
        try{
          await addObservation({animalName, description, images: [image1, image2, image3]}); 
        }catch(err){
            console.log(err);
        }
    };
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={handleHelpPress} style={styles.helpButton}>
          <Text style={styles.helpButtonText}>Help</Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={animalName}
            onChangeText={setAnimalName}
            placeholder="Enter the name of the animal"
          />
        </View>
        <View style={styles.imagePickerContainer}>
            <ImageOrPlaceholder image={image1} style={styles.image} />
            <ImageOrPlaceholder image={image2} style={styles.image} />
            <ImageOrPlaceholder image={image3} style={styles.image} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter a description"
            multiline
          />
        </View>
        <TouchableOpacity onPress={handleSubmitPress} style={styles.submitButton}>
            {isUploading && <ButtonSpinner mr="$1" />}
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };


export default AddObservationScreen;