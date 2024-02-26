import MapScreen from "src/screens/MapScreen"
import UserProfileScreen from "src/screens/UserProfileScreen"
import AchievementScreen from 'src/screens/AchievementScreen';
import NotificationScreen from 'src/screens/NotificationScreen';
import AddObservationScreen from 'src/screens/AddObservationScreen';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomNavigtor from "@/components/BottomNavigator";
import { ImagePickerAsset } from "expo-image-picker";

export type BottomTabParamList  = {
    Add: {photo: ImagePickerAsset};
    Map: undefined; 
    Rewards: undefined; 
    Notifica: undefined; 
    Profile: undefined;
}

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator tabBar={props => <BottomNavigtor {...props} />}  >
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Rewards" component={AchievementScreen} />
            <Tab.Screen name="Add" component={AddObservationScreen} />
            <Tab.Screen name="Notifica" component={NotificationScreen} />
            <Tab.Screen name="Profile" component={UserProfileScreen} />
        </Tab.Navigator>
    );
}

export default BottomTabNavigator;