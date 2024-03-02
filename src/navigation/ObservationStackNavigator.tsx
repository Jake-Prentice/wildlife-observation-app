import { UseCamera } from '@/hooks/useCamera';
import {AddScreen, ViewScreen} from "src/screens/observations";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ImagePickerAsset, ImagePickerResult } from 'expo-image-picker';
import { ObservationSchema } from '@/services/schemas';

export type ObservationStackParamList  = {
    AddObservation: {image: ImagePickerResult};
    ViewObservation: {observation: ObservationSchema & {id: string}};
}

const ObservationStack = createNativeStackNavigator<ObservationStackParamList>();

//is a nested stack of the BottomTabNavigator
const ObservationStackNavigator = () => {
    return (
        <ObservationStack.Navigator screenOptions={{headerShown:false}} >
            <ObservationStack.Screen 
                name="AddObservation" 
                component={AddScreen} 
            />
            <ObservationStack.Screen 
                name="ViewObservation" 
                component={ViewScreen} 
            />
        </ObservationStack.Navigator>
    );
};

export default ObservationStackNavigator;