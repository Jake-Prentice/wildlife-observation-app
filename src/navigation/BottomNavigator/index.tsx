//native
import {
    StyleProp, 
    StyleSheet, 
    TouchableOpacity, 
    View, 
    ViewStyle, 
    Text
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from "./styles"
import {LinearGradient} from "expo-linear-gradient"
//react navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//screens
import MapScreen from "../../screens/MapScreen"
import UserProfileScreen from "../../screens/UserProfileScreen"
import AchievementScreen from '../../screens/AchievementScreen';
import NotificationScreen from '../../screens/NotificationScreen';
import AddObservationScreen from '../../screens/AddObservationScreen';

const Tab = createBottomTabNavigator();

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

//TODO - give types to these props, refer to LoginScreen to see how
//custom bottom navigator
function MyBottomNavigtor({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) {
    return (
        <View style={styles.tabContainer}>
            {state.routes.map((route: any, index: any) => {
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
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
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

export default function BottomNavigator() {
    return (
        <Tab.Navigator tabBar={props => <MyBottomNavigtor {...props} />}  >
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Rewards" component={AchievementScreen} />
        <Tab.Screen name="Add" component={AddObservationScreen} />
        <Tab.Screen name="Notifica" component={NotificationScreen} />
        <Tab.Screen name="Profile" component={UserProfileScreen} />
        </Tab.Navigator>
    );
}