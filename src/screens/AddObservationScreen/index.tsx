import { BottomTabParamList } from '@/navigation/BottomTabNavigator';
import { ObservationStackParamList } from '@/navigation/ObservationStackNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';


export type AddScreenRouteProp = RouteProp<ObservationStackParamList, 'AddObservation'>;
export type AddScreenNavigationProp = BottomTabNavigationProp<ObservationStackParamList,'AddObservation'>;

type Props = {
    route: AddScreenRouteProp;
};

const AddObservationScreen = ({ route }: Props) => {
    useEffect(() => {
        console.log("camera", route.params?.photo);
    }, [route.params?.photo]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Add observation Screen!</Text>
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
});

export default AddObservationScreen;