import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {LoginScreen, RegisterScreen} from 'src/screens/auth';

export type AuthStackParamList = {
    Register: undefined;
    Login: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;