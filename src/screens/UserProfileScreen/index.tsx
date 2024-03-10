import { db } from '@/FirebaseConfig';
import { useUser } from '@/contexts/UserContext';
import { UserStatSchema } from '@/services/schemas';
import { Button, ButtonText} from '@gluestack-ui/themed';
import { User } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import React from 'react';
import styles from './style';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const UserProfileScreen = () => {
    const user = useUser(); 
    const data = user.stats ? Object.keys(user.stats) : []
    
    const renderItem = ({item}: {item:string}) => {
    return <View style={styles.statBox}>
        <Text style={styles.stattext}>{item}</Text>
        <Text style={styles.stattext}>{user.stats![item as keyof UserStatSchema]}</Text>
    </View>
    }

    return (
        <View style={styles.container}>
            <View style={styles.usernameBox}>
                <Text style={styles.title}>Logged in as: {user.info?.displayName}</Text>
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
            <Text style={styles.header}>My stats</Text>
            <FlatList
            style ={styles.statsList} 
            data={data}
            renderItem={renderItem}
            ItemSeparatorComponent={() => {return <View style={styles.line}/>}}
            ListHeaderComponent={() => {return <View style={[styles.line,{marginHorizontal:-10}]}/>}}
            />
            
        </View>
    );
};



export default UserProfileScreen;