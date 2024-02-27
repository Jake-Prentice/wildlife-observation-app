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
// import AuthStackNavigator from './navigation/AuthStackNavigtor';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import ObservationStackNavigator from './navigation/ObservationStackNavigator';

const RootStack = createNativeStackNavigator();


 

const Routes = () => {
  const user = useUser();
  return (
    <RootStack.Navigator screenOptions={{headerShown: true}}>
        {!user.info ? (
          <>
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
        <>
          <RootStack.Screen name="main" component={BottomTabNavigator} />
          <RootStack.Screen name="observation" component={ObservationStackNavigator} />
        </>)}
    </RootStack.Navigator>
  );
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
