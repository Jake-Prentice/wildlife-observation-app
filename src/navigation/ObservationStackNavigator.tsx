import AddObservationScreen from '@/screens/AddObservationScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ImagePickerAsset } from 'expo-image-picker';

export type ObservationStackParamList  = {
    AddObservation: {photo: ImagePickerAsset};
}

const ObservationStack = createNativeStackNavigator<ObservationStackParamList>();

//is a nested stack of the BottomTabNavigator
const ObservationStackNavigator = () => {
    return (
        <ObservationStack.Navigator screenOptions={{headerShown:false}} >
            <ObservationStack.Screen 
                name="AddObservation" 
                component={AddObservationScreen} 
                // options={{ headerShown: false }} 
            />
        </ObservationStack.Navigator>
    );
};

export default ObservationStackNavigator;