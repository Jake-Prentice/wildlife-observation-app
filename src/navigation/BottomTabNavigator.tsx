import MapScreen from "src/screens/MapScreen"
import UserProfileScreen from "src/screens/UserProfileScreen"
import AchievementScreen from 'src/screens/AchievementScreen';
import NotificationScreen from 'src/screens/NotificationScreen';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomNavigtor from "@/components/BottomNavigator";

export type BottomTabParamList  = {
    Map: undefined; 
    Rewards: undefined; 
    Notifica: undefined; 
    Profile: undefined;
}

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
    return (
        <BottomTab.Navigator screenOptions={{headerShown:false}} tabBar={props => <BottomNavigtor {...props} />}>
            <BottomTab.Screen name="Map" component={MapScreen} />
            <BottomTab.Screen name="Rewards" component={AchievementScreen} />
            <BottomTab.Screen name="Notifica" component={NotificationScreen} />
            <BottomTab.Screen name="Profile" component={UserProfileScreen} />
        </BottomTab.Navigator>
    );
}

export default BottomTabNavigator;