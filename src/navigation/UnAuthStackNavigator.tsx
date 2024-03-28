import { LoginScreen, RegisterScreen } from "@/screens/auth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const UnauthStack = createNativeStackNavigator();

export type UnAuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const UnAuthStackNavigator = () => {
  return (
    <UnauthStack.Navigator screenOptions={{headerShown: false}} >
      <UnauthStack.Screen name="Login" component={LoginScreen} />
      <UnauthStack.Screen name="Register" component={RegisterScreen} />
    </UnauthStack.Navigator>
  );
};

export default UnAuthStackNavigator