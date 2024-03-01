import { UseCamera } from '@/hooks/useCamera';
import AddObservationScreen from '@/screens/AddObservationScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ImagePickerAsset, ImagePickerResult } from 'expo-image-picker';

export type ObservationStackParamList  = {
    AddObservation: {image: ImagePickerResult};
}

const ObservationStack = createNativeStackNavigator<ObservationStackParamList>();

//is a nested stack of the BottomTabNavigator
const ObservationStackNavigator = () => {
    return (
        <ObservationStack.Navigator screenOptions={{headerShown:false}} >
            <ObservationStack.Screen 
                name="AddObservation" 
                component={AddObservationScreen} 
            />
        </ObservationStack.Navigator>
    );
};

export default ObservationStackNavigator;