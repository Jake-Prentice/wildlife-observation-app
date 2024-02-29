import { BottomTabParamList } from '@/navigation/BottomTabNavigator';
import { ObservationStackParamList } from '@/navigation/ObservationStackNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import ImageModal from '@/components/ImageModal';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import useCamera, { UseCamera } from '@/hooks/useCamera';
import styles from './style';
import * as ImagePicker from 'expo-image-picker';
import { manageFileUpload } from '@/services/observations';
import ImageOrPlaceholder from '@/components/ImageOrPlaceholder';
import {
    Button,
    ButtonText,
    ButtonIcon,
    ButtonSpinner,
    ButtonGroup,
  } from "@gluestack-ui/themed"

export type AddScreenRouteProp = RouteProp<ObservationStackParamList, 'AddObservation'>;
export type AddScreenNavigationProp = BottomTabNavigationProp<ObservationStackParamList,'AddObservation'>;

type Props = {
    route: AddScreenRouteProp;
};

const getImageBlob = async (image: UseCamera) => {
    if (!image.current) return;
    const response = await fetch(image.current.uri)
    const blob = await response.blob();
}

const AddObservationScreen = ({ route }: Props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);   

    useEffect(() => {

    }, [route.params?.image])
    
    //technically this is scuffed since you're making another useCamera, does it matter? Idk, sort out later
    const image1 = useCamera(route.params?.image.result);
    const image2 = useCamera();
    const image3 = useCamera();

    useEffect(() => {
        console.log("image2 exif: ", image1.current?.exif?.GPSLatitude, image1.current?.exif?.GPSLongitude)
    }, [image1.current?.exif])

    const handleHelpPress = () => {
      // TODO: Implement what should happen when help is pressed
    };
  
    const onStart = () => {
        setIsUploading(true);
    }
    const onComplete = () => {
        setIsUploading(false)
    }

    const onProgress = () => {}
    const onFail = () => {}

    const handleSubmitPress = async () => {
        if (!image1.current) return;
        
        // manageFileUpload(blob, {onStart, onProgress, onComplete, onFail})
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
            value={name}
            onChangeText={setName}
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
        {/* <Button onPress={handleSubmitPress} isDisabled={isUploading} bg="$darkBlue600" p="$3">
            {isUploading && <ButtonSpinner mr="$1" />}
            <ButtonText fontWeight="$medium" fontSize="$md">
                {isUploading? "Please wait..." : "Submit"}
            </ButtonText>
        </Button> */}
        <TouchableOpacity onPress={handleSubmitPress} style={styles.submitButton}>
            {isUploading && <ButtonSpinner mr="$1" />}
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };


export default AddObservationScreen;