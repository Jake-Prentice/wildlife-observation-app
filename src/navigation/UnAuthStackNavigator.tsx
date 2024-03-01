import { LoginScreen, RegisterScreen } from "@/screens/auth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const UnauthStack = createNativeStackNavigator();

const UnAuthStackNavigator = () => {
  return (
    <UnauthStack.Navigator>
      <UnauthStack.Screen name="Login" component={LoginScreen} />
      <UnauthStack.Screen name="Register" component={RegisterScreen} />
    </UnauthStack.Navigator>
  );
};

export default UnAuthStackNavigator