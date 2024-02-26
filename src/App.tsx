//native
import { StatusBar } from 'expo-status-bar';
//gluestack
import {GluestackUIProvider} from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config" // Optional if you want to use default theme
//react navigation
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//screens
import {LoginScreen, RegisterScreen} from './screens/auth';
import { UserProvider, useUser } from './contexts/UserContext';
//navigation
import AuthStackNavigator from './navigation/AuthStackNavigtor';
import BottomTabNavigator from './navigation/BottomTabNavigator';

const Routes = () => {
  const user = useUser();
  //TODO - don't want to show bottom navigator if on AddObservationScreen
  return !user.info ? <AuthStackNavigator /> : <BottomTabNavigator />
}

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <UserProvider>
        <NavigationContainer>
          <Routes />
          <StatusBar style="auto" />
        </NavigationContainer>
      </UserProvider>
    </GluestackUIProvider>
  );
};
