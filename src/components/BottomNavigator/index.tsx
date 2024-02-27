//native
import { 
    TouchableOpacity, 
    View, 
    Text
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from "./style"
import {LinearGradient} from "expo-linear-gradient"
import useCamera from '@/hooks/useCamera';
import { useEffect } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

//maps from route name to icon code
function getIconCode(routeName: string): string {
    switch (routeName) {
        case 'Map':
            return 'map'; 
        case 'Rewards':
            return 'star';
        case 'Notifica':
            return 'notifications'; 
        case 'Profile':
            return 'person'; 
        case 'Add':
            return 'paw';
        default:
            return 'help'; 
    }
}

//custom bottom navigator
const BottomNavigtor = (
    { state, descriptors, navigation }: BottomTabBarProps) =>{

    const camera = useCamera();

    useEffect(() => {
        //if the user has selected a photo, navigate to the add screen
        if (camera.currentPhoto != null) {
            navigation.navigate('AddObservation', {photo: camera.currentPhoto})
        }
    }, [camera.currentPhoto])
    
    //this is ugly as hell :/
    const routes = [
        state.routes[0], 
        state.routes[1], 
        {...state.routes[1], name: "Add"}, 
        state.routes[2], 
        state.routes[3]
    ]

    return (
        <View style={styles.tabContainer}>
            {routes.map((route: any, index: any) => {
                const { options } = descriptors[route.key];
                const label =
                options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                    ? options.title
                    : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                //the middle add observation button
                if (route.name == "Add") return (  
                    <TouchableOpacity
                        key={"123456"} //can't use route.key since I'm duplicating the previous route
                        accessibilityRole="button"
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        onPress={camera.handleCameraRequest}
                        onLongPress={onLongPress}
                        style={styles.addObservationContainer}
                    >
                        <LinearGradient style={styles.addIcon} colors={["#005FEF", "#3d8afe"]} >
                            <Ionicons
                                name={getIconCode(route.name) as any}
                                size={40} 
                                style={styles.addIconText }
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                )
            
                //the rest of the buttons
                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabElementContainer}
                    >
                        <View style={styles.tabIcon}>
                            <Ionicons
                                name={getIconCode(route.name) as any} 
                                size={20} 
                                color={"#515151"}
                            />
                            <Text style={{fontSize:10}}>
                                {label}
                            </Text>    
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default BottomNavigtor