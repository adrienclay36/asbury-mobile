import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GivingHomePage from "../screens/Giving/GivingHomePage";
const Stack = createNativeStackNavigator();
import { StripeProvider } from "@stripe/stripe-react-native";
import NewSubscriptionScreen from "../screens/Giving/NewSubscriptionScreen";
import axios from "axios";
import NoAccountScreen from "../screens/Giving/NoAccountScreen";
import LottieView from 'lottie-react-native';
import OneTimeDonationScreen from "../screens/Giving/OneTimeDonationScreen";
import { UserContext } from "../store/UserProvider";
import { SERVER_URL } from "../constants/serverURL";
const GivingStack = () => {
  const userContext = useContext(UserContext);
  const [publishableKey, setPublishableKey] = useState("");

  const getPublishableKey = async () => {
    const response = await axios.get(
      `${SERVER_URL}/keys`
    );

    setPublishableKey(response.data.publishableKey);
  };

  useEffect(() => {
    getPublishableKey();
  }, []);

  if (!publishableKey) {
    return <LottieView autoPlay loop source={require("../loaders/dotloader.json")} />;
  }

  return (
    <StripeProvider publishableKey={publishableKey}>
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
    </StripeProvider>
  );
};

export default GivingStack;

const styles = StyleSheet.create({});
