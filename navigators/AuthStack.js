import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
const Stack = createNativeStackNavigator();
import SignInScreen from '../screens/Auth/SignInScreen';
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignInScreen" component={SignInScreen}/>
    </Stack.Navigator>
  )
}

export default AuthStack

const styles = StyleSheet.create({})