import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../screens/SignupScreen';
import PhoneRegistrationScreen from '../screens/PhoneRegistrationScreen';
import VerificationCodeScreen from '../screens/VerificationCodeScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetSuccessScreen from '../screens/ResetSuccessScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import TestScreen from '../screens/TestScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#101112' }
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Test" component={TestScreen} />
      <Stack.Screen name="PhoneRegistration" component={PhoneRegistrationScreen} />
      <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetSuccess" component={ResetSuccessScreen} />
    </Stack.Navigator>
  );
}