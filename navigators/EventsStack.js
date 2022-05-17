import { StyleSheet, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EventsHomeScreen from "../screens/Events/EventsHomeScreen";
import BasicHeaderMenu from "../components/Headers/BasicHeaderMenu";
import EventDetailsScreen from "../screens/Events/EventDetailsScreen";
const Stack = createNativeStackNavigator();
const EventsStack = () => {
    
  return (

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          
          name="EventsHomeScreen"
          component={EventsHomeScreen}
        />
        <Stack.Screen options={{ headerShown: false, presentation: 'formSheet' }}  name="EventDetailsScreen" component={EventDetailsScreen} />
      </Stack.Navigator>
   
  );
};

export default EventsStack;

const styles = StyleSheet.create({});
