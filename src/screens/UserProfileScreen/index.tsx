import { useUser } from '@/contexts/UserContext';
import { Button, ButtonText} from '@gluestack-ui/themed';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import {testAdd, testGet} from "src/services/observations"

const UserProfileScreen = () => {
    const user = useUser(); 

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the User Profile Screen!</Text>
            <Button
                onPress={user.logout}
                size="md"
                variant="solid"
                action="primary"
                isDisabled={false}
                isFocusVisible={false}
                >
                <ButtonText>Logout </ButtonText>
            </Button>
            {/* <Button
                onPress={testAdd}
                size="md"
                variant="solid"
                action="primary"
                isDisabled={false}
                isFocusVisible={false}
                >
                <ButtonText>Test Firestore </ButtonText>
            </Button>
            <Button
                onPress={testGet}
                size="md"
                variant="solid"
                action="primary"
                isDisabled={false}
                isFocusVisible={false}
                >
                <ButtonText>Test Get Firestore </ButtonText>
            </Button> */}
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

export default UserProfileScreen;