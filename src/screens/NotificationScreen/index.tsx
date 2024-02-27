import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Notificaiton Screen!</Text>
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

export default NotificationScreen;  