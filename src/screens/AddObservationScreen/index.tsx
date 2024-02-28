import { BottomTabParamList } from '@/navigation/BottomTabNavigator';
import { ObservationStackParamList } from '@/navigation/ObservationStackNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import ImageModal from '@/components/ImageModal';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import useCamera from '@/hooks/useCamera';
export type AddScreenRouteProp = RouteProp<ObservationStackParamList, 'AddObservation'>;
export type AddScreenNavigationProp = BottomTabNavigationProp<ObservationStackParamList,'AddObservation'>;
import styles from './style';

type Props = {
    route: AddScreenRouteProp;
};

//either displays the image or the placeholder,
//also allows the user to change the photo but holding down on the image
const ImageOrPlaceholder = (props: any) => {
    const { image, style, setImage } = props;
    const camera = useCamera();

    useEffect(() => {
        if (camera.currentPhoto) setImage(camera.currentPhoto.uri)
    }, [camera.currentPhoto]);

    //TODO - don't know why the no comes before the yes, weird but fix this
    const triggerChangeModal = () => {
        Alert.alert(
            'Change Photo',
            'are you sure you want to change the photo?',
            [
                { text: 'Yes', onPress: () => setImage(null)},
                { text: 'No', style: 'cancel' },
            ],
        );
    }

    if (image) return <ImageModal onLongPress={triggerChangeModal} style={style} source={image} />
    
    return (
      <TouchableOpacity onPress={camera.handleCameraRequest} style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderText}>+</Text>
      </TouchableOpacity>
    );
}

const AddObservationScreen = ({ route }: Props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [image1, setImage1] = useState<string | null>(null);
    const [image2, setImage2] = useState<string | null>(null);
    const [image3, setImage3] = useState<string | null>(null);

    useEffect(() => {
        setImage1(route.params?.photo.uri)
    }, [route.params?.photo]);

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
            <ImageOrPlaceholder setImage={setImage1} image={image1} style={styles.image} />
            <ImageOrPlaceholder setImage={setImage2} image={image2} style={styles.image} />
            <ImageOrPlaceholder setImage={setImage3} image={image3} style={styles.image} />
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