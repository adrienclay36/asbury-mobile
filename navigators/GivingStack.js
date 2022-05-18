import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GivingHomePage from "../screens/Giving/GivingHomePage";
const Stack = createNativeStackNavigator();
import NewSubscriptionScreen from "../screens/Giving/NewSubscriptionScreen";
import NoAccountScreen from "../screens/Giving/NoAccountScreen";
import OneTimeDonationScreen from "../screens/Giving/OneTimeDonationScreen";
import { UserContext } from "../store/UserProvider";
const GivingStack = () => {
  const userContext = useContext(UserContext);
  

 

  return (
  
      <View style={{ flex: 1 }} collapsable={false}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userContext.userInfo && (
            <Stack.Screen
              options={{ headerShown: false }}
              name="GivingHomePage"
              component={GivingHomePage}
            />
          )}
          {userContext.userInfo && (
            <Stack.Screen
              name="NewSubscriptionScreen"
              options={{ headerShown: false, presentation: "formSheet" }}
              component={NewSubscriptionScreen}
            />
          )}
          {userContext.userInfo && (
            <Stack.Screen name="OneTimeDonationScreen" options={{ headerShown: false, presentation: 'formSheet'} } component={OneTimeDonationScreen} />
          )}
          {!userContext.userInfo && <Stack.Screen
            
            name="NoAccountScreen"
            component={NoAccountScreen}
          />}
        </Stack.Navigator>
      </View>

  );
};

export default GivingStack;

const styles = StyleSheet.create({});
