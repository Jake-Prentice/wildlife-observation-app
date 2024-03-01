import BottomTabNavigator from 'src/navigation/BottomTabNavigator';
import ObservationStackNavigator from 'src/navigation/ObservationStackNavigator';
import { ObservationProvider } from 'src/contexts/ObservationContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute} from '@react-navigation/native';

const RootStack = createNativeStackNavigator();

//this is so fucking scuffed, but I can't find any other solution
function getMainHeaderTitle(route:any) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Map';
  switch (routeName) {
    case 'Map':
      return 'Map';
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

export type AuthStackParamList = {
    Main: undefined;
    Observation: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator = () => {
  return (
    <ObservationProvider>
      <AuthStack.Navigator>
        <AuthStack.Screen 
                name="Main" 
                component={BottomTabNavigator} 
                options={({ route }) => ({headerTitle: getMainHeaderTitle(route)})}
            />
            <AuthStack.Screen 
                name="Observation" 
                component={ObservationStackNavigator} 
                options={({ route }) => ({headerTitle: getObservationHeaderTitle(route)})}
            />
      </AuthStack.Navigator>
    </ObservationProvider>
  );
};

export default AuthStackNavigator;