import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import HomeTabNavigator from './HomeTabNavigator'
const Drawer = createDrawerNavigator();
import ProfileStack from './ProfileStack';
import DrawerContent from '../components/DrawerContent/DrawerContent';
const MainDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={HomeTabNavigator} />
      <Drawer.Screen name="ProfileStack" component={ProfileStack} />
    </Drawer.Navigator>
  );
}

export default MainDrawerNavigator

const styles = StyleSheet.create({})