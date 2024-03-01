//native
import { StatusBar } from 'expo-status-bar';
//gluestack
import {GluestackUIProvider} from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config" // Optional if you want to use default theme
//react navigation
import { NavigationContainer} from '@react-navigation/native';
//screens
import {LoginScreen, RegisterScreen} from './screens/auth';
import { UserProvider, useUser } from './contexts/UserContext';
//navigation
import AuthStackNavigator from './navigation/AuthStackNavigtor';
import UnAuthStackNavigator from './navigation/UnAuthStackNavigator';

const Routes = () => {
  const user = useUser(); 
  if (user.info) return <AuthStackNavigator />;
  return <UnAuthStackNavigator />;
};

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
