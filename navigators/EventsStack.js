import { StyleSheet, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EventsHomeScreen from "../screens/Events/EventsHomeScreen";
import BasicHeaderMenu from "../components/Headers/BasicHeaderMenu";
import EventDetailsScreen from "../screens/Events/EventDetailsScreen";
const Stack = createNativeStackNavigator();
const EventsStack = () => {
    
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <Stack.Navigator>
        <Stack.Screen
          options={({ route }) => ({
            
            header: (props) => (
              <BasicHeaderMenu {...props} props={props} route={route} />
            ),
          })}
          name="EventsHomeScreen"
          component={EventsHomeScreen}
        />
        <Stack.Screen options={{ headerShown: false, presentation: 'formSheet' }}  name="EventDetailsScreen" component={EventDetailsScreen} />
      </Stack.Navigator>
    </View>
  );
};

export default EventsStack;

const styles = StyleSheet.create({});
