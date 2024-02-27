//native
import { StatusBar } from 'expo-status-bar';
//gluestack
import {GluestackUIProvider} from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config" // Optional if you want to use default theme
//react navigation
import { NavigationContainer, getFocusedRouteNameFromRoute} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//screens
import {LoginScreen, RegisterScreen} from './screens/auth';
import { UserProvider, useUser } from './contexts/UserContext';
//navigation
import BottomTabNavigator from './navigation/BottomTabNavigator';
import ObservationStackNavigator from './navigation/ObservationStackNavigator';

const RootStack = createNativeStackNavigator();

//this is so fucking scuffed, but I can't find any other solution
function getMainHeaderTitle(route:any) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Map';
  switch (routeName) {
    case 'Map':
      return 'Map feed';
    case 'Profile':
      return 'My profile';
    case 'Notifica':
      return 'Notifications';
    case 'Rewards':
      return 'Rewards';
  }
}

const getObservationHeaderTitle = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Add Observation';
    switch (routeName) {
        case 'AddObservation':
            return 'Add observation';
    }
}
const Routes = () => {
  const user = useUser();
  return (
    <RootStack.Navigator >
        {!user.info ? (
          <>
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
        <>
          <RootStack.Screen 
              name="Main" 
              component={BottomTabNavigator} 
              options={({ route }) => ({headerTitle: getMainHeaderTitle(route)})}
          />
          <RootStack.Screen 
              name="Observation" 
              component={ObservationStackNavigator} 
              options={({ route }) => ({headerTitle: getObservationHeaderTitle(route)})}
          />
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
