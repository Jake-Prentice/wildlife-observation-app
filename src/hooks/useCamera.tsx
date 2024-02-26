import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
// import * as Permissions from 'expo-permissions';
import { Alert } from 'react-native';

//camera functionality
const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
    }
};

const useCamera = () => {
    const [currentPhoto, setCurrentPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  
    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        setCurrentPhoto(result?.assets ? result.assets[0] : null);
    };
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        setCurrentPhoto(result?.assets ? result.assets[0] : null);
    };

    const handleCameraRequest = async () => {
        await requestPermissions();        
        Alert.alert(
            'Select Photo',
            'Choose how you want to add a photo.',
            [
                { text: 'Take Photo', onPress: () => takePhoto() },
                { text: 'Choose from Library', onPress: () => pickImage() },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };
    
    return {currentPhoto, handleCameraRequest};
}

export default useCamera

