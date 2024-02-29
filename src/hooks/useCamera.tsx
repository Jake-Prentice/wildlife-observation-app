import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useMemo, useState } from 'react';
// import * as Permissions from 'expo-permissions';
import { Alert } from 'react-native';
import { Image } from 'react-native-svg';
import * as Location from 'expo-location';

//camera functionality
const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
    }
};
export type UseCamera = {
    current: ImagePicker.ImagePickerAsset | undefined;
    result: ImagePicker.ImagePickerResult | undefined;
    handleCameraRequest: () => Promise<void>;
    reset: () => void;
}

const useCamera = (initial?: ImagePicker.ImagePickerResult): UseCamera  => {
    const [result, setResult] = useState<ImagePicker.ImagePickerResult | undefined>(initial);

    const current = useMemo(() => result?.assets?.[0], [result]);
    const reset = useCallback(() => setResult(undefined), [setResult]);

    //ensure location data on image
    useEffect(() => {
        console.log(current?.height, current?.width)
        if (current && !current.exif?.GPSLatitude && !current.exif?.GPSLongitude) {
            Alert.alert('No Location Data', 'This photo does not contain location data, please select another photo.')
            reset();
        }
    }, [current?.exif])

    /*
        for some reason, the Exif location data isn't available when taking the photo,
        from the launchCameraAsync, so we have to manually add it in.    
    */
    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            exif: true,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });


        if (!result.canceled) {
            let location = await Location.getCurrentPositionAsync({});
            result.assets[0].exif = {
                ...result.assets[0].exif,
                GPSLatitude: location.coords.latitude,
                GPSLongitude: location.coords.longitude,
            }
        }
        setResult(result);
    };
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            exif: true, //for location data
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        setResult(result);
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
    
    return { 
        reset,
        current,
        result, 
        handleCameraRequest
    };
}

export default useCamera

