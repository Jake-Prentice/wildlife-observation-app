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

export type AddScreenRouteProp = RouteProp<ObservationStackParamList, 'AddObservation'>;
export type AddScreenNavigationProp = BottomTabNavigationProp<ObservationStackParamList,'AddObservation'>;

type Props = {
    route: AddScreenRouteProp;
};

//either displays the image or the placeholder,
//also allows the user to change the photo but holding down on the image
const ImageOrPlaceholder = ({image, style}: {image: UseCamera, style:any}) => {
    //TODO - don't know why the no comes before the yes, weird but fix this
    const triggerChangeModal = () => {
        Alert.alert(
            'Change Photo',
            'are you sure you want to change the photo?',
            [
                { text: 'Yes', onPress: image.reset},
                { text: 'No', style: 'cancel' },
            ],
        );
    }

    if (image.current != undefined) return (
        <ImageModal 
            onLongPress={triggerChangeModal} 
            style={style} 
            source={image.current.uri} 
        />
    )

    return (
      <TouchableOpacity onPress={image.handleCameraRequest} style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderText}>+</Text>
      </TouchableOpacity>
    );
}

const AddObservationScreen = ({ route }: Props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

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
  
    const handleSubmitPress = () => {
      // TODO: Implement the submission logic
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
        <TouchableOpacity onPress={handleSubmitPress} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };


export default AddObservationScreen;