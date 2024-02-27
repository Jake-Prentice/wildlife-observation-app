import { BottomTabParamList } from '@/navigation/BottomTabNavigator';
import { ObservationStackParamList } from '@/navigation/ObservationStackNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export type AddScreenRouteProp = RouteProp<ObservationStackParamList, 'AddObservation'>;
export type AddScreenNavigationProp = BottomTabNavigationProp<ObservationStackParamList,'AddObservation'>;

type Props = {
    route: AddScreenRouteProp;
};

const AddObservationScreen = ({ route }: Props) => {
    useEffect(() => {
        console.log("camera", route.params?.photo.uri);
    }, [route.params?.photo]);

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={route.params?.photo.uri}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    image: {
        width: "50%",
        height: "50%",
        backgroundColor: '#0553',
      },
});

export default AddObservationScreen;