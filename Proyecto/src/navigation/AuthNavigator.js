import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          animationEnabled: true,
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
