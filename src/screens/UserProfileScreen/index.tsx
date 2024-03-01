import { useUser } from '@/contexts/UserContext';
import { Button, ButtonText} from '@gluestack-ui/themed';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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