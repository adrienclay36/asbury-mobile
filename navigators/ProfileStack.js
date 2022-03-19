import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
const Stack = createNativeStackNavigator();
import ProfileScreen from '../screens/Profile/ProfileScreen';
const ProfileStack = () => {
  return (
    <View style={{flex: 1,}} collapsable={false}>
        <Stack.Navigator>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen}/>
        </Stack.Navigator>
    </View>
  )
}

export default ProfileStack

const styles = StyleSheet.create({})